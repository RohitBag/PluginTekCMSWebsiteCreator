"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function DebugAuthPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function check() {
            try {
                const supabase = createClient();
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                setUser(user);

                if (authError) throw authError;

                if (user) {
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    setProfile(profile);
                    if (profileError) throw profileError;
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        check();
    }, []);

    if (loading) return <div>Loading debug info...</div>;

    return (
        <div className="p-8 font-mono text-sm overflow-auto">
            <h1 className="text-xl font-bold mb-4">Auth Debugger</h1>

            <div className="mb-8">
                <h2 className="font-bold">User (Auth)</h2>
                <pre className="bg-gray-100 p-4 rounded mb-2 w-full">{JSON.stringify(user, null, 2)}</pre>
            </div>

            <div className="mb-8">
                <h2 className="font-bold">Profile (DB)</h2>
                {profile ? (
                    <pre className="bg-green-50 p-4 rounded mb-2 w-full text-green-800">{JSON.stringify(profile, null, 2)}</pre>
                ) : (
                    <div className="bg-red-50 p-4 rounded text-red-500">No profile found or error reading profile.</div>
                )}
            </div>

            <div className="mb-8">
                <h2 className="font-bold">Errors</h2>
                <pre className="bg-red-50 p-4 rounded mb-2 w-full text-red-600">{JSON.stringify(error, null, 2)}</pre>
            </div>

            <div className="mb-8">
                <h2 className="font-bold">Expected Role</h2>
                <div className="text-lg">
                    Current Role in DB: <strong>{profile?.role || 'N/A'}</strong> {' '}
                    {profile?.role === 'admin' ? '✅ Admin' : '❌ Not Admin'}
                </div>
            </div>
        </div>
    );
}
