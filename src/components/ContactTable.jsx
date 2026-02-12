import React from 'react';
import { Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export const ContactTable = ({ contacts, onSend }) => {
  if (!contacts.length) {
    return (
      <div className="text-center py-12 text-gray-500 bg-surface-card rounded-lg border border-gray-700">
        <p>No contacts loaded. Upload a file to get started.</p>
      </div>
    );
  }

  // Helper to parse phone number for display vs raw
  const formatPhone = (phone) => {
    return phone ? String(phone).replace(/[^0-9+]/g, '') : 'N/A';
  };

  return (
    <div className="overflow-x-auto bg-surface-card rounded-lg border border-gray-700 shadow-xl">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="bg-gray-800 text-xs uppercase text-gray-400">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Phone</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-gray-800/50 transition-colors">
              <td className="px-6 py-4 font-medium text-white">
                {contact.data.nombre || contact.data.name || contact.data.Nombre || 'Unknown'}
              </td>
              <td className="px-6 py-4 font-mono text-gray-400">
                {formatPhone(contact.data.telefono || contact.data.phone || contact.data.Telefono || contact.data.Celular)}
              </td>
              <td className="px-6 py-4">
                <span className={clsx(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                  contact.status === 'sent' ? "bg-green-900/30 text-green-400 border-green-800" :
                  contact.status === 'pending' ? "bg-gray-700 text-gray-300 border-gray-600" :
                  "bg-red-900/30 text-red-400 border-red-800"
                )}>
                  {contact.status === 'sent' && <CheckCircle size={12} />}
                  {contact.status === 'pending' && <Clock size={12} />}
                  {contact.status === 'failed' && <AlertCircle size={12} />}
                  {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                </span>
                {contact.sentAt && (
                  <div className="text-[10px] text-gray-500 mt-1">
                    {new Date(contact.sentAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onSend(contact)}
                  className={clsx(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    contact.status === 'sent' 
                      ? "bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700" 
                      : "bg-whatsapp-dark hover:bg-whatsapp-teal text-white shadow-lg shadow-whatsapp-dark/20"
                  )}
                >
                  <Send size={14} />
                  {contact.status === 'sent' ? 'Resend' : 'Send'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
