import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TopHeader, ActiveTab } from './components/TopHeader';
import { InteractiveForest } from './components/InteractiveForest';
import { HouseSettlementView } from './components/HouseSettlementView';
import { WorkersLodge } from './components/WorkersLodge';
import { SawmillTrade } from './components/SawmillTrade';
import { WorkshopTools } from './components/WorkshopTools';
import { ConversionModals, ModalType } from './components/ConversionModals';
import { StatsModal } from './components/StatsModal';
import { OfflineModal } from './components/OfflineModal';
import { OfflineIndicator } from './components/OfflineIndicator';

function GameContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [activeConversionModal, setActiveConversionModal] = useState<ModalType>(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const { resetGame } = useGame();

  const handleConfirmReset = () => {
    resetGame();
    setIsResetConfirmOpen(false);
    setActiveTab('map');
  };

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header with the 4 Resource Icons + Numbers & Navigation */}
      <TopHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenModal={(type) => setActiveConversionModal(type)}
        onOpenStats={() => setIsStatsOpen(true)}
        onReset={() => setIsResetConfirmOpen(true)}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Main View Area: Fits snugly into screen height */}
      <main className="flex-1 relative overflow-hidden w-full h-full">
        {activeTab === 'map' && (
          <InteractiveForest
            onOpenModal={(type) => setActiveConversionModal(type)}
            onOpenHomestead={() => setActiveTab('homestead')}
          />
        )}

        {activeTab === 'homestead' && (
          <div className="w-full h-full overflow-y-auto px-4 sm:px-6 py-6 max-w-7xl mx-auto">
            <HouseSettlementView
              onOpenModal={(type) => setActiveConversionModal(type)}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

        {activeTab === 'sawmill' && (
          <div className="w-full h-full overflow-y-auto px-4 sm:px-6 py-6 max-w-7xl mx-auto">
            <SawmillTrade />
          </div>
        )}

        {activeTab === 'forge' && (
          <div className="w-full h-full overflow-y-auto px-4 sm:px-6 py-6 max-w-7xl mx-auto">
            <WorkshopTools />
          </div>
        )}

        {activeTab === 'workers' && (
          <div className="w-full h-full overflow-y-auto px-4 sm:px-6 py-6 max-w-7xl mx-auto">
            <WorkersLodge />
          </div>
        )}
      </main>

      {/* Conversion & Economy Popups (Wood, Planks, Gold, Weapon) */}
      <ConversionModals
        activeModal={activeConversionModal}
        onClose={() => setActiveConversionModal(null)}
        onOpenModal={(type) => setActiveConversionModal(type)}
      />

      {/* Lifetime Stats & Milestones Modal */}
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />

      {/* Offline Earnings Modal */}
      <OfflineModal />

      {/* Connectivity Status Indicator */}
      <OfflineIndicator />

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl max-w-sm w-full text-stone-100 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-rose-400">
              Reset Settlement Progress?
            </h3>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              This will reset all cut trees, gathered wood, house upgrades, tools, and hired workers back to day one in the wilderness.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-stone-300 hover:bg-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow active:scale-95 cursor-pointer"
              >
                Yes, Start Over
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
