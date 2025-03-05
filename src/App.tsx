import React, { useState, useEffect } from 'react';
import { GameState, Resources, Player } from './types/game';
import HomePage from './pages/HomePage';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const { isLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/*" element={ <MainLayout /> } />
    </Routes>
  );
  
  // return (<>
  //   {
  //     gameState.selectedSection == 'first' ?
  //       <HomePage gameState={gameState} setGameState={setGameState} />
  //       : 
  //       <div className="min-h-screen bg-gray-50 pb-24">
  //         <ResourceBar resources={resources} />
  //         <div className="container mx-auto px-4 py-20">
  //           {gameState.selectedSection === 'dashboard' && (
  //             <DashboardPage
  //               resources={resources}
  //               gameState={gameState}
  //               setGameState={setGameState}
  //               setResources={setResources}
  //             />
  //           )}
  //           {gameState.selectedSection === 'dashboard' && (
  //             <DashboardPage
  //               resources={resources}
  //               gameState={gameState}
  //               setGameState={setGameState}
  //               setResources={setResources}
  //             />
  //           )}
  //           {gameState.selectedSection === 'club' && (
  //             <ClubPage
  //               resources={resources}
  //               gameState={gameState}
  //               setGameState={setGameState}
  //               setResources={setResources}
  //             />
  //           )}
  //           {gameState.selectedSection === 'tournaments' && (
  //             <TournamentsPage
  //               players={gameState.players}
  //               resources={resources}
  //               onRegister={(tournamentId, playerIds) => {
  //                 // Tournament registration logic
  //               }}
  //             />
  //           )}
  //           {gameState.selectedSection === 'quick-match' && (
  //             <QuickMatchPage
  //               players={gameState.players}
  //               onRegister={handleQuickMatch}
  //             />
  //           )}
  //           {gameState.selectedSection === 'interclub' && (
  //             <InterclubPage
  //               resources={resources}
  //             />
  //           )}
  //           {gameState.selectedSection === 'facilities' && (
  //             <FacilitiesPage
  //               resources={resources}
  //               gameState={gameState}
  //               setGameState={setGameState}
  //               setResources={setResources}
  //             />
  //           )}
  //         </div>
  //         <Navigation
  //           selectedSection={gameState.selectedSection}
  //           onSectionChange={(section) =>
  //             setGameState(prev => ({ ...prev, selectedSection: section }))
  //           }
  //           onOpenShop={() => setShowShop(true)}
  //         />
    
  //         {showShop && (
  //           <ResourceShop
  //             onClose={() => setShowShop(false)}
  //             onPurchase={handleResourcePurchase}
  //             currentResources={resources}
  //           />
  //         )}
  //       </div>
  //   }</>
  // );
}