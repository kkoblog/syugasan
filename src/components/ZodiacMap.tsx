import React from 'react';
import { zodiacSigns } from '../data/zodiacData';
import type { ZodiacMapProps } from '../types';
import { Trash2 } from 'lucide-react';

export const ZodiacMap: React.FC<ZodiacMapProps> = ({ users, selectedSign, onSignSelect, onUserPlaced, onUserRemove }) => {
  const radius = 420;
  const center = { x: 650, y: 650 };
  const sectionPadding = 140;
  
  const getSignPosition = (index: number) => {
    const angle = (index * (2 * Math.PI) / 12) - Math.PI / 2;
    return {
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle)
    };
  };

  const getTextPosition = (index: number) => {
    const angle = (index * (2 * Math.PI) / 12) - Math.PI / 2;
    const textRadius = radius + sectionPadding / 2;
    return {
      x: center.x + textRadius * Math.cos(angle),
      y: center.y + textRadius * Math.sin(angle)
    };
  };

  const getUserPosition = (index: number, sign: string) => {
    const basePosition = getSignPosition(Object.keys(zodiacSigns).indexOf(sign));
    const offset = 40;
    const userAngle = (index * (2 * Math.PI) / 6);
    return {
      x: basePosition.x + offset * Math.cos(userAngle),
      y: basePosition.y + offset * Math.sin(userAngle)
    };
  };

  const handleDragOver = (e: React.DragEvent<SVGSVGElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<SVGSVGElement>) => {
    e.preventDefault();
    const userData = e.dataTransfer.getData('application/json');
    if (!userData) return;

    const user = JSON.parse(userData);
    const svgRect = e.currentTarget.getBoundingClientRect();
    const dropX = e.clientX - svgRect.left;
    const dropY = e.clientY - svgRect.top;

    // ドロップ位置に最も近い星座を見つける
    let closestSign = '';
    let minDistance = Infinity;

    const signs = Object.entries(zodiacSigns);
    signs.forEach(([key, sign], index) => {
      const pos = getSignPosition(index);
      const distance = Math.sqrt(
        Math.pow(dropX - pos.x, 2) + Math.pow(dropY - pos.y, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestSign = key;
      }
    });

    // 配置位置を更新し、最も近い星座を記録
    onUserPlaced(
      { 
        ...user, 
        placedOppositeSign: closestSign 
      }, 
      { x: dropX, y: dropY }
    );
  };

  // セクションのパスを生成
  const createSectionPath = (startAngle: number) => {
    const innerRadius = 0; // 中心から始まるように変更
    const outerRadius = radius + sectionPadding;
    const startRad = (startAngle - 15) * (Math.PI / 180);
    const endRad = (startAngle + 15) * (Math.PI / 180);
    
    const startInner = {
      x: center.x + innerRadius * Math.cos(startRad),
      y: center.y + innerRadius * Math.sin(startRad)
    };
    const endInner = {
      x: center.x + innerRadius * Math.cos(endRad),
      y: center.y + innerRadius * Math.sin(endRad)
    };
    const startOuter = {
      x: center.x + outerRadius * Math.cos(startRad),
      y: center.y + outerRadius * Math.sin(startRad)
    };
    const endOuter = {
      x: center.x + outerRadius * Math.cos(endRad),
      y: center.y + outerRadius * Math.sin(endRad)
    };

    return `
      M ${center.x} ${center.y}
      L ${startOuter.x} ${startOuter.y}
      A ${outerRadius} ${outerRadius} 0 0 1 ${endOuter.x} ${endOuter.y}
      L ${center.x} ${center.y}
      Z
    `;
  };

  const signs = Object.entries(zodiacSigns);

  return (
    <svg 
      width="1300" 
      height="1300" 
      viewBox="0 0 1300 1300"
      className="mx-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ filter: 'drop-shadow(0 20px 30px rgba(79, 70, 229, 0.15))' }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="outline">
          <feMorphology operator="dilate" radius="2" in="SourceAlpha" result="thicken" />
          <feFlood floodColor="black" result="blackText" />
          <feComposite in="blackText" in2="thicken" operator="in" result="outlineText"/>
          <feMerge>
            <feMergeNode in="outlineText"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="innerShadow">
          <feOffset dx="0" dy="2"/>
          <feGaussianBlur stdDeviation="3" result="offset-blur"/>
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
          <feFlood floodColor="black" floodOpacity="0.4" result="color"/>
          <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
        </filter>
        <radialGradient id="circleGradient">
          <stop offset="0%" stopColor="rgba(79, 70, 229, 0.15)"/>
          <stop offset="100%" stopColor="rgba(79, 70, 229, 0.05)"/>
        </radialGradient>
        <linearGradient id="signGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </linearGradient>
        <filter id="floatingEffect">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
          <feOffset in="blur" dx="0" dy="4" result="offsetBlur"/>
          <feFlood floodColor="rgba(79, 70, 229, 0.1)" result="shadowColor"/>
          <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="shadowBlur"/>
          <feMerge>
            <feMergeNode in="shadowBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 背景の大きな円 */}
      <circle
        cx={center.x}
        cy={center.y}
        r={radius + sectionPadding + 50}
        className="fill-white/80 stroke-indigo-200"
        strokeWidth="2"
        style={{ filter: 'drop-shadow(0 10px 20px rgba(79, 70, 229, 0.2))' }}
      />

      {/* 中心の装飾円 */}
      <circle
        cx={center.x}
        cy={center.y}
        r={radius + sectionPadding + 30}
        fill="url(#circleGradient)"
        className="opacity-80"
      />

      {/* 12分割のセクション */}
      {signs.map(([key, sign], index) => {
        const startAngle = index * 30;
        const isSelected = selectedSign === key || 
          (selectedSign && zodiacSigns[selectedSign]?.opposite === key);

        return (
          <g key={`section-${index}`}>
            {/* セクションの背景 */}
            <path
              d={createSectionPath(startAngle)}
              className={`${isSelected ? 'fill-indigo-50' : 'fill-transparent'} opacity-40 transition-all duration-500`}
              stroke="rgba(79, 70, 229, 0.2)"
              strokeWidth="1"
            />
            {/* 対向の星座を結ぶ線 */}
            {index < 6 && (
              <line
                x1={center.x + radius * Math.cos(startAngle * Math.PI / 180)}
                y1={center.y + radius * Math.sin(startAngle * Math.PI / 180)}
                x2={center.x + radius * Math.cos((startAngle + 180) * Math.PI / 180)}
                y2={center.y + radius * Math.sin((startAngle + 180) * Math.PI / 180)}
                stroke="rgba(79, 70, 229, 0.2)"
                strokeWidth="1"
                strokeDasharray="6"
                className="opacity-50"
              />
            )}
          </g>
        );
      })}

      {/* 星座記号と名前 */}
      {signs.map(([key, sign], index) => {
        const pos = getSignPosition(index);
        const isSelected = selectedSign === key;
        const isOpposite = selectedSign && zodiacSigns[selectedSign]?.opposite === key;
        
        return (
          <g key={key}>
            {/* 星座の背景円 */}
            <g transform={`translate(${pos.x}, ${pos.y})`} filter="url(#glow)">
              <circle
                r="60"
                className={`${sign.color} cursor-pointer transition-all duration-500 ${
                  isSelected ? 'opacity-100 stroke-white stroke-2 scale-110 brightness-110' : 
                  isOpposite ? 'opacity-95 stroke-indigo-200 stroke-2 scale-105 brightness-105' : 
                  'opacity-95 hover:scale-105 hover:opacity-100 hover:brightness-105'
                }`}
                onClick={() => onSignSelect(isSelected ? null : key)}
                style={{ filter: 'url(#innerShadow)' }}
              />
              <circle
                r="60"
                fill="url(#signGradient)"
                className="pointer-events-none"
              />
              <g filter="url(#outline)">
                <text
                  className="fill-white text-4xl font-bold pointer-events-none"
                  textAnchor="middle"
                  dy="-0.2em"
                >
                  {sign.symbol}
                </text>
                <text
                  className="fill-white text-lg font-bold pointer-events-none"
                  textAnchor="middle"
                  dy="1.5em"
                >
                  {sign.name}
                </text>
              </g>
            </g>
          </g>
        );
      })}

      {/* 配置済みユーザー */}
      {users.map((user) => {
        if (!user.position) return null;
        const shouldHighlight = selectedSign === user.sign || 
          (selectedSign && zodiacSigns[selectedSign]?.opposite === user.sign);

        return (
          <g key={user.id} transform={`translate(${user.position.x}, ${user.position.y})`} filter="url(#glow)">
            <g className="group">
              <rect
                x="-45"
                y="-14"
                width="90"
                height="28"
                rx="6"
                className={`${shouldHighlight ? 'fill-indigo-700' : 'fill-slate-800'} 
                  transition-all duration-300
                  ${shouldHighlight ? 'stroke-indigo-300' : 'stroke-slate-600'}`}
                strokeWidth="1.5"
                style={{ filter: 'url(#innerShadow)' }}
              />
              <text
                textAnchor="middle"
                dy="0.35em"
                className="fill-white text-sm font-medium transition-all duration-300"
              >
                {user.name}
              </text>
              <g 
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                onClick={() => onUserRemove(user.id)}
                transform="translate(32, -10)"
              >
                <circle
                  r="10"
                  className="fill-red-500/10 hover:fill-red-500/20 transition-colors"
                />
                <g transform="translate(-6, -6)">
                  <Trash2 size={12} className="text-red-500" />
                </g>
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
};