import React, { useState } from 'react';
import { Send, CheckCircle, Clock, AlertCircle, Ban, XCircle, MoreVertical } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Contact } from '../db';

interface ContactRowProps {
  contact: Contact;
  index: number;
  onSend: (contact: Contact) => void;
  onBlock: (contact: Contact) => void;
  onBounce: (contact: Contact) => void;
}

export const ContactRow: React.FC<ContactRowProps> = ({ contact, index, onSend, onBlock, onBounce }) => {
  const [openMenu, setOpenMenu] = useState(false);

  const formatPhone = (phone: any) => {
    return phone ? String(phone).replace(/[^0-9+]/g, '') : 'N/A';
  };

  return (
    <motion.tr 
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
                    onClick={() => setOpenMenu(!openMenu)}
                    className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <MoreVertical size={16} />
                </button>
                {openMenu && (
                    <>
                    <div className="fixed inset-0 z-10 bg-transparent" onClick={() => setOpenMenu(false)}></div>
                    <div className="absolute right-0 top-full mt-1 w-40 bg-[#1f2937] border border-gray-600 rounded-lg shadow-2xl z-20 overflow-hidden text-left">
                        <button 
                            onClick={() => { onBounce(contact); setOpenMenu(false); }}
                            className="w-full text-left px-4 py-3 text-sm text-yellow-500 hover:bg-white/5 flex items-center gap-2"
                        >
                            <XCircle size={14} /> Mark Invalid
                        </button>
                        <button 
                            onClick={() => { onBlock(contact); setOpenMenu(false); }}
                            className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-white/5 flex items-center gap-2"
                        >
                            <Ban size={14} /> Blacklist
                        </button>
                    </div>
                    </>
                )}
            </div>
        </td>
    </motion.tr>
  );
};
