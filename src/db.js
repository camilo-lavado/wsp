import { openDB } from 'idb';

const DB_NAME = 'wsp_campaigns_db';
const DB_VERSION = 2;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
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
  async getAllCampaigns() {
    const db = await initDB();
    return db.getAllFromIndex('campaigns', 'createdAt');
  },

  async getCampaign(id) {
    const db = await initDB();
    return db.get('campaigns', id);
  },

  async createCampaign(name) {
    const db = await initDB();
    const campaign = {
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      contacts: [],
      template: '',
      status: 'active'
    };
    return db.add('campaigns', campaign);
  },

  async updateCampaign(id, data) {
    const db = await initDB();
    const campaign = await db.get('campaigns', id);
    if (!campaign) throw new Error('Campaign not found');
    
    const updated = { ...campaign, ...data, updatedAt: new Date() };
    await db.put('campaigns', updated);
    return updated;
  },

  async deleteCampaign(id) {
    const db = await initDB();
    return db.delete('campaigns', id);
  },
  
  // Template methods compatible with what we had in localStorage
  async getTemplates() {
      const db = await initDB();
      return db.getAll('templates');
  },
  
  async saveTemplate(template) {
      const db = await initDB();
      return db.put('templates', template);
  },
  
  async deleteTemplate(id) {
      const db = await initDB();
      return db.delete('templates', id);
  },

  // Blacklist
  async addToBlacklist(phone, reason = 'opt-out') {
      const db = await initDB();
      return db.put('blacklist', { phone, reason, addedAt: new Date() });
  },

  async isBlacklisted(phone) {
      if (!phone) return false;
      const db = await initDB();
      const entry = await db.get('blacklist', phone);
      return !!entry;
  },

  async getBlacklist() {
      const db = await initDB();
      return db.getAll('blacklist');
  },

  async removeFromBlacklist(phone) {
      const db = await initDB();
      return db.delete('blacklist', phone);
  }
};
