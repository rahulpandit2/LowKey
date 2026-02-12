'use client';

interface HelpConversionProps {
  isHelp: boolean;
  onToggle: (value: boolean) => void;
}

export default function HelpConversion({ isHelp, onToggle }: HelpConversionProps) {
  return (
    <div className="border border-white/[0.05] p-6 rounded-sm bg-card">
      <label className="flex items-start gap-4 cursor-pointer group">
        <input
          type="checkbox"
          checked={isHelp}
          onChange={(e) => onToggle(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 border rounded-sm mt-0.5 flex items-center justify-center transition-colors ${
            isHelp ? 'border-primary bg-primary' : 'border-zinc-600 group-hover:border-white'
          }`}
        >
          {isHelp && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-white font-medium mb-2 text-sm">Make this a Help post (anonymous)</h4>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Your profile won't be visible. Responders will see constrained empathetic fields. You
            can mark responses helpful privately, and optionally provide a private follow-up link.
          </p>
        </div>
      </label>
    </div>
  );
}
