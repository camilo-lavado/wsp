import { useState, useEffect } from 'react';
import { db, Contact } from '../db';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const useCampaign = (campaignId: number | null) => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [template, setTemplate] = useState('');
  const [campaignName, setCampaignName] = useState('Campaign');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (campaignId !== null && campaignId !== undefined) {
      loadCampaign(campaignId);
    }
  }, [campaignId]);

  const loadCampaign = async (id: number) => {
    try {
      const c = await db.getCampaign(id);
      if (c) {
        setCampaignName(c.name);
        setTemplate(c.template || '');
        const campaignContacts = await db.getContactsByCampaign(id);
        setContacts(campaignContacts);
      }
    } catch (e) {
      console.error(t('editor.loadError'), e);
      toast.error(t('editor.loadError'));
    }
  };

  const saveCampaign = async () => {
    if (!campaignId) return;
    setIsSaving(true);
    try {
      await db.updateCampaign(campaignId, {
        template,
        name: campaignName
      });
      await db.saveContacts(campaignId, contacts);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (campaignId) saveCampaign();
    }, 2000);
    return () => clearTimeout(timer);
  }, [contacts, template, campaignName]);

  return {
    campaignName,
    contacts,
    setContacts,
    template,
    setTemplate,
    isSaving
  };
};
