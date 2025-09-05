import React from 'react';
import Icon from './Icon';

interface QuizNotificationPopupProps {
  onStartQuiz: () => void;
  onClose: () => void;
}

const QuizNotificationPopup: React.FC<QuizNotificationPopupProps> = ({ onStartQuiz, onClose }) => {
  return (
    <div className="absolute bottom-24 right-4 w-80 bg-gray-800/80 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/10 p-4 animate-popup-transition z-[1020]">
      <div className="flex items-start gap-4">
        <div className="mt-1 flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
            <Icon name="gift" className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-white">Quiz Photo Disponible !</p>
          <p className="text-sm text-gray-300 mt-1">
            Testez vos connaissances et gagnez jusqu'à <span className="font-bold text-cyan-400">7% de réduction</span> !
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={onStartQuiz}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold py-2 px-3 rounded-lg transition-colors"
            >
              Commencer
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-bold py-2 px-3 rounded-lg transition-colors"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizNotificationPopup;