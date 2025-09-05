import React, { useState } from 'react';
import { UserType } from '../types';
import Logo from './Logo';
import Icon from './Icon';
import { useUser } from '../contexts/UserContext';
import { useAppContext } from '../contexts/AppContext';

const InitialSetupScreen: React.FC = () => {
  const { completeInitialSetup } = useUser();
  const { setTourActive } = useAppContext();
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<UserType | null>(null);
  const [objective, setObjective] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && userType && objective) {
      const { startTour } = completeInitialSetup({ name: name.trim(), type: userType });
      if (startTour) {
        setTourActive(true);
      }
    }
  };

  const isFormValid = !!name.trim() && !!userType && !!objective;

  const TypeButton: React.FC<{ type: UserType }> = ({ type }) => (
    <button
      type="button"
      onClick={() => setUserType(type)}
      className={`w-full py-4 px-2 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${userType === type ? 'bg-cyan-500/20 border-cyan-500' : 'bg-gray-800 border-gray-700 hover:border-cyan-600'}`}
    >
      <p className={`font-semibold ${userType === type ? 'text-cyan-400' : 'text-white'}`}>{type}</p>
    </button>
  );

  const ObjectiveButton: React.FC<{ value: string }> = ({ value }) => (
    <button
      type="button"
      onClick={() => setObjective(value)}
      className={`w-full p-3 text-left rounded-lg border transition-all duration-200 flex items-center gap-3 ${objective === value ? 'bg-cyan-500/20 border-cyan-500' : 'bg-gray-800 border-gray-700 hover:border-cyan-600'}`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${objective === value ? 'border-cyan-500 bg-cyan-500' : 'border-gray-600'}`}>
        {objective === value && <Icon name="check" className="w-3 h-3 text-white"/>}
      </div>
      <span className={objective === value ? 'text-white' : 'text-gray-300'}>{value}</span>
    </button>
  );


  return (
    <div className="flex flex-col h-full bg-gray-950 text-white animate-fade-in">
      <header className="p-4 flex justify-center items-center border-b border-gray-800/50 flex-shrink-0">
        <Logo className="w-auto h-7" iconOnly={true} />
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-2">Bienvenue !</h1>
          <p className="text-gray-400 text-center mb-8">Commençons par quelques informations de base.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
              <input
                id="fullName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Alex Martin"
                className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-700 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3 text-center">Vous êtes...</label>
              <div className="grid grid-cols-3 gap-3 text-center">
                <TypeButton type={UserType.Model} />
                <TypeButton type={UserType.Photographer} />
                <TypeButton type={UserType.Videographer} />
              </div>
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Quel est votre objectif principal ?</label>
              <div className="space-y-3">
                 <ObjectiveButton value="Collaborer sur des projets créatifs" />
                 <ObjectiveButton value="Partager mon travail et construire mon portfolio" />
                 <ObjectiveButton value="Trouver l'inspiration et découvrir des talents" />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                Continuer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InitialSetupScreen;