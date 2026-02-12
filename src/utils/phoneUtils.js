import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export const normalizePhone = (phone, defaultCountry = 'CL') => { // Default to Chile if not specified, but UI will control this
  if (!phone) return { formatted: '', isValid: false, error: 'Empty' };
  try {
    const raw = String(phone).trim();
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
