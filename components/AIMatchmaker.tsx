import React, { useState, useEffect } from 'react';
import { getAICollaborationSuggestions } from '../services/geminiService';
import type { User, AISuggestion } from '../types';
import Icon from './Icon';
import UserProfileCard from './UserProfileCard';
import { useUser } from '../contexts/UserContext';
import { useAppContext } from '../contexts/AppContext';

interface AIMatchmakerProps {
  viewedUser: User;
}

const AIMatchmaker: React.FC<AIMatchmakerProps> = ({ viewedUser }) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, users: allUsers } = useUser();
  const { viewProfile } = useAppContext();

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      const result = await getAICollaborationSuggestions(currentUser, viewedUser, allUsers);
      setSuggestions(result);
      setIsLoading(false);
    };

    // We only want to run this for non-personal profiles
    if (currentUser.id !== viewedUser.id) {
        fetchSuggestions();
    } else {
        setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewedUser.id, currentUser.id]); // Rerun when viewing a new user or current user changes

  const suggestedUsers = suggestions
    .map(suggestion => {
      const user = allUsers.find(u => u.id === suggestion.userId);
      return user ? { ...user, justification: suggestion.justification } : null;
    })
    .filter((u): u is User & { justification: string } => u !== null);

  if (isLoading) {
    return (
      <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700 text-center">
        <div className="flex items-center justify-center gap-3">
            <Icon name="sparkles" className="w-6 h-6 text-purple-400 animate-pulse" />
            <p className="text-purple-300 font-semibold">Analyse des synergies créatives...</p>
        </div>
      </div>
    );
  }

  if (suggestedUsers.length === 0 || currentUser.id === viewedUser.id) {
    return null; // Don't show anything if no suggestions or viewing own profile
  }

  return (
    <div className="mt-6 animate-fade-in">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Icon name="sparkles" className="w-6 h-6 text-purple-400"/>
            Suggestions de Collaboration IA
        </h4>
        <div className="space-y-4">
            {suggestedUsers.map(user => (
                <div key={user.id} className="bg-gray-800 p-4 rounded-xl border border-purple-500/30">
                    <p className="text-sm text-purple-300 mb-3 italic">"{user.justification}"</p>
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                        <UserProfileCard user={user} onSelect={viewProfile} />
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default AIMatchmaker;