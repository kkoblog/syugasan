import React from 'react';
import type { User } from '../types';
import { zodiacSigns } from '../data/zodiacData';

interface UserListProps {
  users: User[];
}

export const UserList: React.FC<UserListProps> = ({ users }) => {
  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, user: User) => {
    e.dataTransfer.setData('application/json', JSON.stringify(user));
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
        return (
          <li
            key={user.id}
            draggable
            onDragStart={(e) => handleDragStart(e, user)}
            className="group flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80 transition-all duration-200 cursor-move border border-indigo-50/20 hover:border-indigo-100/40 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${sign.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                {sign.symbol}
              </div>
              <span className="font-medium text-gray-900">{user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{sign.name}</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">
                ドラッグして配置
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};