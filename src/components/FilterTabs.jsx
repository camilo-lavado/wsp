import React from 'react';
import { clsx } from 'clsx';

export const FilterTabs = ({ filter, setFilter, contacts }) => {
  return (
    <div className="flex gap-2 border-b border-gray-700 pb-1">
        {['all', 'pending', 'sent', 'error'].map(f => (
            <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                    "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative top-[1px]",
                    filter === f 
                        ? "bg-surface-card text-whatsapp-light border-t border-x border-gray-700" 
                        : "text-gray-500 hover:text-gray-300"
                )}
            >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="ml-2 text-xs bg-gray-800 px-1.5 py-0.5 rounded-full text-gray-400">
                    {contacts.filter(c => {
                        if (f === 'all') return true;
                        if (f === 'pending') return c.status === 'pending';
                        if (f === 'sent') return c.status === 'sent';
                        if (f === 'error') return c.status === 'failed' || !c.data._isValid;
                    }).length}
                </span>
            </button>
        ))}
    </div>
  );
};
