"use client";

import { Trash2, KeyRound } from 'lucide-react';
import { resetUserPassword, deleteUser } from './actions';

interface UserActionsProps {
    userEmail: string;
    userId: string;
    isUserAdmin: boolean;
}

export default function UserActions({ userEmail, userId, isUserAdmin }: UserActionsProps) {
    const handleResetPassword = async () => {
        const result = await resetUserPassword(userEmail);
        if (result.success) {
            alert('Password reset email sent!');
        } else {
            alert('Error: ' + result.error);
        }
    };

    const handleDeleteUser = async () => {
        if (confirm('Are you sure you want to delete this user?')) {
            const result = await deleteUser(userId);
            if (result.error) {
                alert('Error: ' + result.error);
            }
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <button
                onClick={handleResetPassword}
                title="Reset Password"
                className="p-2 hover:bg-primary/5 dark:hover:bg-amber-900/20 text-gray-400 hover:text-primary rounded-lg transition-colors"
            >
                <KeyRound size={18} />
            </button>

            {!isUserAdmin && (
                <button
                    onClick={handleDeleteUser}
                    title="Delete User"
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            )}
        </div>
    );
}
