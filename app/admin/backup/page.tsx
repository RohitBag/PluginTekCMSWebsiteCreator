"use client";

import { useState } from "react";
import { Download, Upload, AlertTriangle, CheckCircle2, ShieldAlert, Loader2, FileArchive } from "lucide-react";
import { exportBackup, importBackup, BackupProgress } from "@/lib/backup-service";
import clsx from "clsx";

export default function BackupPage() {
    const [progress, setProgress] = useState<BackupProgress | null>(null);
    const [confirmRestore, setConfirmRestore] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleExport = async () => {
        await exportBackup((p) => setProgress(p));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleRestore = async () => {
        if (!selectedFile) return;
        setConfirmRestore(false);
        await importBackup(selectedFile, (p) => setProgress(p));
    };

    const isRunning = progress?.status === "running";

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Backup & Restore</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Export your entire website (database and images) as a single ZIP file or restore a previous backup.
                </p>
            </div>

            {/* Status Panel */}
            {progress && (
                <div className={clsx(
                    "p-6 rounded-xl border-2 transition-all duration-300",
                    progress.status === "error" ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50" :
                    progress.status === "completed" ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50" :
                    "bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/50"
                )}>
                    <div className="flex items-center gap-4 mb-4">
                        {progress.status === "running" && <Loader2 className="w-6 h-6 animate-spin text-purple-600" />}
                        {progress.status === "completed" && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                        {progress.status === "error" && <ShieldAlert className="w-6 h-6 text-red-600" />}
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                            {progress.status === "running" ? "Processing..." : 
                             progress.status === "completed" ? "Success" : 
                             progress.status === "error" ? "Failure" : "Status"}
                        </h3>
                    </div>
                    
                    <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{progress.message}</p>
                    
                    {progress.total > 0 && (
                        <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                            <div 
                                className={clsx(
                                    "h-full transition-all duration-300",
                                    progress.status === "error" ? "bg-red-500" : "bg-purple-600"
                                )}
                                style={{ width: `${(progress.count / progress.total) * 100}%` }}
                            />
                        </div>
                    )}
                    
                    {progress.status === "completed" && (
                        <button 
                            onClick={() => setProgress(null)}
                            className="mt-4 text-sm font-medium text-purple-600 hover:text-purple-700 underline"
                        >
                            Dismiss
                        </button>
                    )}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Export Section */}
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                        <Download className="text-purple-600 dark:text-purple-400" size={24} />
                    </div>
                    <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Create Full Backup</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                        Downloads all your pages, settings, gallery images, and blog posts into a single, secure ZIP file.
                    </p>
                    <button
                        onClick={handleExport}
                        disabled={isRunning}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {isRunning && progress?.step.startsWith("exporting") ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download size={20} />}
                        Export Website (.zip)
                    </button>
                </div>

                {/* Restore Section */}
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-6">
                        <Upload className="text-amber-600 dark:text-amber-400" size={24} />
                    </div>
                    <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Restore from Backup</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed text-balance">
                        Upload a previously exported ZIP file to restore your entire site content. <span className="text-red-500 font-bold italic">Warning: This will overwrite CURRENT data.</span>
                    </p>
                    
                    <div className="space-y-4">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FileArchive className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {selectedFile ? selectedFile.name : <span className="font-semibold text-amber-600">Click to select backup file</span>}
                                </p>
                            </div>
                            <input type="file" className="hidden" accept=".zip" onChange={handleFileChange} disabled={isRunning} />
                        </label>

                        {selectedFile && !confirmRestore && (
                            <button
                                onClick={() => setConfirmRestore(true)}
                                disabled={isRunning}
                                className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={20} />
                                Start Restore
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirm Restore Dialog */}
            {confirmRestore && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-900 max-w-md w-full rounded-2xl shadow-2xl p-8 border border-red-200 dark:border-red-900/30 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-4 mb-6 text-red-600">
                            <AlertTriangle size={32} />
                            <h2 className="text-2xl font-bold">Destroy Existing Content?</h2>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            Restoring will **permanently delete** all current pages, images, and settings on this site and replace them with the data from: 
                            <br/><span className="font-mono text-xs font-bold text-gray-900 dark:text-white mt-1 block">{selectedFile?.name}</span>
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleRestore}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-500/20"
                            >
                                Yes, Delete All and Restore
                            </button>
                            <button
                                onClick={() => setConfirmRestore(false)}
                                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
