import { createClient } from "@/utils/supabase/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { logout } from "@/app/login/actions";
import { redirect } from "next/navigation";
import { User, Mail, Phone, Calendar } from "lucide-react";

export default async function ProfilePage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <main className="min-h-screen bg-white dark:bg-black flex flex-col">
            <Header />
            <div className="flex-grow container mx-auto px-4 max-w-2xl" style={{ paddingTop: '200px', paddingBottom: '160px' }}>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                    {profile?.role === 'admin' && (
                        <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold uppercase">
                            Admin
                        </span>
                    )}
                </div>

                <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-8">

                    <div className="flex items-center gap-6 pb-8 border-b border-gray-100 dark:border-zinc-800">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-400">
                            <User size={40} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {profile?.full_name || 'User'}
                            </h2>
                            <p className="text-gray-500">Member since {new Date(profile?.created_at || Date.now()).getFullYear()}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">Email Address</label>
                            <div className="flex items-center gap-3 text-gray-900 dark:text-white font-medium">
                                <Mail size={18} className="text-primary" />
                                {profile?.email}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">Phone Number</label>
                            <div className="flex items-center gap-3 text-gray-900 dark:text-white font-medium">
                                <Phone size={18} className="text-primary" />
                                {profile?.phone || 'Not provided'}
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 dark:border-zinc-800">
                        <form action={logout}>
                            <button type="submit" className="w-full py-3 border border-red-200 dark:border-red-900/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-medium transition-colors">
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
