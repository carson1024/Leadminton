import React from 'react';
import { X } from 'lucide-react';
import RegisterModalBody from './RegisterModalBody';
import LoginModalBody from './LoginModalBody';

interface AuthModalProps {
  isOpen: boolean;
  type: 'login' | 'register' | null;
  onClose: () => void;
}

export default function AuthModal({ isOpen, type, onClose }: AuthModalProps) {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{type == 'login' ? 'Login' : 'Register'}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
          type == 'login' ? <LoginModalBody onClose={onClose} /> : <RegisterModalBody onClose={onClose} />
        }
      </div>
    </div>
  );
}