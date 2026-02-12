import React from 'react';

interface VariablePickerProps {
  availableVars: string[];
  onInsert: (varName: string) => void;
}

export const VariablePicker: React.FC<VariablePickerProps> = ({ availableVars, onInsert }) => {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {availableVars.map(v => (
        <button 
          key={v}
          onClick={() => onInsert(v)}
          className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
        >
          &#123;{v}&#125;
        </button>
      ))}
    </div>
  );
};
