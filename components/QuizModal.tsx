import React, { useState, useEffect, useCallback } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import type { QuizQuestion } from '../types';
import Icon from './Icon';

interface QuizModalProps {
  onClose: () => void;
}

type QuizStatus = 'loading' | 'active' | 'finished';

const QuizModal: React.FC<QuizModalProps> = ({ onClose }) => {
  const [status, setStatus] = useState<QuizStatus>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const fetchQuestions = useCallback(async () => {
    setStatus('loading');
    const fetchedQuestions = await generateQuizQuestions();
    setQuestions(fetchedQuestions);
    if(fetchedQuestions.length > 0) {
        setStatus('active');
    } else {
        // Handle API failure case
        setStatus('finished'); // Or show an error message
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const correct = questions[currentQuestionIndex].correctAnswerIndex === answerIndex;
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setStatus('finished');
      }
    }, 1500);
  };

  const getButtonClass = (index: number) => {
    if (selectedAnswer === null) {
      return 'bg-gray-700/50 hover:bg-gray-600/50';
    }
    if (index === questions[currentQuestionIndex].correctAnswerIndex) {
      return 'bg-green-500/80';
    }
    if (index === selectedAnswer) {
      return 'bg-red-500/80';
    }
    return 'bg-gray-700/40 opacity-50';
  };

  const renderContent = () => {
    if (status === 'loading') {
      return <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
        <p className="mt-4 text-lg">Génération de nouvelles questions...</p>
      </div>;
    }

    if (status === 'finished') {
        const discount = questions.length > 0 && score === questions.length ? 7 : (questions.length > 0 ? 5 : 0);
        return (
            <div className="text-center p-8">
                <h2 className="text-3xl font-bold text-cyan-400">Quiz terminé !</h2>
                <p className="mt-4 text-xl">Votre score : {score} sur {questions.length}.</p>
                {discount > 0 ? (
                    <div className="mt-6 bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-lg">
                        <p className="text-2xl font-bold">Vous avez gagné {discount}% de réduction !</p>
                        <p className="mt-1">La réduction sera appliquée à votre prochaine réservation.</p>
                    </div>
                ) : <p className="mt-6 text-gray-400">Plus de chance la prochaine fois !</p>}
                <button
                    onClick={onClose}
                    className="mt-8 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg w-full"
                >
                    Fermer
                </button>
            </div>
        );
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-cyan-400">Question {currentQuestionIndex + 1} sur {questions.length}</p>
          <p className="text-sm text-gray-400">Score : {score}</p>
        </div>
        <h3 className="text-xl font-semibold mb-6 min-h-[5rem]">{currentQuestion.question}</h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              className={`w-full text-left p-4 rounded-lg duration-300 flex justify-between items-center ${getButtonClass(index)}`}
            >
              <span>{option}</span>
              {selectedAnswer === index && (
                isCorrect ? <Icon name="check" className="w-6 h-6 text-white"/> : <Icon name="xmark" className="w-6 h-6 text-white"/>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl shadow-cyan-500/10 animate-scale-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-lg font-bold">Quiz Photographie</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <Icon name="close" />
            </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default QuizModal;