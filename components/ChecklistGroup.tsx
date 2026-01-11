
import React from 'react';
import { EquipmentGroup, ItemStatus } from '../types';

interface ChecklistGroupProps {
  group: EquipmentGroup;
  onStatusChange: (groupId: string, itemId: string, status: ItemStatus) => void;
  onAddPhoto: (groupId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (groupId: string, photoIndex: number) => void;
}

const ChecklistGroup: React.FC<ChecklistGroupProps> = ({ group, onStatusChange, onAddPhoto, onRemovePhoto }) => {
  const isComplete = group.items.every(i => i.status !== 'pending');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-4 transition-all hover:shadow-md">
      {/* Header */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span className="text-xl">{group.icon}</span>
          {group.title}
        </h3>
        {isComplete && (
          <span className="bg-blue-100 text-blue-700 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border border-blue-200">
            OK
          </span>
        )}
      </div>

      {/* Items List */}
      <div className="divide-y divide-slate-100">
        {group.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/50 transition-colors"
          >
            <span className={`text-sm font-medium pr-4 ${item.status === 'pending' ? 'text-slate-500' : 'text-slate-900'}`}>
              {item.label}
            </span>
            
            <div className="flex items-center gap-2 shrink-0">
              {/* Button OK */}
              <button
                onClick={() => onStatusChange(group.id, item.id, item.status === 'ok' ? 'pending' : 'ok')}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border-2 ${
                  item.status === 'ok' 
                    ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-100' 
                    : 'bg-white border-slate-200 text-slate-300 hover:border-green-200'
                }`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>

              {/* Button NOT OK (X) */}
              <button
                onClick={() => onStatusChange(group.id, item.id, item.status === 'not_ok' ? 'pending' : 'not_ok')}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border-2 ${
                  item.status === 'not_ok' 
                    ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-100' 
                    : 'bg-white border-slate-200 text-slate-300 hover:border-red-200'
                }`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Section */}
      <div className="bg-slate-50/50 px-4 py-3 border-t border-slate-100">
        <div className="flex flex-wrap gap-2 items-start">
          <label className="shrink-0 flex items-center gap-1.5 bg-white border border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-400 px-3 py-2 rounded-lg cursor-pointer transition-all shadow-sm text-xs font-bold uppercase tracking-wide">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Foto
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              multiple 
              onChange={(e) => onAddPhoto(group.id, e)} 
              className="hidden" 
            />
          </label>

          {group.photos && group.photos.map((photo, index) => (
            <div key={index} className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 group/photo shadow-sm">
              <img src={photo} alt="Evidência" className="w-full h-full object-cover" />
              <button 
                onClick={() => onRemovePhoto(group.id, index)}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          
          {group.photos && group.photos.length > 0 && (
            <span className="text-[10px] text-slate-400 self-center ml-1">
              {group.photos.length} foto(s)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChecklistGroup;
