import React, { useEffect, useState } from "react";
import {
  Trophy,
  Users,
  Feather,
  UtensilsCrossed,
  Info,
  Swords,
  ArrowLeft,
  Medal,
  Coins,
  Eye,
} from "lucide-react";
import { Resources, Player } from "../types/game";
import { useGame } from "../contexts/GameContext";
import { calculatePlayerScore } from "../utils/playerScore";

export default function InterclubPage() {
  const { resources, gameState } = useGame();
  const [showIntro, setShowIntro] = useState(1);
  const [showAllPlayer, setShowAllPlayer] = useState(false);
  const [selectedPlayerIdMS, setSelectedPlayerIdMS] = useState("");
  const [selectedPlayerIdWS, setSelectedPlayerIdWS] = useState("");
  const [selectedPlayerIdMD1, setSelectedPlayerIdMD1] = useState("");
  const [selectedPlayerIdMD2, setSelectedPlayerIdMD2] = useState("");
  const [selectedPlayerIdWD1, setSelectedPlayerIdWD1] = useState("");
  const [selectedPlayerIdWD2, setSelectedPlayerIdWD2] = useState("");
  const [selectedPlayerIdMiD1, setSelectedPlayerIdMiD1] = useState("");
  const [selectedPlayerIdMiD2, setSelectedPlayerIdMiD2] = useState("");
  const [currentTime, setCurrentTime] = useState<Date>(new Date(Date.now()));

  const [lineUpState, setLineUpState] = useState(false);

  setInterval(() => {
    setCurrentTime(new Date(Date.now()));
  }, 1000);
  const nameArray1 = ["Départemental", "Régional", "National", "TOP 12"];
  const nameArray2 = [
    "Niveau débutant",
    "Niveau intermédiaire",
    "Niveau avancé",
    "Élite",
  ];

  const [currentSeason, setCurrentSeason] = useState(0);
  const [nextMatchDate, setNextMatchDate] = useState<Date>(
    new Date("2025/07/02")
  );
  const onSelectSeason = (index: number) => {
    setCurrentSeason(index);
    const now = new Date();
    if (gameState.seasons && gameState.seasons?.length > 0) {
      setNextMatchDate(
        gameState.seasons[index].match_days.find((matchDay) => {
          return new Date(matchDay) > now;
        }) || now
      );
    }
  };

  function formatTime(seconds: number): string {
    const days = Math.floor(seconds / 86400); // 86400 seconds in a day
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return (
      (days > 0 ? `${days}d ` : "") +
      `${hours}:${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`
    );
  }

  useEffect(() => {
    console.log("nextMatchDate", nextMatchDate);
  }, [nextMatchDate]);

  // Page d'introduction des interclubs  Interclub introductory page
  if (showIntro == 1) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <Trophy className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold">Interclubs</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            {/* New Interclub Season */}
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Sélectionnez la saison
            </h2>
            {/* You are about to launch a one-month interclub season. */}
            <p className="text-lg text-gray-600">
              Vous êtes sur le point de vous lancer dans une saison interclubs
              d'un mois
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Prerequisites */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">
                Prérequis
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span>
                    {/* {console.log("this is seasons ", gameState.seasons)} */}
                    {gameState?.seasons
                      ? gameState?.seasons[currentSeason]?.entryFee?.player
                      : "0"}{" "}
                    joueurs minimum
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span>
                    {gameState?.seasons
                      ? gameState?.seasons[currentSeason]?.entryFee?.coins
                      : "0"}{" "}
                    pièces
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Feather className="w-5 h-5 text-blue-500" />
                  <span>
                    {gameState?.seasons
                      ? gameState?.seasons[currentSeason]?.entryFee
                          ?.shuttlecocks
                      : "0"}{" "}
                    volants
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <UtensilsCrossed className="w-5 h-5 text-green-500" />
                  <span>
                    {gameState?.seasons
                      ? gameState?.seasons[currentSeason]?.entryFee?.meals
                      : "0"}{" "}
                    nourriture
                  </span>
                </div>
              </div>
            </div>

            {/* Ressources actuelles */}
            <div className="bg-gray-50 rounded-xl p-6">
              {/* Your resources */}
              <h3 className="text-lg font-semibold mb-4">Vos ressources</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    {/* Players */}
                    <span>Joueurs</span>
                  </div>
                  <span className="font-medium">
                    {gameState.players.length}/5
                  </span>
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
                  <span className="font-medium">
                    {resources.shuttlecocks}/100
                  </span>
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

          {/* Sélection de la catégorie => Select your category*/}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Sélectionnez votre catégorie
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gameState.seasons?.map((season, index) => {
                console.log("this is season, ", season);
                return (
                  <button
                    key={index}
                    onClick={() => onSelectSeason(index)}
                    className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    <div className="text-lg font-medium">
                      {" "}
                      {nameArray1[season.type]}
                    </div>
                    <div className="text-sm opacity-75">
                      {nameArray2[season.type]}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-gray-500 text-center mt-4">
              <Info className="w-4 h-4 inline-block mr-1" />
              Les catégories supérieures seront débloquées après avoir remporté
              le niveau précédent
            </p>
          </div>

          {/* Bouton de démarrage */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowIntro(2)}
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
  if (showIntro == 2) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-2xl font-bold">Interclubs</h1>
          </div>
          <button
            onClick={() => setShowIntro(1)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Liste des joueurs */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span>Joueurs du Club</span>
              </div>
              <button
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setShowAllPlayer(!showAllPlayer)}
              >
                {showAllPlayer ? " Afficher Moins" : "Voir tout..."}
              </button>
            </h2>

            <div className="space-y-3">
              {gameState.players
                .slice() // to avoid mutating original array
                .sort(
                  (a, b) =>
                    calculatePlayerScore(b).score -
                    calculatePlayerScore(a).score
                )
                .map((player, index) => {
                  if (index >= 3 && !showAllPlayer) return;
                  return (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium">{player.name}</div>
                        <div className="text-xs text-gray-500">
                          Niveau {player.level}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          Score: {calculatePlayerScore(player).score}
                        </div>
                        <span>{index + 1}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Prochaine rencontre */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex justify-between items-center space-x-2">
              <Swords className="w-5 h-5 text-purple-500" />
              <span>{`Prochaine Rencontre(${
                "starts in " +
                formatTime(
                  Math.floor(
                    nextMatchDate.getTime() / 1000 -
                      currentTime?.getTime() / 1000
                  )
                )
              })`}</span>
              <span>MD1</span>
            </h2>
            <div className="text-center py-8">
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div className="text-center">
                  <div className="relative w-16 h-16 mb-2 group">
                    <div className="bg-blue-100 rounded-full flex items-center justify-center w-full h-full">
                      <Trophy className="w-8 h-8 text-blue-500" />
                    </div>

                    {/* Overlay that appears on hover */}
                    <div className="absolute inset-0 bg-gray-700 bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
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
              <button
                onClick={() => {
                  setShowIntro(3);
                }}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
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
                  <div className="text-sm text-gray-600">
                    5000 pièces + 50 diamants
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg">
                <Trophy className="w-6 h-6 text-gray-500" />
                <div>
                  <div className="font-medium">2ème place</div>
                  <div className="text-sm text-gray-600">
                    3000 pièces + 30 diamants
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-orange-50 rounded-lg">
                <Trophy className="w-6 h-6 text-orange-500" />
                <div>
                  <div className="font-medium">3ème place</div>
                  <div className="text-sm text-gray-600">
                    1500 pièces + 15 diamants
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Classement de la poule */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-blue-500" />
                <span>Classement de la poule</span>
              </div>
              <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                Voir tout...
              </button>
            </h2>

            <div className="space-y-3">
              {[
                { name: "Team A", points: 590 },
                { name: "Vali Group", points: 424 },
                { name: "Group Boss", points: 300 },
                { name: "Tournan", points: 254 },
              ].map((team, index) => (
                <div
                  key={team.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
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

  if (showIntro == 3) {
    if (!lineUpState) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3 mb-8">
            <Trophy className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">Lineup</span>
            <span className="!ml-16 ml-4 text-xl font-bold">{`${"(MD1)"}`}</span>
            <span className="!ml-16 text-xl font-bold whitespace-nowrap flex-shrink-0">{`${"12h 2m 3s "}`}</span>

            <div className="flex w-full justify-end">
              <button
                onClick={() => {
                  setShowIntro(2);
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Back
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Liste des joueurs */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold mb-4">Men’s Singles</h3>
              <select
                value={selectedPlayerIdMS}
                onChange={(e) => setSelectedPlayerIdMS(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a player
                </option>
                {gameState.players
                  .filter((player: Player) => player.gender === "male")
                  .map((player: Player) => (
                    <option key={player.id} value={player.id}>
                      {player.name} — Level {player.level}
                    </option>
                  ))}
              </select>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold mb-4">Women’s Singles</h3>
              <select
                value={selectedPlayerIdWS}
                onChange={(e) => setSelectedPlayerIdWS(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a player
                </option>
                {gameState.players
                  .filter((player: Player) => player.gender === "female")
                  .map((player: Player) => (
                    <option key={player.id} value={player.id}>
                      {player.name} — Level {player.level}
                    </option>
                  ))}
              </select>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold mb-4">Men's Doubles</h3>
              <select
                value={selectedPlayerIdMD1}
                onChange={(e) => {
                  if (selectedPlayerIdMD2 != e.target.value)
                    setSelectedPlayerIdMD1(e.target.value);
                }}
                className=" mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a player
                </option>
                {gameState.players
                  .filter((player: Player) => player.gender === "male")
                  .map((player: Player) => (
                    <option key={player.id} value={player.id}>
                      {player.name} — Level {player.level}
                    </option>
                  ))}
              </select>
              <select
                value={selectedPlayerIdMD2}
                onChange={(e) => {
                  if (selectedPlayerIdMD1 != e.target.value)
                    setSelectedPlayerIdMD2(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a player
                </option>
                {gameState.players
                  .filter((player: Player) => player.gender === "male")
                  .map((player: Player) => (
                    <option key={player.id} value={player.id}>
                      {player.name} — Level {player.level}
                    </option>
                  ))}
              </select>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold mb-4">Women’s Doubles</h3>
              <select
                value={selectedPlayerIdWD1}
                onChange={(e) => setSelectedPlayerIdWD1(e.target.value)}
                className=" mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a player
                </option>
                {gameState.players
                  .filter((player: Player) => player.gender === "female")
                  .map((player: Player) => (
                    <option key={player.id} value={player.id}>
                      {player.name} — Level {player.level}
                    </option>
                  ))}
              </select>
              <select
                value={selectedPlayerIdWD2}
                onChange={(e) => setSelectedPlayerIdWD2(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a player
                </option>
                {gameState.players
                  .filter((player: Player) => player.gender === "female")
                  .map((player: Player) => (
                    <option key={player.id} value={player.id}>
                      {player.name} — Level {player.level}
                    </option>
                  ))}
              </select>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold mb-4">Mixed Doubles</h3>
              <select
                value={selectedPlayerIdMiD1}
                onChange={(e) => {
                  if (selectedPlayerIdMiD2) {
                    if (
                      gameState.players.find((player) => {
                        return player.id == selectedPlayerIdMiD2;
                      })?.gender !=
                      gameState.players.find((player) => {
                        return player.id == e.target.value;
                      })?.gender
                    )
                      setSelectedPlayerIdMiD1(e.target.value);
                  } else setSelectedPlayerIdMiD1(e.target.value);
                }}
                className=" mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a player
                </option>
                {gameState.players.map((player: Player) => (
                  <option key={player.id} value={player.id}>
                    {player.name} — Level {player.level}
                  </option>
                ))}
              </select>
              <select
                value={selectedPlayerIdMiD2}
                onChange={(e) => {
                  if (selectedPlayerIdMiD1) {
                    if (
                      gameState.players.find((player) => {
                        return player.id == selectedPlayerIdMiD1;
                      })?.gender !=
                      gameState.players.find((player) => {
                        return player.id == e.target.value;
                      })?.gender
                    )
                      setSelectedPlayerIdMiD2(e.target.value);
                  } else setSelectedPlayerIdMiD2(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a player
                </option>
                {gameState.players.map((player: Player) => (
                  <option key={player.id} value={player.id}>
                    {player.name} — Level {player.level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex w-full justify-end">
            <button
              onClick={() => {
                setLineUpState(true);
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Submit Lineup
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h1 className="w-full text-center font-bold text-[40px]">
            Your Lineup is waiting for review
          </h1>
        </div>
      );
    }
  }
}
