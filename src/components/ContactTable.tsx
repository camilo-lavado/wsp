import React, { useState } from 'react';
import { Send, CheckCircle, Clock, AlertCircle, Ban, XCircle, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Contact } from '../db';

interface ContactTableProps {
  contacts: Contact[];
  onSend: (contact: Contact) => void;
  onBlock: (contact: Contact) => void;
  onBounce: (contact: Contact) => void;
}

export const ContactTable: React.FC<ContactTableProps> = ({ contacts, onSend, onBlock, onBounce }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
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

  const formatPhone = (phone: any) => {
    return phone ? String(phone).replace(/[^0-9+]/g, '') : 'N/A';
  };

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
                  <motion.tr 
                    key={contact.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-white/90">
                      {contact.data.nombre || contact.data.name || contact.data.Nombre || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-400">
                      <div className="flex items-center gap-2">
                        {contact.data._isValid ? (
                          <span className="text-gray-300 group-hover:text-white transition-colors">{contact.data._phoneDisplay}</span>
                        ) : (
                          <div className="flex items-center gap-1 text-red-400" title="Invalid Format">
                            <AlertCircle size={14} />
                            <span className="line-through opacity-70">{formatPhone(contact.data.telefono || contact.data.phone || contact.data.Telefono || contact.data.Celular)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm",
                        contact.status === 'sent' ? "bg-green-500/20 text-green-300 border-green-500/30" :
                        contact.status === 'pending' ? "bg-gray-500/20 text-gray-300 border-gray-500/30" :
                        contact.status === 'optout' ? "bg-black/40 text-gray-400 border-gray-700" :
                        contact.status === 'bounced' ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" :
                        "bg-red-500/20 text-red-300 border-red-500/30"
                      )}>
                        {contact.status === 'sent' && <CheckCircle size={12} />}
                        {contact.status === 'pending' && <Clock size={12} />}
                        {contact.status === 'failed' && <AlertCircle size={12} />}
                        {contact.status === 'optout' && <Ban size={12} />}
                        {contact.status === 'bounced' && <XCircle size={12} />}
                        {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2 relative">
                      <button
                        onClick={() => onSend(contact)}
                        disabled={contact.status === 'optout' || contact.status === 'bounced'}
                        className={clsx(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-95",
                          contact.status === 'sent' 
                            ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5" 
                            : contact.status === 'optout' || contact.status === 'bounced'
                            ? "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5 opacity-50"
                            : "bg-whatsapp-dark hover:bg-whatsapp-teal text-white shadow-lg hover:shadow-whatsapp-teal/30 hover:-translate-y-0.5"
                        )}
                      >
                        <Send size={14} />
                        {contact.status === 'sent' ? 'Resend' : 'Send'}
                      </button>

                      <div className="relative">
                          <button 
                              onClick={() => setOpenMenu(openMenu === contact.id ? null : contact.id)}
                              className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                              <MoreVertical size={16} />
                          </button>
                          {openMenu === contact.id && (
                              <div className="absolute right-0 top-full mt-1 w-40 bg-[#1f2937] border border-gray-600 rounded-lg shadow-2xl z-20 overflow-hidden text-left">
                                  <button 
                                      onClick={() => { onBounce(contact); setOpenMenu(null); }}
                                      className="w-full text-left px-4 py-3 text-sm text-yellow-500 hover:bg-white/5 flex items-center gap-2"
                                  >
                                      <XCircle size={14} /> Mark Invalid
                                  </button>
                                  <button 
                                      onClick={() => { onBlock(contact); setOpenMenu(null); }}
                                      className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-white/5 flex items-center gap-2"
                                  >
                                      <Ban size={14} /> Blacklist
                                  </button>
                              </div>
                          )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-700/30">
            <span className="text-sm text-gray-400">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, contacts.length)} of {contacts.length}
            </span>
            <div className="flex gap-2">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                    <ChevronLeft size={20} />
                </button>
                <span className="px-2 py-1 bg-white/5 rounded text-sm min-w-[30px] text-center">
                    {currentPage}
                </span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
      )}

      {openMenu && <div className="fixed inset-0 z-10 bg-transparent" onClick={() => setOpenMenu(null)}></div>}
    </div>
  );
};
