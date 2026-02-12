import React from 'react';
import { RefreshCw } from 'lucide-react';

interface MessagePreviewProps {
  previewText: string;
}

export const MessagePreview: React.FC<MessagePreviewProps> = ({ previewText }) => {
  return (
    <div className="mt-6 border-t border-gray-700 pt-4">
        <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-400">Preview (First Contact)</label>
            <button className="text-gray-500 hover:text-white" title="Refresh Preview">
            <RefreshCw size={14} />
            </button>
        </div>
        <div className="bg-whatsapp-dark/10 p-4 rounded-lg border border-whatsapp-dark/20 text-gray-200 text-sm whitespace-pre-wrap min-h-[60px] relative">
            {/* Mock WhatsApp Bubble Style */}
            <div className="bg-[#202c33] p-2 rounded-br-none rounded-lg inline-block max-w-full shadow-sm">
                {previewText ? (
                previewText.split('\n').map((line, i) => (
                    <div key={i} className="min-h-[1.2em]">
                    {line.split(/(\*.*?\*|_.*?_|~.*?~)/g).map((part, j) => {
                        if (part.startsWith('*') && part.endsWith('*')) return <strong key={j} className="font-bold text-gray-100">{part.slice(1, -1)}</strong>;
                        if (part.startsWith('_') && part.endsWith('_')) return <em key={j} className="italic text-gray-100">{part.slice(1, -1)}</em>;
                        if (part.startsWith('~') && part.endsWith('~')) return <del key={j} className="opacity-70">{part.slice(1, -1)}</del>;
                        return <span key={j}>{part}</span>;
                    })}
                    </div>
                ))
                ) : <span className="text-gray-500 italic">No content...</span>}
            </div>
        </div>
    </div>
  );
};
