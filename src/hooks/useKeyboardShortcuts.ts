import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Contact } from '../db';
import { useTranslation } from 'react-i18next';

export const useKeyboardShortcuts = (
  contacts: Contact[],
  handleSend: (contact: Contact) => void
) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'Enter') {
        const nextPending = contacts.find(c => c.status === 'pending');
        if (nextPending) {
          e.preventDefault();
          handleSend(nextPending);
          toast(t('editor.sendingNext'), { icon: '🚀' });
        } else {
          toast(t('editor.noPending'));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
  }, [contacts, handleSend]);
};
