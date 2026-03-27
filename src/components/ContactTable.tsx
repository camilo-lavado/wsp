import React, { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Contact } from '../db';
import { ContactRow } from './ContactRow';
import { useVirtualizer } from '@tanstack/react-virtual';

interface ContactTableProps {
  contacts: Contact[];
  onSend: (contact: Contact) => void;
  onBlock: (contact: Contact) => void;
  onBounce: (contact: Contact) => void;
}

export const ContactTable: React.FC<ContactTableProps> = ({ contacts, onSend, onBlock, onBounce }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: contacts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // estimated height of ContactRow
    overscan: 10,
  });

  if (!contacts.length) {
    return (
      <div className="text-center py-20 text-gray-400 glass-card rounded-lg">
        <p className="text-lg">No contacts loaded.</p>
        <p className="text-sm opacity-60">Upload a file to get started.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden shadow-2xl flex flex-col translate-z-0">
      <div 
        ref={parentRef} 
        className="overflow-auto" 
        style={{ height: '600px' }} // Fixed height for virtualizer
      >
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
          <table className="w-full text-left text-sm text-gray-300 absolute top-0 left-0">
            <thead className="bg-gray-900/90 text-xs uppercase text-gray-400 backdrop-blur-md sticky top-0 z-10 shadow-md">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Name</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Phone</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-4 text-right font-semibold tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              <AnimatePresence>
                  {rowVirtualizer.getVirtualItems().length > 0 && (
                    <tr style={{ height: `${rowVirtualizer.getVirtualItems()[0].start}px` }} />
                  )}
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const contact = contacts[virtualRow.index];
                    return (
                      <ContactRow 
                        key={contact.id}
                        contact={contact}
                        index={virtualRow.index}
                        onSend={onSend}
                        onBlock={onBlock}
                        onBounce={onBounce}
                      />
                    );
                  })}
                  {rowVirtualizer.getVirtualItems().length > 0 && (
                    <tr style={{ height: `${rowVirtualizer.getTotalSize() - rowVirtualizer.getVirtualItems()[rowVirtualizer.getVirtualItems().length - 1].end}px` }} />
                  )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
