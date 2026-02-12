import React from 'react';
import { CountryCode } from 'libphonenumber-js';

interface Country {
  code: CountryCode;
  name: string;
  dial: string;
}

const COUNTRIES: Country[] = [
  { code: 'CL', name: 'Chile', dial: '+56' },
  { code: 'AR', name: 'Argentina', dial: '+54' },
  { code: 'PE', name: 'Peru', dial: '+51' },
  { code: 'CO', name: 'Colombia', dial: '+57' },
  { code: 'MX', name: 'Mexico', dial: '+52' },
  { code: 'ES', name: 'España', dial: '+34' },
  { code: 'US', name: 'USA', dial: '+1' },
  { code: 'BR', name: 'Brasil', dial: '+55' },
];

export type CountrySelection = CountryCode | 'XX';

interface CountrySelectorProps {
  selected: CountrySelection;
  onChange: (value: CountrySelection) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="flex items-center gap-2 mb-4 bg-gray-900/50 p-2 rounded-lg border border-gray-700/50">
        <span className="text-gray-400 text-sm pl-2">Default Country:</span>
        <select 
            value={selected} 
            onChange={(e) => onChange(e.target.value as CountrySelection)}
            className="bg-transparent text-white text-sm font-medium outline-none cursor-pointer hover:text-whatsapp-light transition-colors"
        >
            {COUNTRIES.map(c => (
                <option key={c.code} value={c.code} className="bg-gray-800 text-white">
                    {c.name} ({c.dial})
                </option>
            ))}
            <option value="XX" className="bg-gray-800 text-white">Other (Auto)</option>
        </select>
    </div>
  );
};
