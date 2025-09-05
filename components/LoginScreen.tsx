import React from 'react';
import Logo from './Logo';
import { useUser } from '../contexts/UserContext';

const LoginScreen: React.FC = () => {
  const { login } = useUser();

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-950 via-gray-900 to-purple-900/40 p-8 text-center animate-fade-in">
      <div className="mb-8">
        <Logo className="w-auto h-16" iconOnly={true} />
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">
        Trouvez votre prochaine collaboration
      </h1>
      <p className="text-gray-300 max-w-sm mb-12">
        La plateforme premium qui met en relation modèles, photographes et vidéastes.
      </p>
      <button
        onClick={login}
        className="w-full max-w-xs bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
      >
        Se connecter
      </button>
    </div>
  );
};

export default LoginScreen;