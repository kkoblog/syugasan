import React, { useState } from 'react';
import { zodiacSigns } from '../data/zodiacData';

interface UserFormProps {
  onAddUser: (name: string, sign: string) => void;
}

export const UserForm: React.FC<UserFormProps> = ({ onAddUser }) => {
  const [name, setName] = useState('');
  const [sign, setSign] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sign) return;
    
    onAddUser(name, sign);
    setName('');
    setSign('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          お名前
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="名前を入力"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          反転月星座
        </label>
        <select
          value={sign}
          onChange={(e) => setSign(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        >
          <option value="">反転月星座を選択</option>
          {Object.entries(zodiacSigns).map(([key, sign]) => (
            <option key={key} value={key}>
              {sign.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px]"
      >
        追加
      </button>
    </form>
  );
};