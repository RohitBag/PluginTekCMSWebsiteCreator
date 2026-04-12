"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { seedData } from "@/utils/seed_data";
import { Check, AlertTriangle, Loader2 } from "lucide-react";

export default function SeedPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const supabase = createClient();

    const runSeed = async () => {
        setStatus("loading");
        setMessage("Starting seeding process...");

        try {
            // 1. Seed Site Settings
            setMessage("Seeding Site Settings...");
            const { error: settingsError } = await supabase
                .from('site_settings')
                .upsert(seedData.site_settings);

            if (settingsError) throw settingsError;

            // 2. Seed Services
            setMessage("Seeding Services...");
            // First clear existing services to avoid duplicates if running multiple times without ID
            await supabase.from('services').delete().neq('id', -1);
            const { error: servicesError } = await supabase
                .from('services')
                .insert(seedData.services);

            if (servicesError) throw servicesError;

            // 3. Seed Projects & Images
            setMessage("Seeding Projects...");
            await supabase.from('projects').delete().neq('id', -1);

            for (const project of seedData.projects) {
                const { data: projectData, error: projectError } = await supabase
                    .from('projects')
                    .insert({
                        title: project.title,
                        location: project.location,
                        thumbnail_url: project.thumbnail_url
                    })
                    .select()
                    .single();

                if (projectError) throw projectError;

                if (projectData && project.images.length > 0) {
                    const imagesToInsert = project.images.map(img => ({
                        project_id: projectData.id,
                        image_url: img
                    }));

                    const { error: imagesError } = await supabase
                        .from('project_images')
                        .insert(imagesToInsert);

                    if (imagesError) throw imagesError;
                }
            }

            setStatus("success");
            setMessage("Database successfully seeded!");

        } catch (error: any) {
            console.error("Seeding Error:", error);
            setStatus("error");
            setMessage(error.message || "An error occurred during seeding.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-8 text-center shadow-lg">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Database Seeder</h1>
                <p className="text-gray-500 mb-8">
                    This tool will populate your Supabase database with the initial content from the static website.
                    <br />
                    <span className="text-primary text-sm font-medium block mt-2">
                        Warning: This may overwrite existing data.
                    </span>
                </p>

                {status === "idle" && (
                    <button
                        onClick={runSeed}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                        Start Seeding
                    </button>
                )}

                {status === "loading" && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
                        <p className="text-gray-600 dark:text-gray-300">{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center">
                        <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <Check size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-green-600 mb-2">Seeding Complete!</h3>
                        <p className="text-gray-600 dark:text-gray-400">Your database is now ready.</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center">
                        <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-red-600 mb-2">Seeding Failed</h3>
                        <p className="text-red-500">{message}</p>
                        <button
                            onClick={runSeed}
                            className="mt-4 text-sm text-blue-500 hover:underline"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
