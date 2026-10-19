import React from 'react';
import { soundscape } from '../services/soundscape';

export type MainNavTab = 'friends' | 'home' | 'achievements';

interface BottomNavBarProps {
  activeTab: MainNavTab;
  onChangeTab: (tab: MainNavTab) => void;
  language: 'es' | 'en';
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  language,
}) => {
  const isHome = activeTab === 'home';
  const isFriends = activeTab === 'friends';
  const isAchievements = activeTab === 'achievements';

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto px-2 pb-1 select-none pointer-events-auto"
    >
      {/* Outer Plaque Shell: Medieval Armory & Forged Iron Theme */}
      <div className="relative w-full h-[62px] rounded-t-3xl bg-gradient-to-b from-[#2a170d] via-[#1a0e08] to-[#0d0704] border-t-2 border-x-2 border-[#ca8a04] shadow-[0_-8px_25px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.15)] flex items-stretch">
        
        {/* Decorative Brass Corner Studs */}
        <div className="absolute top-1.5 left-2.5 w-1.5 h-1.5 rounded-full bg-amber-400 border border-amber-950 shadow-sm pointer-events-none" />
        <div className="absolute top-1.5 right-2.5 w-1.5 h-1.5 rounded-full bg-amber-400 border border-amber-950 shadow-sm pointer-events-none" />

        {/* Polished Gilded Top Highlight Line */}
        <div className="absolute top-0 left-5 right-5 h-[2px] bg-gradient-to-r from-transparent via-[#fde047]/60 to-transparent pointer-events-none" />

        {/* 1. Friends Tab (Left) */}
        <button
          onClick={() => {
            soundscape.playPick();
            onChangeTab('friends');
          }}
          className={`flex-1 relative flex flex-col items-center justify-center pt-1 transition-all cursor-pointer rounded-tl-2xl ${
            isFriends
              ? 'bg-amber-950/40 text-[#fef08a]'
              : 'text-amber-200/70 hover:text-amber-100 hover:bg-white/5 active:scale-95'
          }`}
          title={language === 'es' ? 'Amigos' : 'Friends'}
        >
          {/* Active bottom glowing ember bar */}
          {isFriends && (
            <div className="absolute inset-x-4 bottom-0.5 h-1 rounded-full bg-gradient-to-r from-amber-600 via-[#fde047] to-amber-600 shadow-[0_0_10px_rgba(250,204,21,0.85)]" />
          )}

          {/* Medieval Guild Heraldic Fellowship Shields Icon */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform ${
              isFriends ? 'scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : ''
            }`}
          >
            <svg
              className="w-7 h-7"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left Knight Shield */}
              <path
                d="M8 5 L14 7 V15 C14 19 11 22 8 24 C5 22 2 19 2 15 V7 L8 5 Z"
                fill={isFriends ? '#ca8a04' : '#573016'}
                stroke={isFriends ? '#fef08a' : '#a16207'}
                strokeWidth="1.6"
              />
              <path d="M8 8 V20" stroke={isFriends ? '#fef08a' : '#78350f'} strokeWidth="1.2" />

              {/* Right Knight Shield */}
              <path
                d="M24 5 L30 7 V15 C30 19 27 22 24 24 C21 22 18 19 18 15 V7 L24 5 Z"
                fill={isFriends ? '#ca8a04' : '#573016'}
                stroke={isFriends ? '#fef08a' : '#a16207'}
                strokeWidth="1.6"
              />
              <path d="M24 8 V20" stroke={isFriends ? '#fef08a' : '#78350f'} strokeWidth="1.2" />

              {/* Forefront Guild Seal Star / Crown */}
              <circle
                cx="16"
                cy="14"
                r="5"
                fill={isFriends ? '#fde047' : '#854d0e'}
                stroke={isFriends ? '#ffffff' : '#ca8a04'}
                strokeWidth="1.5"
              />
              <path
                d="M16 11 L17 13 L19.2 13.3 L17.6 14.8 L18.1 17 L16 15.8 L13.9 17 L14.4 14.8 L12.8 13.3 L15 13 Z"
                fill={isFriends ? '#1c120c' : '#fef08a'}
              />
            </svg>
          </div>
          <span className="text-[10px] font-bold font-cinzel tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] -mt-0.5">
            {language === 'es' ? 'Amigos' : 'Friends'}
          </span>
        </button>

        {/* 2. Home Tab (Center - Raised Armory Fortress Medallion) */}
        <div className="relative w-24 flex flex-col items-center justify-end pb-1">
          <button
            onClick={() => {
              soundscape.playPick();
              onChangeTab('home');
            }}
            className="absolute -top-5 flex flex-col items-center group cursor-pointer"
            title="Home"
          >
            {/* Raised Circular Medallion */}
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 border-[3px] ${
                isHome
                  ? 'bg-gradient-to-b from-[#fde047] via-[#ca8a04] to-[#78350f] border-[#fef08a] ring-4 ring-amber-400/50 scale-105 shadow-[0_6px_20px_rgba(245,158,11,0.55),inset_0_2px_4px_rgba(255,255,255,0.6)]'
                  : 'bg-gradient-to-b from-[#3a2215] via-[#24150d] to-[#170c07] border-[#ca8a04] hover:border-amber-300 hover:scale-105 shadow-[0_6px_16px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.15)] opacity-95'
              }`}
            >
              {/* Medieval Castle Keep / Forge Tower Icon */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Turret Battlements */}
                <path
                  d="M6 13 L6 10 H9 V12 H12 V10 H15 V12 H17 V10 H20 V12 H23 V10 H26 V13"
                  stroke={isHome ? '#1c120c' : '#fef08a'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Fortress Wall Base */}
                <path
                  d="M7 13 L8.5 26 H23.5 L25 13 Z"
                  fill={isHome ? '#ca8a04' : '#451a03'}
                  stroke={isHome ? '#1c120c' : '#ca8a04'}
                  strokeWidth="2"
                />
                {/* Arched Gate / Forge Entrance */}
                <path
                  d="M13 26 V19 C13 17.5 14.3 16 16 16 C17.7 16 19 17.5 19 19 V26"
                  fill={isHome ? '#1c120c' : '#170c07'}
                  stroke={isHome ? '#fef08a' : '#ca8a04'}
                  strokeWidth="1.8"
                />
                {/* Apex Spire Banner */}
                <path
                  d="M16 4 L21 8.5 H11 Z"
                  fill={isHome ? '#1c120c' : '#ca8a04'}
                  stroke={isHome ? '#1c120c' : '#fef08a'}
                  strokeWidth="1.5"
                />
                <line
                  x1="16"
                  y1="2"
                  x2="16"
                  y2="4"
                  stroke={isHome ? '#1c120c' : '#fef08a'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* "Home" Text */}
            <span
              className={`text-xs font-black font-cinzel tracking-wider mt-1 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] ${
                isHome ? 'text-[#fef08a]' : 'text-amber-200/80'
              }`}
            >
              Home
            </span>
          </button>
        </div>

        {/* 3. Achievements Tab (Right - Royal Chalice Trophy) */}
        <button
          onClick={() => {
            soundscape.playPick();
            onChangeTab('achievements');
          }}
          className={`flex-1 relative flex flex-col items-center justify-center pt-1 transition-all cursor-pointer rounded-tr-2xl ${
            isAchievements
              ? 'bg-amber-950/40 text-[#fef08a]'
              : 'text-amber-200/70 hover:text-amber-100 hover:bg-white/5 active:scale-95'
          }`}
          title={language === 'es' ? 'Logros' : 'Achievements'}
        >
          {/* Active bottom glowing ember bar */}
          {isAchievements && (
            <div className="absolute inset-x-4 bottom-0.5 h-1 rounded-full bg-gradient-to-r from-amber-600 via-[#fde047] to-amber-600 shadow-[0_0_10px_rgba(250,204,21,0.85)]" />
          )}

          {/* Medieval Gilded Chalice Trophy Icon */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform ${
              isAchievements ? 'scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : ''
            }`}
          >
            <svg
              className="w-7 h-7"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Cup Bowl */}
              <path
                d="M9 6 H23 V15 C23 19 19.5 22 16 22 C12.5 22 9 19 9 15 V6 Z"
                fill={isAchievements ? '#fde047' : '#854d0e'}
                stroke={isAchievements ? '#fffbeb' : '#ca8a04'}
                strokeWidth="2"
              />
              {/* Left Handle */}
              <path
                d="M9 9 H6 C4.5 9 3.5 10 3.5 11.5 C3.5 14.5 6 16 9 16"
                stroke={isAchievements ? '#fef08a' : '#ca8a04'}
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Right Handle */}
              <path
                d="M23 9 H26 C27.5 9 28.5 10 28.5 11.5 C28.5 14.5 26 16 23 16"
                stroke={isAchievements ? '#fef08a' : '#ca8a04'}
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Stem */}
              <path
                d="M16 22 V26"
                stroke={isAchievements ? '#fffbeb' : '#ca8a04'}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Ornate Base */}
              <path
                d="M11 26 H21 L22 28.5 H10 L11 26 Z"
                fill={isAchievements ? '#ca8a04' : '#573016'}
                stroke={isAchievements ? '#fef08a' : '#ca8a04'}
                strokeWidth="1.5"
              />
              {/* Star inside cup */}
              <path
                d="M16 10 L16.8 12 L19 12.3 L17.4 13.8 L17.9 16 L16 14.8 L14.1 16 L14.6 13.8 L13 12.3 L15.2 12 Z"
                fill={isAchievements ? '#1c120c' : '#fef08a'}
              />
            </svg>
          </div>
          <span className="text-[10px] font-bold font-cinzel tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] -mt-0.5">
            {language === 'es' ? 'Logros' : 'Achievements'}
          </span>
        </button>

      </div>
    </nav>
  );
};
