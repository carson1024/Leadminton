import React, { useState } from 'react';
import { Trophy, Users, Feather, UtensilsCrossed, Info, Swords, ArrowLeft, Medal, Coins } from 'lucide-react';
import { Resources, Player } from '../types/game';
import { useGame } from '../contexts/GameContext';
import { calculatePlayerScore } from '../utils/playerScore';

export default function InterclubPage() {
  const { resources, gameState } = useGame();
  const [showIntro, setShowIntro] = useState(true);

  // Page d'introduction des interclubs
  if (showIntro) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <Trophy className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold">Interclubs</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Nouvelle Saison d'Interclub</h2>
            <p className="text-lg text-gray-600">
              Vous êtes sur le point de lancer une saison d'interclub d'une durée de 1 mois
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Prérequis */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">Prérequis</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span>5 joueurs minimum</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span>1000 pièces</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Feather className="w-5 h-5 text-blue-500" />
                  <span>100 volants</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <UtensilsCrossed className="w-5 h-5 text-green-500" />
                  <span>50 nourriture</span>
                </div>
              </div>
            </div>

            {/* Ressources actuelles */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Vos ressources</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span>Joueurs</span>
                  </div>
                  <span className="font-medium">{gameState.players.length}/5</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span>Pièces</span>
                  </div>
                  <span className="font-medium">{resources.coins}/1000</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Feather className="w-5 h-5 text-blue-500" />
                    <span>Volants</span>
                  </div>
                  <span className="font-medium">{resources.shuttlecocks}/100</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <div className="flex items-center space-x-2">
                    <UtensilsCrossed className="w-5 h-5 text-green-500" />
                    <span>Nourriture</span>
                  </div>
                  <span className="font-medium">{resources.meals}/50</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sélection de la catégorie */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Sélectionnez votre catégorie</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                <div className="text-lg font-medium">Départemental</div>
                <div className="text-sm opacity-75">Niveau débutant</div>
              </button>
              <button disabled className="p-4 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed">
                <div className="text-lg font-medium">Régional</div>
                <div className="text-sm">Niveau intermédiaire</div>
              </button>
              <button disabled className="p-4 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed">
                <div className="text-lg font-medium">National</div>
                <div className="text-sm">Niveau avancé</div>
              </button>
              <button disabled className="p-4 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed">
                <div className="text-lg font-medium">TOP 12</div>
                <div className="text-sm">Élite</div>
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center mt-4">
              <Info className="w-4 h-4 inline-block mr-1" />
              Les catégories supérieures seront débloquées après avoir remporté le niveau précédent
            </p>
          </div>

          {/* Bouton de démarrage */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowIntro(false)}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Swords className="w-5 h-5" />
              <span>Commencer la saison</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Contenu principal des interclubs
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-2xl font-bold">Interclubs</h1>
        </div>
        <button
          onClick={() => setShowIntro(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Liste des joueurs */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span>Joueurs du Club</span>
          </h2>
          <div className="space-y-3">
            {gameState.players.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium">{player.name}</div>
                  <div className="text-xs text-gray-500">Niveau {player.level}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    Score: {calculatePlayerScore(player).score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prochaine rencontre */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Swords className="w-5 h-5 text-purple-500" />
            <span>Prochaine Rencontre</span>
          </h2>
          <div className="text-center py-8">
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Trophy className="w-8 h-8 text-blue-500" />
                </div>
                <div className="font-medium">Votre Club</div>
              </div>
              <div className="text-2xl font-bold text-gray-400">VS</div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                  <Trophy className="w-8 h-8 text-red-500" />
                </div>
                <div className="font-medium">Club Adversaire</div>
              </div>
            </div>
            <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              Créer la composition
            </button>
          </div>
        </div>

        {/* Récompenses de fin de saison */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Medal className="w-5 h-5 text-yellow-500" />
            <span>Récompenses de fin de saison</span>
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <div>
                <div className="font-medium">1ère place</div>
                <div className="text-sm text-gray-600">5000 pièces + 50 diamants</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg">
              <Trophy className="w-6 h-6 text-gray-500" />
              <div>
                <div className="font-medium">2ème place</div>
                <div className="text-sm text-gray-600">3000 pièces + 30 diamants</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-orange-50 rounded-lg">
              <Trophy className="w-6 h-6 text-orange-500" />
              <div>
                <div className="font-medium">3ème place</div>
                <div className="text-sm text-gray-600">1500 pièces + 15 diamants</div>
              </div>
            </div>
          </div>
        </div>

        {/* Classement de la poule */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-blue-500" />
            <span>Classement de la poule</span>
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Team A', points: 590 },
              { name: 'Vali Group', points: 424 },
              { name: 'Group Boss', points: 300 },
              { name: 'Tournan', points: 254 },
            ].map((team, index) => (
              <div key={team.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div className="font-medium">{team.name}</div>
                </div>
                <div className="text-sm font-medium">
                  {team.points} points
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}