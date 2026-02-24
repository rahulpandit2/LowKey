type LogLevel = 'info' | 'warn' | 'error';

export const logger = {
    info: (action: string, metadata: any = {}) => {
        sendLog('info', action, metadata);
    },
    warn: (action: string, metadata: any = {}) => {
        sendLog('warn', action, metadata);
    },
    error: (action: string, metadata: any = {}) => {
        // Strip out Error objects for transmission
        const safeMeta = { ...metadata };
        if (safeMeta instanceof Error) {
            safeMeta.message = safeMeta.message;
            safeMeta.name = safeMeta.name;
        }
        sendLog('error', action, safeMeta);
    }
};

function sendLog(level: LogLevel, action: string, metadata: any) {
    // Fire and forget
    fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, action, metadata }),
    }).catch(() => { /* do nothing */ });
}
