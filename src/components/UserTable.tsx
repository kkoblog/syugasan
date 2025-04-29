import React from 'react';
import { zodiacSigns } from '../data/zodiacData';
import { User } from '../types';
import { Trash2 } from 'lucide-react';

interface UserTableProps {
  users: User[];
  onRemoveUser: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onRemoveUser }) => {
  return (
    <div className="mt-8 bg-white/40 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-indigo-100/20">
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-4">
        配置済みユーザー一覧
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-indigo-100/20">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">名前</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">月星座</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">反転星座</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr 
                key={user.id} 
                className="border-b border-indigo-100/10 hover:bg-indigo-50/30 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-700">{user.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className={`${zodiacSigns[user.sign]?.color} w-6 h-6 rounded-full flex items-center justify-center text-white text-xs`}>
                      {zodiacSigns[user.sign]?.symbol}
                    </span>
                    {zodiacSigns[user.sign]?.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {user.placedOppositeSign && (
                    <div className="flex items-center gap-2">
                      <span className={`${zodiacSigns[user.placedOppositeSign]?.color} w-6 h-6 rounded-full flex items-center justify-center text-white text-xs`}>
                        {zodiacSigns[user.placedOppositeSign]?.symbol}
                      </span>
                      {zodiacSigns[user.placedOppositeSign]?.name}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onRemoveUser(user.id)}
                    className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  ユーザーはまだ配置されていません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 