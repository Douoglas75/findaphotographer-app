import React, { useEffect } from 'react';
import UserProfileCard from './components/UserProfileCard';
import QuizModal from './components/QuizModal';
import Icon from './components/Icon';
import ProfileDetail from './components/ProfileDetail';
import MapView from './components/MapView';
import MessagesView from './components/MessagesView';
import BookingsView from './components/BookingsView';
import ProfileView from './components/ProfileView';
import FavoritesView from './components/FavoritesView';
import ChatView from './components/ChatView';
import QuizNotificationPopup from './components/QuizNotificationPopup';
import BookingModal from './components/BookingModal';
import OnboardingModal from './components/OnboardingModal';
import ReviewModal from './components/ReviewModal';
import LoginScreen from './components/LoginScreen';
import InitialSetupScreen from './components/InitialSetupScreen';
import EditProfileScreen from './components/EditProfileScreen';
import SubViewScreen from './components/SubViewScreen';
import GuidedTour from './components/GuidedTour';
import PaymentScreen from './components/PaymentScreen';
import Layout from './components/Layout';
import { useUser } from './contexts/UserContext';
import { useAppContext } from './contexts/AppContext';

// --- Small Reusable Components ---
const ToggleSwitch: React.FC<{ label: string }> = ({ label }) => {
  const [enabled, setEnabled] = React.useState(true);
  return (
    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg border border-gray-700">
      <span className="font-medium">{label}</span>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-cyan-500' : 'bg-gray-600'}`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const { isLoggedIn, isProfileComplete, users, messages, bookings, currentUser } = useUser();
  const {
    activeTab, discoverView, viewingUser, activeChatThreadId, activeSubView,
    isQuizOpen, bookingUser, isOnboardingOpen, reviewingBooking, isEditingProfile, isTourActive,
    setDiscoverView, setQuizOpen, setBookingUser, setOnboardingOpen, setReviewingBooking,
    handleBack, viewProfile, closeTour
  } = useAppContext();

  const [isQuizNotificationVisible, setQuizNotificationVisible] = React.useState(false);

  // --- NOTIFICATIONS & TIMERS ---
  useEffect(() => {
    if (!isLoggedIn || !isProfileComplete) return;
    const timer = setTimeout(() => {
        if(!isQuizOpen && !viewingUser && !activeChatThreadId && !bookingUser && !isOnboardingOpen && !reviewingBooking && !isTourActive) {
            setQuizNotificationVisible(true);
        }
    }, 8000);
    return () => clearTimeout(timer);
  }, [isLoggedIn, isProfileComplete, isQuizOpen, viewingUser, activeChatThreadId, bookingUser, isOnboardingOpen, reviewingBooking, isTourActive]);

  // --- SUB VIEW CONTENT ---
  const renderSubViewContent = () => {
    switch (activeSubView) {
      case 'notifications':
        return <div className="space-y-3 p-4"><ToggleSwitch label="Notifications push" /><ToggleSwitch label="Alertes par e-mail" /><ToggleSwitch label="Promotions et actualités" /></div>;
      case 'payment':
        return <PaymentScreen />;
      case 'help':
        return <div className="p-4 text-gray-300 space-y-2"><h3>FAQ</h3><p>Q: Comment puis-je contacter un professionnel ?</p><p>R: Cliquez sur "Envoyer un message" sur leur profil.</p></div>;
      case 'terms':
        return <div className="p-4 text-gray-300 text-sm"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...</p></div>;
      case 'privacy':
        return <div className="p-4 text-gray-300 text-sm"><p>Votre vie privée est importante pour nous. ...</p></div>;
      default:
        return null;
    }
  };

  const getSubViewTitle = () => {
    switch (activeSubView) {
        case 'notifications': return 'Notifications';
        case 'payment': return 'Paiement & Facturation';
        case 'help': return 'Aide & Support';
        case 'terms': return "Conditions d'utilisation";
        case 'privacy': return 'Politique de confidentialité';
        default: return '';
    }
  }


  // --- RENDER LOGIC ---
  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  if (!isProfileComplete) {
    return <InitialSetupScreen />;
  }

  const renderContent = () => {
    if (activeSubView) {
        return <SubViewScreen title={getSubViewTitle()} onBack={handleBack}>{renderSubViewContent()}</SubViewScreen>
    }

    if (activeChatThreadId) {
      const thread = messages.find(t => t.id === activeChatThreadId);
      const otherUser = users.find(u => u.id === thread?.participantId);
      if (thread && otherUser) {
        return <ChatView thread={thread} otherUser={otherUser} onBack={handleBack} />;
      }
    }

    if (viewingUser) {
        return <ProfileDetail user={viewingUser} onBack={handleBack} />;
    }

    switch (activeTab) {
      case 'discover':
        return (
          <div className="flex flex-col h-full">
            <header className="p-4 flex justify-between items-center border-b border-gray-800/50 flex-shrink-0">
                <h1 className="text-xl font-bold text-white" data-tour="app-logo">Découvrir</h1>
                <button
                    data-tour="view-switcher"
                    onClick={() => setDiscoverView(v => v === 'grid' ? 'map' : 'grid')}
                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-cyan-400 transition-colors"
                    aria-label={discoverView === 'grid' ? 'Afficher la carte' : 'Afficher la grille'}
                >
                    <Icon name={discoverView === 'grid' ? 'map' : 'grid'} className="w-6 h-6" />
                </button>
            </header>
            <div className="flex-1">
                {discoverView === 'grid' ? (
                     users.filter(u => u.id !== currentUser.id).length > 0 ? (
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24 md:pb-4">
                            {users.filter(u => u.id !== currentUser.id).map((user) => (
                                <UserProfileCard key={user.id} user={user} onSelect={viewProfile} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
                            <Icon name="compass" className="w-16 h-16 text-gray-600 mb-4" />
                            <h2 className="text-xl font-semibold text-white">Prêt à découvrir ?</h2>
                            <p className="mt-2 max-w-xs">Aucun autre professionnel n'est encore inscrit. Soyez le premier à vous faire remarquer !</p>
                        </div>
                    )
                ) : (
                    <MapView />
                )}
            </div>
          </div>
        );
       case 'favorites':
        return <FavoritesView />;
       case 'messages':
        return <MessagesView />;
       case 'bookings':
        return <BookingsView />;
       case 'profile':
        return <ProfileView />;
      default:
        return (
            <div className="flex items-center justify-center h-full text-gray-500 p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
                    <p className="mt-2">Cette fonctionnalité sera bientôt disponible !</p>
                </div>
            </div>
        )
    }
  };

  return (
    <>
      <style>{`
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .tour-highlight-active {
          position: relative;
          z-index: 11000;
        }
      `}</style>
      
      <Layout>
        {renderContent()}
      </Layout>

      {isEditingProfile && <EditProfileScreen />}
      {isQuizNotificationVisible && !isQuizOpen && (
          <QuizNotificationPopup onStartQuiz={() => { setQuizNotificationVisible(false); setQuizOpen(true); }} onClose={() => setQuizNotificationVisible(false)} />
      )}
      {isQuizOpen && <QuizModal onClose={() => setQuizOpen(false)} />}
      {bookingUser && <BookingModal user={bookingUser} />}
      {isOnboardingOpen && <OnboardingModal />}
      {reviewingBooking && <ReviewModal booking={reviewingBooking} />}
      {isTourActive && <GuidedTour onClose={closeTour} />}
    </>
  );
};

export default App;