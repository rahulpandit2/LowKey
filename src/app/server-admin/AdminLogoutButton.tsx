'use client';

export default function AdminLogoutButton() {
    const handleLogout = async () => {
        await fetch('/api/auth/admin-logout', { method: 'POST' });
        window.location.href = '/server-admin/login';
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 transition-colors"
        >
            Logout
        </button>
    );
}
