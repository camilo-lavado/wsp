import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export const normalizePhone = (phone, defaultCountry = 'CL') => {
  if (!phone) return { formatted: '', isValid: false, error: 'Empty' };

  try {
    // Convert to string and keep only + and digits for initial check
    const raw = String(phone).trim();
    
    // If it doesn't start with +, let's try to parse with default country
    // liberal parsing
    const phoneNumber = parsePhoneNumber(raw, defaultCountry);
    
    if (phoneNumber && phoneNumber.isValid()) {
      return {
        formatted: phoneNumber.number, // E.164
        display: phoneNumber.formatInternational(),
        isValid: true
      };
    }
  } catch (e) {
    // parsing failed
  }

  return { formatted: phone, isValid: false, error: 'Invalid format' };
};
