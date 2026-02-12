import { openDB, DBSchema, IDBPDatabase } from 'idb';

const DB_NAME = 'wsp_campaigns_db';
const DB_VERSION = 2;

export interface ContactData {
  [key: string]: any;
  _phoneDisplay?: string;
  _phoneE164?: string;
  _isValid?: boolean;
}

export interface Contact {
  id: string;
  data: ContactData;
  status: 'pending' | 'sent' | 'failed' | 'optout' | 'bounced';
  sentAt?: string | null;
}

export interface Campaign {
  id?: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  contacts: Contact[];
  template: string;
  status: 'active' | 'archived';
}

export interface Template {
  id?: number;
  name: string;
  text: string;
}

export interface BlacklistEntry {
  phone: string;
  reason: string;
  addedAt: Date;
}

interface WSPDatabase extends DBSchema {
  campaigns: {
    key: number;
    value: Campaign;
    indexes: { 'createdAt': Date };
  };
  templates: {
    key: number;
    value: Template;
  };
  blacklist: {
    key: string;
    value: BlacklistEntry;
  };
}

export const initDB = async (): Promise<IDBPDatabase<WSPDatabase>> => {
  return openDB<WSPDatabase>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Campaigns Store
      if (!db.objectStoreNames.contains('campaigns')) {
        const store = db.createObjectStore('campaigns', { keyPath: 'id', autoIncrement: true });
        store.createIndex('createdAt', 'createdAt');
      }
      
      // Templates Store
      if (!db.objectStoreNames.contains('templates')) {
        db.createObjectStore('templates', { keyPath: 'id', autoIncrement: true });
      }
      
      // Blacklist Store
      if (!db.objectStoreNames.contains('blacklist')) {
        db.createObjectStore('blacklist', { keyPath: 'phone' }); // Phone is unique key
      }
    },
  });
};

export const db = {
  async getAllCampaigns(): Promise<Campaign[]> {
    const db = await initDB();
    return db.getAllFromIndex('campaigns', 'createdAt');
  },

  async getCampaign(id: number): Promise<Campaign | undefined> {
    const db = await initDB();
    return db.get('campaigns', id);
  },

  async createCampaign(name: string): Promise<number> {
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length > 100) {
      throw new Error('Invalid campaign name: Must be 1-100 characters');
    }
    // Basic sanitization (though React handles display sanitization, good to prevent weird chars in DB)
    const sanitizedName = trimmedName.replace(/[<>]/g, ''); 

    const db = await initDB();
    const campaign: Campaign = {
      name: sanitizedName,
      createdAt: new Date(),
      updatedAt: new Date(),
      contacts: [],
      template: '',
      status: 'active'
    };
    return db.add('campaigns', campaign);
  },

  async updateCampaign(id: number, data: Partial<Campaign>): Promise<Campaign> {
    if (data.name) {
       const trimmed = data.name.trim();
       if (!trimmed || trimmed.length > 100) throw new Error('Invalid name');
       data.name = trimmed.replace(/[<>]/g, '');
    }
    if (data.template && data.template.length > 5000) {
        throw new Error('Template too long (max 5000 chars)');
    }

    const db = await initDB();
    const campaign = await db.get('campaigns', id);
    if (!campaign) throw new Error('Campaign not found');
    
    const updated = { ...campaign, ...data, updatedAt: new Date() };
    await db.put('campaigns', updated);
    return updated;
  },

  async deleteCampaign(id: number): Promise<void> {
    const db = await initDB();
    return db.delete('campaigns', id);
  },
  
  // Template methods
  async getTemplates(): Promise<Template[]> {
      const db = await initDB();
      return db.getAll('templates');
  },
  
  async saveTemplate(template: Template): Promise<number> {
      const db = await initDB();
      return db.put('templates', template);
  },
  
  async deleteTemplate(id: number): Promise<void> {
      const db = await initDB();
      return db.delete('templates', id);
  },

  // Blacklist
  async addToBlacklist(phone: string, reason: string = 'opt-out'): Promise<string> {
      const db = await initDB();
      return db.put('blacklist', { phone, reason, addedAt: new Date() });
  },

  async isBlacklisted(phone: string): Promise<boolean> {
      if (!phone) return false;
      const db = await initDB();
      const entry = await db.get('blacklist', phone);
      return !!entry;
  },

  async getBlacklist(): Promise<BlacklistEntry[]> {
      const db = await initDB();
      return db.getAll('blacklist');
  },

  async removeFromBlacklist(phone: string): Promise<void> {
      const db = await initDB();
      return db.delete('blacklist', phone);
  }
};
