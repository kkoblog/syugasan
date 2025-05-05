import React, { useState } from 'react';
import type { User } from '../types';
import { zodiacSigns } from '../data/zodiacData';
import { Trash2, Edit2, X, Check } from 'lucide-react';

interface UserListProps {
  users: User[];
  onRemoveUser?: (userId: string) => void;
  onUpdateUser?: (userId: string, name: string, sign: string) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onRemoveUser, onUpdateUser }) => {
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSign, setEditSign] = useState('');

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, user: User) => {
    e.dataTransfer.setData('application/json', JSON.stringify(user));
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user.id);
    setEditName(user.name);
    setEditSign(user.sign);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditName('');
    setEditSign('');
  };

  const handleSaveEdit = (userId: string) => {
    if (onUpdateUser && editName && editSign) {
      onUpdateUser(userId, editName, editSign);
      handleCancelEdit();
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ユーザーが登録されていません
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {users.map((user) => {
        const sign = zodiacSigns[user.sign];
        const isEditing = editingUser === user.id;

        return (
          <li
            key={user.id}
            draggable={!isEditing}
            onDragStart={(e) => handleDragStart(e, user)}
            className={`group p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-indigo-50/20 
              ${!isEditing ? 'hover:bg-white/80 hover:border-indigo-100/40 hover:shadow-md cursor-move' : ''} 
              transition-all duration-200`}
          >
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  placeholder="名前を入力"
                />
                <select
                  value={editSign}
                  onChange={(e) => setEditSign(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                >
                  <option value="">反転月星座を選択</option>
                  {Object.entries(zodiacSigns).map(([key, sign]) => (
                    <option key={key} value={key}>
                      {sign.name}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleCancelEdit()}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                  <button
                    onClick={() => handleSaveEdit(user.id)}
                    className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Check size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${sign.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                    {sign.symbol}
                  </div>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{sign.name}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg"
                    >
                      <Edit2 size={16} />
                    </button>
                    {onRemoveUser && (
                      <button
                        onClick={() => onRemoveUser(user.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">
                    ドラッグして配置
                  </div>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};