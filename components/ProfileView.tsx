import React, { useRef, useState, memo } from 'react';
import type { User, PortfolioItem } from '../types';
import Icon from './Icon';
import { useUser } from '../contexts/UserContext';
import { useAppContext } from '../contexts/AppContext';
import { type IconName } from '../constants';

// --- Helper Functions for File Processing ---
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      video.currentTime = 1; // Seek to 1 second for the thumbnail
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg'));
      } else {
        reject(new Error('Could not get 2d context from canvas.'));
      }
      URL.revokeObjectURL(video.src); // Clean up
    };

    video.onerror = (err) => {
      console.error('Video thumbnail generation error:', err);
      reject(new Error('Failed to load video for thumbnail generation.'));
      URL.revokeObjectURL(video.src); // Clean up
    };
    
    video.src = URL.createObjectURL(file);
    video.load();
  });
};

// --- ProfileView Component ---
const ProfileView: React.FC = () => {
  const { currentUser: user, logout, updateCurrentUser } = useUser();
  const { setOnboardingOpen, setEditingProfile, setActiveSubView } = useAppContext();
  
  const [isAvatarOptionsOpen, setIsAvatarOptionsOpen] = useState(false);
  const profilePicImportRef = useRef<HTMLInputElement>(null);
  const profilePicCaptureRef = useRef<HTMLInputElement>(null);
  const portfolioFileInputRef = useRef<HTMLInputElement>(null);

  const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      readFileAsDataURL(file)
        .then(newAvatarUrl => updateCurrentUser({ avatarUrl: newAvatarUrl }))
        .catch(err => console.error("Error reading profile picture file:", err));
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPortfolioItemsPromises = Array.from(files).map(async (file): Promise<PortfolioItem | null> => {
      try {
        if (file.type.startsWith('image/')) {
          const imageUrl = await readFileAsDataURL(file);
          return { type: 'image', url: imageUrl };
        } else if (file.type.startsWith('video/')) {
          const videoUrl = URL.createObjectURL(file);
          const thumbnailUrl = await generateVideoThumbnail(file);
          return { type: 'video', url: videoUrl, thumbnailUrl: thumbnailUrl };
        }
      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
        return null;
      }
      return null;
    });

    const newItems = (await Promise.all(newPortfolioItemsPromises)).filter((item): item is PortfolioItem => item !== null);

    if (newItems.length > 0) {
      updateCurrentUser({ portfolio: [...user.portfolio, ...newItems] });
    }

    if (event.target) {
      event.target.value = '';
    }
  };

  const handleRemoveFromPortfolio = (indexToRemove: number) => {
    const itemToRemove = user.portfolio[indexToRemove];
    if (itemToRemove.type === 'video' && itemToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(itemToRemove.url);
    }
    const newPortfolio = user.portfolio.filter((_, index) => index !== indexToRemove);
    updateCurrentUser({ portfolio: newPortfolio });
  };

  const ProfileStat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <div className="text-center">
      <p className="font-bold text-lg text-white">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );

  const SettingsItem: React.FC<{ icon: IconName; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
     <button onClick={onClick} className="flex items-center justify-between w-full p-4 bg-gray-800 rounded-lg hover:bg-gray-700/60 transition-colors border border-gray-700">
        <div className="flex items-center gap-4">
            <Icon name={icon} className="w-6 h-6 text-cyan-400" />
            <span className="font-medium text-white">{label}</span>
        </div>
        <Icon name="chevronRight" className="w-5 h-5 text-gray-500" />
     </button>
  );

  return (
    <>
      <div className="flex flex-col h-full animate-fade-in pb-24 md:pb-4">
        {/* Hidden file inputs */}
        <input type="file" ref={profilePicImportRef} onChange={handlePictureUpload} accept="image/*" className="hidden" aria-hidden="true" />
        <input type="file" ref={profilePicCaptureRef} onChange={handlePictureUpload} accept="image/*" capture="user" className="hidden" aria-hidden="true" />
        <input type="file" ref={portfolioFileInputRef} onChange={handleFileImport} accept="image/*,video/*" multiple className="hidden" aria-hidden="true" />

        <header className="p-4 border-b border-gray-800/50 flex-shrink-0">
          <h1 className="text-xl font-bold text-white">Mon Profil</h1>
        </header>
        <div className="p-4">
          <div className="flex flex-col items-center">
              <button onClick={() => setIsAvatarOptionsOpen(true)} className="relative" aria-label="Changer la photo de profil">
                  {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-cyan-500" />
                  ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-cyan-500 bg-gray-800 flex items-center justify-center">
                          <Icon name="camera" className="w-10 h-10 text-gray-600" />
                      </div>
                  )}
                  {user.isPro && (
                      <div className="absolute -bottom-2 -right-2 px-2 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-md border-2 border-gray-950">
                          PRO
                      </div>
                  )}
              </button>
              <h2 className="mt-4 text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-md text-gray-300">{user.headline}</p>
              <button 
                onClick={() => setEditingProfile(true)}
                className="mt-3 bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold py-2 px-4 rounded-full transition-colors"
              >
                  Modifier le profil
              </button>
          </div>

          {!user.isPro && (
              <div className="mt-6 p-4 bg-green-900/40 rounded-xl text-center border border-green-500/30">
                  <h3 className="font-bold text-green-300">Passez au niveau supérieur !</h3>
                  <p className="text-sm text-green-400/80 mt-1">Devenez un professionnel vérifié pour augmenter votre visibilité et débloquer des fonctionnalités exclusives.</p>
                  <button 
                      onClick={() => setOnboardingOpen(true)}
                      className="mt-3 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-5 rounded-lg transition-colors"
                  >
                      Passez PRO
                  </button>
              </div>
          )}

          <div className="mt-6 p-4 bg-gray-800 rounded-xl flex justify-around items-center border border-gray-700">
              <ProfileStat value="0" label="Abonnés" />
              <div className="h-10 w-px bg-gray-700"></div>
              <ProfileStat value="0" label="Abonnements" />
              <div className="h-10 w-px bg-gray-700"></div>
              <ProfileStat value={user.rating.toFixed(1)} label="Note" />
          </div>

          <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-white">Mon Portfolio</h3>
              </div>
              {user.portfolio.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                      {user.portfolio.map((item, index) => (
                        <div key={index} className="relative group aspect-square">
                          {item.type === 'image' ? (
                            <img src={item.url} alt={`Portfolio ${index + 1}`} className="rounded-md object-cover w-full h-full" />
                          ) : item.url.startsWith('blob:') ? (
                            <div className="relative w-full h-full rounded-md overflow-hidden cursor-pointer">
                              <video
                                  onMouseEnter={e => e.currentTarget.play()}
                                  onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                  src={item.url}
                                  className="w-full h-full object-cover"
                                  muted loop playsInline poster={item.thumbnailUrl}
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity pointer-events-none">
                                  <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                                      <Icon name="play" className="w-7 h-7 text-white ml-1" />
                                  </div>
                              </div>
                            </div>
                          ) : (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden w-full h-full">
                              <img src={item.thumbnailUrl} alt={`Portfolio video ${index + 1}`} className="rounded-md object-cover w-full h-full" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                                  <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                                      <Icon name="play" className="w-7 h-7 text-white ml-1" />
                                  </div>
                              </div>
                            </a>
                          )}
                          <button
                              onClick={() => handleRemoveFromPortfolio(index)}
                              className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              aria-label="Supprimer"
                          >
                              <Icon name="xmark" className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                       <button
                          onClick={() => portfolioFileInputRef.current?.click()}
                          className="relative group aspect-square flex items-center justify-center bg-gray-800/50 rounded-md border-2 border-dashed border-gray-700 hover:border-cyan-400 transition-colors"
                          aria-label="Ajouter plus de médias"
                      >
                          <Icon name="plusCircle" className="w-10 h-10 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                      </button>
                  </div>
              ) : (
                  <div className="w-full p-8 text-center bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700 flex justify-center items-center">
                      <button 
                          onClick={() => portfolioFileInputRef.current?.click()}
                          className="bg-slate-800/50 hover:bg-slate-700/50 border border-cyan-400/50 hover:border-cyan-400 text-cyan-400 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                      >
                          <Icon name="plusCircle" className="w-6 h-6" />
                          <span>Ajouter un média</span>
                      </button>
                  </div>
              )}
          </div>

          <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-white">Paramètres</h3>
              <SettingsItem icon="bell" label="Notifications" onClick={() => setActiveSubView('notifications')} />
              <SettingsItem icon="creditCard" label="Paiement" onClick={() => setActiveSubView('payment')} />
              <SettingsItem icon="questionMarkCircle" label="Aide & Support" onClick={() => setActiveSubView('help')} />
          </div>

          <div className="mt-6 space-y-3">
               <h3 className="text-lg font-semibold text-white">Légal</h3>
               <SettingsItem icon="documentText" label="Conditions d'utilisation" onClick={() => setActiveSubView('terms')} />
               <SettingsItem icon="shieldExclamation" label="Politique de confidentialité" onClick={() => setActiveSubView('privacy')} />
          </div>
          
          <div className="mt-6">
              <button onClick={logout} className="flex items-center w-full p-4 bg-red-900/40 rounded-lg hover:bg-red-800/60 transition-colors text-red-400 border border-red-500/30">
                 <Icon name="logout" className="w-6 h-6 mr-4" />
                 <span className="font-medium">Déconnexion</span>
              </button>
          </div>
        </div>
      </div>
      
      {isAvatarOptionsOpen && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setIsAvatarOptionsOpen(false)}>
            <div className="bg-gray-800 rounded-2xl w-full max-w-sm p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-center text-white mb-4">Changer la photo de profil</h3>
                <div className="space-y-3">
                    <button
                        onClick={() => {
                            profilePicImportRef.current?.click();
                            setIsAvatarOptionsOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        <Icon name="grid" className="w-5 h-5" />
                        <span>Importer une photo</span>
                    </button>
                    <button
                        onClick={() => {
                            profilePicCaptureRef.current?.click();
                            setIsAvatarOptionsOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        <Icon name="camera" className="w-5 h-5" />
                        <span>Prendre une photo</span>
                    </button>
                     <button
                        onClick={() => setIsAvatarOptionsOpen(false)}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors mt-2"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default memo(ProfileView);