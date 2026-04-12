"use client";

import { Plus, Trash2, Edit2, GripVertical, Loader2 } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Service, addService, updateService, deleteService } from "@/app/admin/services/actions";
import { useRouter } from "next/navigation";

export default function ServicesManager({ initialServices }: { initialServices: Service[] }) {
    const [services, setServices] = useState<Service[]>(initialServices);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleOpen = (service?: Service) => {
        setEditingService(service || null);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingService(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const data = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            icon: formData.get("icon") as string,
            page_url: formData.get("page_url") as string,
            display_order: parseInt(formData.get("display_order") as string) || 0,
        };

        let result;
        if (editingService) {
            result = await updateService(editingService.id, data);
        } else {
            result = await addService(data);
        }

        setIsLoading(false);
        if (result.success) {
            handleClose();
            router.refresh();
            // Optimistic update or just wait for refresh? 
            // For simplicity, relying on refresh since we passed initialServices and router.refresh() will re-render server component.
            // But to update immediate UI without flicker, we could also update local state.
            // Let's rely on router.refresh() for data consistency for now.
        } else {
            alert(result.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        setIsLoading(true);
        const result = await deleteService(id);
        setIsLoading(false);
        if (result.success) {
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h2>
                    <p className="text-gray-500 mt-1">Manage the services listed on the homepage.</p>
                </div>
                <button
                    onClick={() => handleOpen()}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
                >
                    <Plus size={18} />
                    Add Service
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white w-10"></th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Title</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Icon</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Description</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {initialServices.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No services found. Add one to get started.
                                    </td>
                                </tr>
                            ) : (
                                initialServices.map((service) => (
                                    <tr key={service.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-400 cursor-move"><GripVertical size={16} /></td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {service.title}
                                            {service.page_url && (
                                                <span className="block text-xs text-blue-500 font-normal truncate mt-1">
                                                    🔗 {service.page_url}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500 text-center">
                                            <i className={service.icon}></i>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-md truncate">{service.description}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpen(service)}
                                                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(service.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                title={editingService ? "Edit Service" : "Add New Service"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Title</label>
                        <input
                            name="title"
                            type="text"
                            defaultValue={editingService?.title}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon Name (FontAwesome)</label>
                        <input
                            name="icon"
                            type="text"
                            placeholder="e.g., paint-roller"
                            defaultValue={editingService?.icon}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                            Linked Page URL 
                            <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <input
                            name="page_url"
                            type="text"
                            placeholder="e.g., /p/my-service or https://..."
                            defaultValue={editingService?.page_url}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 font-mono text-sm focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            defaultValue={editingService?.description}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Order</label>
                        <input
                            name="display_order"
                            type="number"
                            defaultValue={editingService?.display_order || 0}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading && <Loader2 className="animate-spin" size={16} />}
                            {editingService ? "Save Changes" : "Add Service"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
