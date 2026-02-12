import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Contact } from '../db';
import { ContactRow } from './ContactRow';
import { PaginationControls } from './PaginationControls';

interface ContactTableProps {
  contacts: Contact[];
  onSend: (contact: Contact) => void;
  onBlock: (contact: Contact) => void;
  onBounce: (contact: Contact) => void;
}

export const ContactTable: React.FC<ContactTableProps> = ({ contacts, onSend, onBlock, onBounce }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  if (!contacts.length) {
    return (
      <div className="text-center py-20 text-gray-400 glass-card rounded-lg">
        <p className="text-lg">No contacts loaded.</p>
        <p className="text-sm opacity-60">Upload a file to get started.</p>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(contacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentContacts = contacts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="glass-card rounded-xl overflow-hidden shadow-2xl pb-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-900/60 text-xs uppercase text-gray-400 backdrop-blur-md">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider">Name</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Phone</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
              <th className="px-6 py-4 text-right font-semibold tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/30">
            <AnimatePresence>
                {currentContacts.map((contact, index) => (
                  <ContactRow 
                    key={contact.id}
                    contact={contact}
                    index={index}
                    onSend={onSend}
                    onBlock={onBlock}
                    onBounce={onBounce}
                  />
                ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      <PaginationControls 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        totalItems={contacts.length}
      />
    </div>
  );
};
