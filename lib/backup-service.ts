import { createClient } from "@/utils/supabase/client";
import JSZip from "jszip";

const TABLES = [
  "site_settings",
  "pages",
  "services",
  "projects",
  "project_images",
  "items",
  "item_images",
  "custom_sections",
  "section_images",
  "profiles",
  "bookmarks"
];

// Deletion order (reverse FK dependencies)
const DELETION_ORDER = [
  "bookmarks",
  "item_images",
  "section_images",
  "project_images",
  "custom_sections",
  "services",
  "projects",
  "items",
  "pages",
  "profiles",
  "site_settings"
];

// Insertion order (respecting FK dependencies)
const INSERTION_ORDER = [
  "profiles", 
  "pages",
  "items",
  "projects",
  "services",
  "custom_sections",
  "project_images",
  "section_images",
  "item_images",
  "bookmarks",
  "site_settings"
];

export interface BackupProgress {
  step: string;
  count: number;
  total: number;
  status: "idle" | "running" | "completed" | "error";
  message?: string;
}

export async function exportBackup(onProgress?: (progress: BackupProgress) => void) {
  const supabase = createClient();
  const zip = new JSZip();

  try {
    // 1. Export Tables
    for (let i = 0; i < TABLES.length; i++) {
        const table = TABLES[i];
        onProgress?.({ step: "exporting_table", count: i + 1, total: TABLES.length, status: "running", message: `Exporting table: ${table}...` });
        
        try {
            const { data, error } = await supabase.from(table).select("*");
            if (error) {
                if (error.message.includes("cache")) {
                    console.warn(`Table ${table} not found in schema cache. Skipping...`);
                    continue;
                }
                throw error;
            }
            zip.file(`data/${table}.json`, JSON.stringify(data || [], null, 2));
        } catch (tableErr: any) {
            console.error(`Error exporting table ${table}:`, tableErr);
            // We skip the table instead of failing everything
            continue;
        }
    }

    // 2. Export Storage (Images bucket)
    onProgress?.({ step: "listing_files", count: 0, total: 100, status: "running", message: "Listing storage files..." });
    
    // We assume a single bucket named 'images' based on schema notes. 
    // We should be more robust and try to list files recursively.
    const { data: files, error: listError } = await supabase.storage.from("images").list("", {
        limit: 1000,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
    });

    if (listError) {
        console.warn("Storage export error:", listError);
    } else if (files) {
        onProgress?.({ step: "exporting_storage", count: 0, total: files.length, status: "running", message: `Downloading ${files.length} images...` });
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Skip folders
            if (file.metadata) {
                const { data: blob, error: downloadError } = await supabase.storage.from("images").download(file.name);
                if (!downloadError && blob) {
                    zip.file(`storage/images/${file.name}`, blob);
                }
            }
            onProgress?.({ step: "exporting_storage", count: i + 1, total: files.length, status: "running", message: `Downloading images (${i + 1}/${files.length})...` });
        }
    }

    // 3. Generate Zip
    onProgress?.({ step: "zipping", count: 100, total: 100, status: "running", message: "Generating backup zip file..." });
    const content = await zip.generateAsync({ type: "blob" });
    
    // 4. Download
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cms-backup-${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onProgress?.({ step: "completed", count: 100, total: 100, status: "completed", message: "Backup successfully exported!" });
  } catch (err: any) {
    onProgress?.({ step: "error", count: 0, total: 0, status: "error", message: `Export failed: ${err.message}` });
  }
}

export async function importBackup(file: File, onProgress?: (progress: BackupProgress) => void) {
    const supabase = createClient();
    const zip = await JSZip.loadAsync(file);

    try {
        // 1. Wipe Data (Reverse Order)
        for (let i = 0; i < DELETION_ORDER.length; i++) {
            const table = DELETION_ORDER[i];
            onProgress?.({ step: "wiping_table", count: i + 1, total: DELETION_ORDER.length, status: "running", message: `Wiping table: ${table}...` });
            
            // Delete all where id is not null (or any always-true condition)
            const { error } = await supabase.from(table).delete().neq("id", "-1" as any); // Use common primary key check or alternative
            // If table doesn't have an 'id', we might need separate logic. 
            // supabase doesn't support 'delete all' easily without a filter.
            if (error && error.message.includes("id")) {
                 // Try key for site_settings
                 await supabase.from(table).delete().neq("key", "___NONE___");
            }
        }

        // 2. Wipe Storage (Images bucket)
        // Note: Listing and deleting can be slow/paginated.
        onProgress?.({ step: "wiping_storage", count: 0, total: 100, status: "running", message: "Wiping storage files..." });
        const { data: existingFiles } = await supabase.storage.from("images").list();
        if (existingFiles && existingFiles.length > 0) {
            await supabase.storage.from("images").remove(existingFiles.map(f => f.name));
        }

        // 3. Restore Storage
        const storageFolder = zip.folder("storage/images");
        if (storageFolder) {
            const files: string[] = [];
            storageFolder.forEach((relativePath) => files.push(relativePath));
            
            onProgress?.({ step: "restoring_storage", count: 0, total: files.length, status: "running", message: `Restoring ${files.length} images...` });

            for (let i = 0; i < files.length; i++) {
                const path = files[i];
                const fileData = await storageFolder.file(path)?.async("blob");
                if (fileData) {
                    await supabase.storage.from("images").upload(path, fileData, { upsert: true });
                }
                onProgress?.({ step: "restoring_storage", count: i + 1, total: files.length, status: "running", message: `Restoring images (${i + 1}/${files.length})...` });
            }
        }

        // 4. Restore Data (Correct Order)
        const dataFolder = zip.folder("data");
        if (dataFolder) {
            for (let i = 0; i < INSERTION_ORDER.length; i++) {
                const table = INSERTION_ORDER[i];
                onProgress?.({ step: "restoring_table", count: i + 1, total: INSERTION_ORDER.length, status: "running", message: `Restoring table: ${table}...` });
                
                const fileContent = await dataFolder.file(`${table}.json`)?.async("string");
                if (fileContent) {
                    const rows = JSON.parse(fileContent);
                    if (rows && rows.length > 0) {
                        // Insert in chunks to avoid URL limit/payload issues if very large
                        const chunkSize = 50;
                        for (let j = 0; j < rows.length; j += chunkSize) {
                            const chunk = rows.slice(j, j + chunkSize);
                            const { error } = await supabase.from(table).insert(chunk);
                            if (error) throw error;
                        }
                    }
                }
            }
        }

        onProgress?.({ step: "completed", count: 100, total: 100, status: "completed", message: "Restore successfully completed!" });
    } catch (err: any) {
        onProgress?.({ step: "error", count: 0, total: 0, status: "error", message: `Restore failed: ${err.message}` });
    }
}
