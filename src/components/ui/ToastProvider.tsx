'use client';


import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'achievement';

interface Toast {
    id: number;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextValue {
    addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
    return ctx;
}

const typeStyles: Record<ToastType, { bg: string; border: string; icon: string }> = {
    success: { bg: 'bg-green-500/5', border: 'border-green-500/20', icon: '✓' },
    error: { bg: 'bg-red-500/5', border: 'border-red-500/20', icon: '✕' },
    info: { bg: 'bg-blue-500/5', border: 'border-blue-500/20', icon: 'ℹ' },
    achievement: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', icon: '🏆' },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) {
    const [isExiting, setIsExiting] = useState(false);
    const style = typeStyles[toast.type];

    useEffect(() => {
        const duration = toast.duration || (toast.type === 'achievement' ? 5000 : 3000);
        const exitTimer = setTimeout(() => setIsExiting(true), duration - 300);
        const removeTimer = setTimeout(() => onRemove(toast.id), duration);
        return () => { clearTimeout(exitTimer); clearTimeout(removeTimer); };
    }, [toast, onRemove]);

    return (
        <div
            className={`
        flex items-start gap-3 px-5 py-4 rounded-sm border backdrop-blur-sm
        ${style.bg} ${style.border}
        transition-all duration-300 ease-out
        ${isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
      `}
            style={{
                animation: 'slideIn 0.3s ease-out',
                minWidth: '280px',
                maxWidth: '400px',
            }}
        >
            <span className="text-base mt-0.5 flex-shrink-0">{style.icon}</span>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">{toast.title}</p>
                {toast.message && (
                    <p className="text-xs text-zinc-400 mt-0.5">{toast.message}</p>
                )}
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="text-zinc-600 hover:text-white transition-colors flex-shrink-0 text-xs mt-0.5"
            >
                ✕
            </button>
        </div>
    );
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const counterRef = useRef(0);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = ++counterRef.current;
        setToasts((prev) => [...prev.slice(-4), { ...toast, id }]); // max 5 toasts
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-auto">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>

            {/* Keyframes */}
            <style jsx global>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </ToastContext.Provider>
    );
}
