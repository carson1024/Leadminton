import React, { useState, useEffect } from 'react';
import { Trophy, Timer } from 'lucide-react';
import { Match, TournamentRound } from '../../types/tournament';

interface TournamentBracketProps {
  rounds: TournamentRound[];
  currentPlayerId: string;
  startTime: number;
  onMatchSelect: (matchIndex: number) => void;
}

export default function TournamentBracket({ 
  rounds, 
  currentPlayerId, 
  startTime,
  onMatchSelect 
}: TournamentBracketProps) {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, Math.floor((startTime - Date.now()) / 1000)));

  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleMatchClick = (roundIndex: number, matchIndex: number) => {
    const match = rounds[roundIndex].matches[matchIndex];
    if (match.players.some(p => p?.id === currentPlayerId) && !match.completed) {
      onMatchSelect(matchIndex);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h2 className="text-2xl font-bold">Tournament Bracket</h2>
        </div>
        {timeLeft > 0 && (
          <div className="flex items-center space-x-2 px-6 py-3 bg-blue-100 rounded-full">
            <Timer className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-blue-600 font-medium">
              Tournament starts in: {timeLeft}s
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between px-4 text-sm font-medium text-gray-600 mb-4">
        {rounds.map((round, i) => (
          <div key={i} className="flex-1 text-center">{round.name}</div>
        ))}
      </div>

      <div className="relative">
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          {rounds.map((round, roundIndex) => (
            round.matches.map((match, matchIndex) => {
              if (roundIndex < rounds.length - 1) {
                const startX = (roundIndex + 1) * (100 / rounds.length);
                const startY = (matchIndex * 160) + 60;
                const endX = (roundIndex + 2) * (100 / rounds.length);
                const endY = (Math.floor(matchIndex / 2) * 160) + 60;
                
                return (
                  <path
                    key={`line-${roundIndex}-${matchIndex}`}
                    d={`M ${startX}% ${startY} H ${(startX + endX) / 2} V ${endY} H ${endX}%`}
                    stroke="#E5E7EB"
                    strokeWidth="2"
                    fill="none"
                  />
                );
              }
              return null;
            })
          ))}
        </svg>

        <div className="relative flex">
          {rounds.map((round, roundIndex) => (
            <div 
              key={roundIndex} 
              className="flex-1 flex flex-col"
              style={{ gap: '80px' }}
            >
              {round.matches.map((match, matchIndex) => (
                <div
                  key={`${roundIndex}-${matchIndex}`}
                  className="relative mx-2"
                  style={{ 
                    marginTop: matchIndex === 0 ? '0' : 
                      roundIndex === 1 ? '80px' : 
                      roundIndex === 2 ? '240px' : '0'
                  }}
                  onClick={() => handleMatchClick(roundIndex, matchIndex)}
                >
                  {match.players.map((player, playerIndex) => (
                    <div
                      key={playerIndex}
                      className={`h-12 px-4 flex items-center border-l-4 bg-white shadow-sm mb-1 
                        ${player?.id === currentPlayerId ? 'border-l-blue-500' : 'border-l-gray-200'}
                        ${match.players.some(p => p?.id === currentPlayerId) && !match.completed ? 'cursor-pointer hover:bg-blue-50' : ''}
                      `}
                    >
                      {player ? (
                        <div className="flex justify-between items-center w-full">
                          <div>
                            <span className="font-medium">{player.name}</span>
                            <span className="text-xs text-gray-500 ml-2">Level {player.level}</span>
                          </div>
                          {match.winner?.id === player.id && (
                            <Trophy className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">À déterminer</span>
                      )}
                    </div>
                  ))}
                  {match.completed && match.score && (
                    <div className="text-xs text-gray-500 mt-1">
                      Score: {match.score}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}