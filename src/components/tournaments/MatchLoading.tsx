import React, { useState, useEffect } from 'react';
import { Swords } from 'lucide-react';

const LOADING_MESSAGES = [
  "Finding opponent...",
  "Preparing match...", 
  "Setting up court...",
  "Match starting soon...",
  "Players warming up...",
  "Checking equipment...",
  "Analyzing strategies...",
  "Getting ready...",
];

function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export default function MatchLoading() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // Changed from 20 to 10 seconds
  const [showPlayers, setShowPlayers] = useState(false);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1250); // Changed from 2500 to 1250 to show more messages in 10 seconds

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    // Show players after a delay
    setTimeout(() => setShowPlayers(true), 500); // Changed from 1000 to 500ms

    return () => {
      clearInterval(messageInterval);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="relative h-32 mb-6">
          {/* Player animations */}
          <div className="absolute inset-0 flex items-center justify-between px-8">
            {/* Player */}
            <div 
              className={`w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center transition-all duration-500 ${
                showPlayers ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
              }`}
            >
              <Swords className="w-8 h-8 text-white" />
            </div>

            {/* VS text with pulse animation */}
            <div className={`text-2xl font-bold text-gray-800 transition-opacity duration-500 ${
              showPlayers ? 'opacity-100' : 'opacity-0'
            }`}>
              VS
            </div>

            {/* Opponent */}
            <div 
              className={`w-16 h-16 bg-red-500 rounded-full flex items-center justify-center transition-all duration-500 ${
                showPlayers ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}
            >
              <Swords className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2">Match in Progress</h3>
        <p className="text-gray-600 animate-pulse min-h-[1.5rem]">
          {LOADING_MESSAGES[messageIndex]}
        </p>

        <div className="mt-8 space-y-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${((10 - timeLeft) / 10) * 100}%` }}
            />
          </div>
          <div className="text-sm text-gray-500">
            {formatTime(timeLeft)} remaining
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-yellow-500 rounded-full animate-ping" />
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-green-500 rounded-full animate-ping" />
        </div>
      </div>
    </div>
  );
}