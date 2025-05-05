import React, { useState, useEffect } from 'react';
import { UserForm } from './components/UserForm';
import { ZodiacMap } from './components/ZodiacMap';
import { UserTable } from './components/UserTable';
import { UserList } from './components/UserList';
import { zodiacSigns } from './data/zodiacData';
import type { User } from './types';
import { Download, Save } from 'lucide-react';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [placedUsers, setPlacedUsers] = useState<User[]>([]);

  // ローカルストレージからデータを読み込む
  useEffect(() => {
    const savedUsers = localStorage.getItem('unplacedUsers');
    const savedPlacedUsers = localStorage.getItem('placedUsers');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    if (savedPlacedUsers) {
      setPlacedUsers(JSON.parse(savedPlacedUsers));
    }
  }, []);

  const handleAddUser = (name: string, sign: string) => {
    const newUsers = [...users, { id: crypto.randomUUID(), name, sign, position: null }];
    setUsers(newUsers);
    localStorage.setItem('unplacedUsers', JSON.stringify(newUsers));
  };

  const handleUserPlaced = (user: User, position: { x: number, y: number }) => {
    const newPlacedUsers = [...placedUsers, { ...user, position }];
    const newUsers = users.filter(u => u.id !== user.id);
    setPlacedUsers(newPlacedUsers);
    setUsers(newUsers);
    localStorage.setItem('placedUsers', JSON.stringify(newPlacedUsers));
    localStorage.setItem('unplacedUsers', JSON.stringify(newUsers));
  };

  const handleRemoveUser = (userId: string) => {
    const userToRemove = placedUsers.find(u => u.id === userId);
    if (userToRemove) {
      const newPlacedUsers = placedUsers.filter(u => u.id !== userId);
      const newUsers = [...users, { ...userToRemove, position: null }];
      setPlacedUsers(newPlacedUsers);
      setUsers(newUsers);
      localStorage.setItem('placedUsers', JSON.stringify(newPlacedUsers));
      localStorage.setItem('unplacedUsers', JSON.stringify(newUsers));
    }
  };

  const handleSave = () => {
    localStorage.setItem('unplacedUsers', JSON.stringify(users));
    localStorage.setItem('placedUsers', JSON.stringify(placedUsers));
  };

  const handleDownloadImage = () => {
    const svgElement = document.getElementById('zodiac-map')?.querySelector('svg');
    if (!svgElement) return;

    // SVGの現在のスタイルを保持するために必要な要素を追加
    const style = document.createElement('style');
    const cssRules = Array.from(document.styleSheets)
      .flatMap(sheet => {
        try {
          return Array.from(sheet.cssRules);
        } catch {
          return [];
        }
      })
      .map(rule => rule.cssText)
      .join('');
    style.textContent = cssRules;
    svgElement.prepend(style);

    // SVGの内容を文字列として取得
    const svgData = new XMLSerializer().serializeToString(svgElement);
    
    // スタイル要素を削除（元のSVGを変更しないため）
    style.remove();

    // SVGデータをBase64エンコード
    const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));
    const imgSrc = `data:image/svg+xml;base64,${svgBase64}`;

    // 画像としてダウンロード
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 背景を透明に設定
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // SVGを描画
        ctx.drawImage(img, 0, 0);
        
        // PNGとしてダウンロード
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'horoscope.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      }
    };

    img.src = imgSrc;
  };

  const handleUpdateUnplacedUser = (userId: string, name: string, sign: string) => {
    const newUsers = users.map(user => 
      user.id === userId ? { ...user, name, sign } : user
    );
    setUsers(newUsers);
    localStorage.setItem('unplacedUsers', JSON.stringify(newUsers));
  };

  const handleRemoveUnplacedUser = (userId: string) => {
    const newUsers = users.filter(user => user.id !== userId);
    setUsers(newUsers);
    localStorage.setItem('unplacedUsers', JSON.stringify(newUsers));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8">
      <div className="container mx-auto px-8 max-w-[1800px]">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">
            月星座反転）A_Vision++MAP
          </h1>
          <span className="block text-lg font-medium text-gray-600">Lunar Zodiac Visualization System</span>
        </header>
        
        <div className="grid md:grid-cols-[1fr_350px] gap-8">
          {/* メインコンテンツ */}
          <div className="space-y-8">
            {/* 星座マップ */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-white/50 to-purple-50/50 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-6">
                <div className="flex justify-end gap-4 mb-6">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] text-base font-medium"
                  >
                    <Save size={20} />
                    保存
                  </button>
                  <button
                    onClick={handleDownloadImage}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] text-base font-medium"
                  >
                    <Download size={20} />
                    画像を保存
                  </button>
                </div>
                <div id="zodiac-map" className="w-full flex justify-center">
                  <ZodiacMap
                    users={placedUsers}
                    selectedSign={selectedSign}
                    onSignSelect={setSelectedSign}
                    onUserPlaced={handleUserPlaced}
                    onUserRemove={handleRemoveUser}
                  />
                </div>
              </div>
            </div>

            {/* ユーザー一覧テーブル */}
            <UserTable users={placedUsers} onRemoveUser={handleRemoveUser} />
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 新規ユーザー追加 */}
            <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-indigo-100/20">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-4">
                新規ユーザー追加
              </h2>
              <UserForm onAddUser={handleAddUser} />
            </div>

            {/* 登録済みユーザー */}
            {users.length > 0 && (
              <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-indigo-100/20">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-4">
                  登録済みユーザー
                </h2>
                <UserList 
                  users={users} 
                  onUpdateUser={handleUpdateUnplacedUser}
                  onRemoveUser={handleRemoveUnplacedUser}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;