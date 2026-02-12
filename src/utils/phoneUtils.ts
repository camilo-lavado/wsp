import { parsePhoneNumber, CountryCode } from 'libphonenumber-js';

export interface PhoneNormalizationResult {
  formatted: string;
  isValid: boolean;
  display?: string;
  error?: string;
}

export const normalizePhone = (phone: string | number | null | undefined, defaultCountry?: CountryCode): PhoneNormalizationResult => {
  if (!phone) return { formatted: '', isValid: false, error: 'Empty' };
  try {
    const raw = String(phone).trim();
    const phoneNumber = parsePhoneNumber(raw, defaultCountry);
    if (phoneNumber && phoneNumber.isValid()) {
      return {
        formatted: phoneNumber.number as string, // E.164
        display: phoneNumber.formatInternational(),
        isValid: true
      };
    }
  } catch (e) {
    // parsing failed
  }
  return { formatted: String(phone), isValid: false, error: 'Invalid format' };
};
