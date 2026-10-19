import React, { useState } from 'react';
import { Friend, getFriends, addFriend, removeFriend } from '../services/friends';
import { getTotalMedalCounts, MedalCounts } from '../services/medals';
import { soundscape } from '../services/soundscape';
import { t } from '../services/translations';
import { Language } from '../types/game';

interface FriendsViewProps {
  playerName: string;
  language: Language;
}

export const FriendsView: React.FC<FriendsViewProps> = ({ playerName, language }) => {
  const strings = t(language);
  const [friends, setFriends] = useState<Friend[]>(() => getFriends());
  const [nameInput, setNameInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  const myMedals: MedalCounts = getTotalMedalCounts();

  const handleAddFriend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nameInput.trim()) {
      setFeedback({ text: strings.enterFriendName, isError: true });
      return;
    }

    const result = addFriend(nameInput.trim());
    if (!result.success) {
      if (result.errorKey === 'friendAlreadyExists') {
        setFeedback({ text: strings.friendAlreadyExists, isError: true });
      } else {
        setFeedback({ text: strings.enterFriendName, isError: true });
      }
      return;
    }

    soundscape.playMatch3();
    setFriends(getFriends());
    setNameInput('');
    setFeedback({
      text: strings.friendAddedSuccess(result.friend?.name || nameInput.trim()),
      isError: false,
    });

    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  const handleRemoveFriend = (id: string, name: string) => {
    soundscape.playPick();
    const updated = removeFriend(id);
    setFriends(updated);
    setFeedback({
      text: `${name}: ${strings.friendRemoved}`,
      isError: false,
    });
    setTimeout(() => {
      setFeedback(null);
    }, 2500);
  };

  return (
    <div className="relative z-10 w-full max-w-lg mx-auto flex-1 flex flex-col px-4 pt-3 pb-24 overflow-y-auto select-none">
      {/* Header Banner */}
      <div className="text-center mb-3">
        <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-[#fffbeb] via-[#fde047] to-[#ca8a04] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] tracking-wider">
          {strings.friendsTitle}
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/80 font-sans mt-0.5">
          {strings.friendsSub}
        </p>
      </div>

      {/* User's Own Medals Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#3a2215] via-[#24150d] to-[#170c07] border-2 border-[#ca8a04] shadow-[0_8px_20px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.1)] mb-4">
        <div className="flex items-center justify-between pb-2 border-b border-amber-900/50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-b from-amber-400 to-amber-700 border border-amber-300 flex items-center justify-center text-stone-950 font-bold text-sm shadow">
              👑
            </div>
            <div>
              <span className="text-xs text-amber-300/80 font-cinzel font-semibold block uppercase">
                {strings.yourMedals}
              </span>
              <span className="text-sm font-cinzel font-bold text-white block leading-tight">
                {playerName}
              </span>
            </div>
          </div>
          <span className="text-xs font-cinzel text-[#fef08a] font-black px-2.5 py-1 rounded-full bg-black/60 border border-amber-500/40">
            {myMedals.total} {strings.totalMedals}
          </span>
        </div>

        {/* 4 Medals Badges */}
        <div className="grid grid-cols-4 gap-2 mt-2.5 text-center">
          {/* Platinum */}
          <div className="p-1.5 rounded-xl bg-sky-950/60 border border-sky-400/60 flex flex-col items-center shadow-sm">
            <span className="text-base">💎</span>
            <span className="text-[10px] font-cinzel font-bold text-sky-200">{strings.platinumShort}</span>
            <span className="text-base font-black font-cinzel text-sky-300 tabular-nums">
              {myMedals.platinum}
            </span>
          </div>

          {/* Gold */}
          <div className="p-1.5 rounded-xl bg-amber-950/60 border border-amber-400/60 flex flex-col items-center shadow-sm">
            <span className="text-base">🥇</span>
            <span className="text-[10px] font-cinzel font-bold text-amber-200">{strings.goldShort}</span>
            <span className="text-base font-black font-cinzel text-[#fef08a] tabular-nums">
              {myMedals.gold}
            </span>
          </div>

          {/* Silver */}
          <div className="p-1.5 rounded-xl bg-slate-900/70 border border-slate-400/60 flex flex-col items-center shadow-sm">
            <span className="text-base">🥈</span>
            <span className="text-[10px] font-cinzel font-bold text-slate-200">{strings.silverShort}</span>
            <span className="text-base font-black font-cinzel text-slate-200 tabular-nums">
              {myMedals.silver}
            </span>
          </div>

          {/* Bronze */}
          <div className="p-1.5 rounded-xl bg-orange-950/60 border border-orange-600/60 flex flex-col items-center shadow-sm">
            <span className="text-base">🥉</span>
            <span className="text-[10px] font-cinzel font-bold text-orange-200">{strings.bronzeShort}</span>
            <span className="text-base font-black font-cinzel text-orange-300 tabular-nums">
              {myMedals.bronze}
            </span>
          </div>
        </div>
      </div>

      {/* Add Friend Form */}
      <form onSubmit={handleAddFriend} className="mb-4">
        <div className="p-3 rounded-2xl bg-black/60 border border-amber-600/40 backdrop-blur-sm">
          <label className="block text-xs font-cinzel font-bold text-amber-200 mb-1.5">
            ⚔️ {strings.addFriendBtn}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder={strings.addFriendPlaceholder}
              className="flex-1 px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-amber-100 placeholder-stone-500 text-xs font-sans focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-b from-[#eab308] via-[#ca8a04] to-[#854d0e] border border-[#fef08a] text-stone-950 font-cinzel font-bold text-xs shadow hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              + {strings.addFriendBtn}
            </button>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`mt-2 p-2 rounded-lg text-xs font-sans text-center transition-all ${
                feedback.isError
                  ? 'bg-rose-950/80 text-rose-200 border border-rose-700'
                  : 'bg-emerald-950/80 text-emerald-200 border border-emerald-600'
              }`}
            >
              {feedback.text}
            </div>
          )}
        </div>
      </form>

      {/* Friends List */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-amber-200/90">
            {strings.friendsList} ({friends.length})
          </span>
        </div>

        {friends.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-black/40 border border-stone-800 text-stone-400 text-xs font-sans">
            {strings.noFriendsYet}
          </div>
        ) : (
          <div className="space-y-2.5">
            {friends.map((friend) => {
              const friendTotalMedals =
                friend.medals.platinum +
                friend.medals.gold +
                friend.medals.silver +
                friend.medals.bronze;

              return (
                <div
                  key={friend.id}
                  className="p-3 rounded-2xl bg-gradient-to-r from-[#24150d]/80 via-black/80 to-[#1c0f09]/80 border border-amber-900/60 shadow hover:border-amber-500 transition-all flex flex-col gap-2"
                >
                  {/* Top: Avatar, Name, Title, and Remove Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-b from-amber-700 via-stone-900 to-black border-2 border-amber-500/60 flex items-center justify-center text-lg shadow-sm">
                        {friend.avatarSeed % 2 === 0 ? '🛡️' : '⚔️'}
                      </div>
                      <div>
                        <span className="font-cinzel text-sm font-bold text-amber-100 block leading-tight">
                          {friend.name}
                        </span>
                        <span className="text-[11px] text-amber-300/80 font-sans block">
                          {friend.title} · {strings.highestLevelShort} {friend.highestLevel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-cinzel font-bold text-amber-300 px-2 py-0.5 rounded-full bg-black/60 border border-amber-600/40">
                        {friendTotalMedals} 🏅
                      </span>
                      <button
                        onClick={() => handleRemoveFriend(friend.id, friend.name)}
                        title={strings.removeFriendTooltip}
                        className="text-stone-500 hover:text-rose-400 p-1 text-xs cursor-pointer transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Bottom: Friend Medals Summary Badges */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1.5 border-t border-amber-950/60 text-center">
                    {/* Platinum */}
                    <div className="py-1 px-1 rounded-lg bg-sky-950/40 border border-sky-500/30 flex items-center justify-center gap-1">
                      <span className="text-xs">💎</span>
                      <span className="text-[11px] font-cinzel font-bold text-sky-200 tabular-nums">
                        {friend.medals.platinum}
                      </span>
                    </div>

                    {/* Gold */}
                    <div className="py-1 px-1 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-center gap-1">
                      <span className="text-xs">🥇</span>
                      <span className="text-[11px] font-cinzel font-bold text-[#fef08a] tabular-nums">
                        {friend.medals.gold}
                      </span>
                    </div>

                    {/* Silver */}
                    <div className="py-1 px-1 rounded-lg bg-slate-900/50 border border-slate-400/30 flex items-center justify-center gap-1">
                      <span className="text-xs">🥈</span>
                      <span className="text-[11px] font-cinzel font-bold text-slate-200 tabular-nums">
                        {friend.medals.silver}
                      </span>
                    </div>

                    {/* Bronze */}
                    <div className="py-1 px-1 rounded-lg bg-orange-950/40 border border-orange-600/30 flex items-center justify-center gap-1">
                      <span className="text-xs">🥉</span>
                      <span className="text-[11px] font-cinzel font-bold text-orange-200 tabular-nums">
                        {friend.medals.bronze}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
