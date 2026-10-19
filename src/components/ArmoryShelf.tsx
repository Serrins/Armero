import React, { useState, useEffect, useRef } from 'react';
import { ItemInstance, Stand } from '../types/game';
import { ItemGraphic } from './ItemGraphic';
import { soundscape } from '../services/soundscape';

interface ArmoryShelfProps {
  stands: Stand[];
  columns: number;
  selectedItem: { standId: number; item: ItemInstance; index: number } | null;
  onSelectItem: (standId: number, item: ItemInstance, index: number) => void;
  onMoveToStand: (
    targetStandId: number,
    sourceItem?: { standId: number; item: ItemInstance; index: number }
  ) => void;
  matchingStandIds: number[];
}

interface ActiveDragState {
  standId: number;
  item: ItemInstance;
  index: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
}

export const ArmoryShelf: React.FC<ArmoryShelfProps> = ({
  stands,
  columns,
  selectedItem,
  onSelectItem,
  onMoveToStand,
  matchingStandIds,
}) => {
  const [activeDrag, setActiveDrag] = useState<ActiveDragState | null>(null);
  const [hoverTargetStandId, setHoverTargetStandId] = useState<number | null>(null);
  const activeDragRef = useRef<ActiveDragState | null>(null);
  activeDragRef.current = activeDrag;

  // Track window pointer events so dragging is fluid even if pointer leaves element
  useEffect(() => {
    if (!activeDrag) return;

    const handlePointerMove = (e: PointerEvent) => {
      const current = activeDragRef.current;
      if (!current) return;

      const dist = Math.hypot(e.clientX - current.startX, e.clientY - current.startY);
      const isNowDragging = current.isDragging || dist > 6;

      // Detect stand under pointer
      let hoverId: number | null = null;
      if (isNowDragging) {
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        for (const el of elements) {
          const standAttr = el.getAttribute('data-stand-id');
          if (standAttr) {
            const parsedId = parseInt(standAttr, 10);
            if (parsedId !== current.standId) {
              const target = stands.find((s) => s.id === parsedId);
              if (target && target.items.length < 3) {
                hoverId = parsedId;
              }
            }
            break;
          }
        }
      }

      setHoverTargetStandId(hoverId);
      setActiveDrag({
        ...current,
        currentX: e.clientX,
        currentY: e.clientY,
        isDragging: isNowDragging,
      });
    };

    const handlePointerUp = (e: PointerEvent) => {
      const current = activeDragRef.current;
      if (!current) return;

      if (current.isDragging) {
        // Find dropped target stand
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        let dropStandId: number | null = null;
        for (const el of elements) {
          const standAttr = el.getAttribute('data-stand-id');
          if (standAttr) {
            const parsedId = parseInt(standAttr, 10);
            if (parsedId !== current.standId) {
              const target = stands.find((s) => s.id === parsedId);
              if (target && target.items.length < 3) {
                dropStandId = parsedId;
              }
            }
            break;
          }
        }

        if (dropStandId !== null) {
          onMoveToStand(dropStandId, {
            standId: current.standId,
            item: current.item,
            index: current.index,
          });
        }
      } else {
        // It was a tap / click
        onSelectItem(current.standId, current.item, current.index);
      }

      setActiveDrag(null);
      setHoverTargetStandId(null);
    };

    const handlePointerCancel = () => {
      setActiveDrag(null);
      setHoverTargetStandId(null);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
    };
  }, [activeDrag, onMoveToStand, onSelectItem, stands]);

  const handleItemPointerDown = (
    e: React.PointerEvent,
    standId: number,
    item: ItemInstance,
    index: number
  ) => {
    // Only handle primary pointer (left mouse or primary touch)
    if (!e.isPrimary || e.button !== 0) return;
    if (matchingStandIds.length > 0 || matchingStandIds.includes(standId)) return;

    setActiveDrag({
      standId,
      item,
      index,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      isDragging: false,
    });
  };

  return (
    <div className="relative w-full max-w-md mx-auto px-2 py-2 select-none touch-none">
      {/* Outer Armory Wooden Frame with Carved Trim and Iron Studs */}
      <div className="relative rounded-2xl p-2.5 sm:p-4 bg-gradient-to-b from-[#3a2215] via-[#24150d] to-[#170c07] border-4 border-[#52331f] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-4px_8px_rgba(0,0,0,0.9)]">
        {/* Wrought Iron Corner Reinforcement Brackets */}
        <div className="absolute top-1.5 left-1.5 w-6 h-6 border-t-2 border-l-2 border-[#854d0e] rounded-tl-lg pointer-events-none opacity-80" />
        <div className="absolute top-1.5 right-1.5 w-6 h-6 border-t-2 border-r-2 border-[#854d0e] rounded-tr-lg pointer-events-none opacity-80" />
        <div className="absolute bottom-1.5 left-1.5 w-6 h-6 border-b-2 border-l-2 border-[#854d0e] rounded-bl-lg pointer-events-none opacity-80" />
        <div className="absolute bottom-1.5 right-1.5 w-6 h-6 border-b-2 border-r-2 border-[#854d0e] rounded-br-lg pointer-events-none opacity-80" />

        {/* Decorative Iron Bolt Rivets */}
        <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-stone-400 shadow-[inset_0_1px_1px_#fff,0_1px_2px_#000]" />
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-stone-400 shadow-[inset_0_1px_1px_#fff,0_1px_2px_#000]" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-stone-400 shadow-[inset_0_1px_1px_#fff,0_1px_2px_#000]" />
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-stone-400 shadow-[inset_0_1px_1px_#fff,0_1px_2px_#000]" />

        {/* Cabinet Backing Interior Wood Grid */}
        <div
          className={`grid gap-2 sm:gap-2.5 transition-all duration-300 ${
            columns === 2 ? 'grid-cols-2' : 'grid-cols-3'
          }`}
        >
          {stands.map((stand) => {
            const isStandFull = stand.items.length >= 3;
            const isMatching = matchingStandIds.includes(stand.id);
            const isHoverTarget = hoverTargetStandId === stand.id;
            const isTargetCandidate =
              selectedItem &&
              selectedItem.standId !== stand.id &&
              !isStandFull;

            return (
              <div
                key={stand.id}
                data-stand-id={stand.id}
                onClick={() => {
                  // Direct tap placement on shelf
                  if (selectedItem && selectedItem.standId !== stand.id && !isStandFull) {
                    onMoveToStand(stand.id);
                  }
                }}
                className={`relative flex items-center justify-evenly min-h-[76px] sm:min-h-[90px] px-1 py-1.5 rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden touch-none ${
                  isMatching
                    ? 'bg-amber-950/70 border-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.6)]'
                    : isHoverTarget
                    ? 'bg-amber-800/40 border-amber-300 ring-2 ring-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.8)] scale-[1.03]'
                    : isTargetCandidate
                    ? 'bg-amber-900/20 border-amber-600/60 hover:bg-amber-800/30'
                    : 'bg-gradient-to-b from-[#1b100b] to-[#110805] border-[#442817] shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)]'
                }`}
              >
                {/* Carved Shelf Recessed Shadow */}
                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                {/* Bottom Wooden Ledge Runner */}
                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#52331f] border-t border-[#694228] shadow-[0_1px_2px_rgba(0,0,0,0.8)] pointer-events-none" />

                {/* Empty Slot Placeholder Indicators */}
                {stand.items.length === 0 && (
                  <div className="flex items-center justify-center w-full h-full opacity-20 text-amber-500/40 pointer-events-none">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                )}

                {/* Stand Items (up to 3 items per compartment) */}
                {stand.items.map((item, idx) => {
                  const isSelected =
                    selectedItem?.standId === stand.id &&
                    selectedItem.index === idx;

                  const isBeingDragged =
                    activeDrag?.isDragging &&
                    activeDrag.standId === stand.id &&
                    activeDrag.index === idx;

                  return (
                    <div
                      key={item.id}
                      onPointerDown={(e) => handleItemPointerDown(e, stand.id, item, idx)}
                      className={`relative flex-1 max-w-[32%] aspect-square flex items-center justify-center transition-all duration-150 cursor-grab active:cursor-grabbing touch-none ${
                        isBeingDragged
                          ? 'opacity-25 scale-90'
                          : isSelected
                          ? '-translate-y-2.5 scale-110 drop-shadow-[0_10px_14px_rgba(0,0,0,0.9)] z-20'
                          : 'hover:scale-105'
                      }`}
                    >
                      {/* Selection Glow Ring */}
                      {isSelected && !isBeingDragged && (
                        <div className="absolute inset-0 rounded-full border-2 border-amber-400 bg-amber-400/20 blur-[1px] animate-pulse pointer-events-none" />
                      )}

                      <ItemGraphic
                        type={item.type}
                        isGlowing={isMatching || isSelected}
                        className="w-12 h-12 sm:w-14 sm:h-14 pointer-events-none"
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Ghost Drag Avatar following cursor / touch */}
      {activeDrag?.isDragging && (
        <div
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={{
            left: activeDrag.currentX,
            top: activeDrag.currentY,
          }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-950/95 border-2 border-amber-400 p-2 shadow-[0_14px_30px_rgba(0,0,0,0.95),0_0_24px_rgba(245,158,11,0.7)] flex items-center justify-center animate-pulse">
            <ItemGraphic
              type={activeDrag.item.type}
              isGlowing={true}
              className="w-12 h-12 sm:w-16 sm:h-16"
            />
          </div>
        </div>
      )}
    </div>
  );
};
