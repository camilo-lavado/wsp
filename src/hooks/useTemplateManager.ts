import { useState, useEffect } from 'react';
import { db, Template } from '../db';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const useTemplateManager = (setTemplate: (tpl: string) => void) => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const tpls = await db.getTemplates();
    setTemplates(tpls);
  };

  const handleSaveTemplate = async (name: string, text: string) => {
    const newTpl: Template = { name, text };
    await db.saveTemplate(newTpl);
    await loadTemplates();
    toast.success(t('editor.templateSaved'));
  };

  const handleDeleteTemplate = async (name: string) => {
    const tpl = templates.find(t => t.name === name);
    if (tpl && tpl.id !== undefined) {
      await db.deleteTemplate(tpl.id);
      await loadTemplates();
      toast.success(t('editor.templateDeleted'));
    }
  };

  const handleLoadTemplate = (tplItem: Template) => {
    setTemplate(tplItem.text);
    toast.success(t('editor.templateLoaded', { name: tplItem.name }));
  };

  return {
    templates,
    handleSaveTemplate,
    handleDeleteTemplate,
    handleLoadTemplate
  };
};
