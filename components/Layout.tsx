import React from 'react';
import Logo from './Logo';
import Icon from './Icon';
import { type IconName } from '../constants';
import { useAppContext, ActiveTab } from '../contexts/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const SideNavItem: React.FC<{ tab: ActiveTab; icon: IconName; label: string; tourId?: string; }> = ({ tab, icon, label, tourId }) => {
    const { activeTab, viewingUser, activeChatThreadId, activeSubView, selectTab } = useAppContext();
    const isActive = activeTab === tab && !viewingUser && !activeChatThreadId && !activeSubView;
    return (
      <button
        data-tour={tourId}
        onClick={() => selectTab(tab)}
        className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg duration-200 ${isActive ? 'bg-cyan-500/10 text-cyan-300' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon name={icon} className="w-6 h-6" />
        <span className="font-semibold">{label}</span>
      </button>
    );
};
  
const BottomNavItem: React.FC<{ tab: ActiveTab; icon: IconName; label: string; tourId?: string; }> = ({ tab, icon, label, tourId }) => {
    const { activeTab, viewingUser, activeChatThreadId, activeSubView, selectTab } = useAppContext();
    const isActive = activeTab === tab && !viewingUser && !activeChatThreadId && !activeSubView;
    return (
      <button
        data-tour={tourId}
        onClick={() => selectTab(tab)}
        className="flex flex-col items-center justify-center gap-1 w-full h-full pt-2 pb-1 group focus:outline-none relative"
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon name={icon} className={`w-6 h-6 duration-200 ${isActive ? 'text-cyan-400 -translate-y-1' : 'text-gray-400 group-hover:text-gray-300'}`} />
        <span className={`text-xs font-medium duration-200 ${isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-gray-300'}`}>{label}</span>
        {isActive && <div className="absolute bottom-1 w-2 h-2 rounded-full bg-cyan-400"></div>}
      </button>
    );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { activeTab, viewingUser, activeChatThreadId, activeSubView } = useAppContext();
    const showNavBar = !viewingUser && !activeChatThreadId && !activeSubView;

    return (
        <div id="app-container" className="h-full bg-gray-950 text-white md:grid md:grid-cols-[240px_1fr]">
            {/* Side Navigation for Medium screens and up */}
            <aside className="h-full bg-gray-900 flex-col p-4 border-r border-gray-800/50 hidden md:flex">
                <div className="mb-8 pl-2">
                    <Logo className="h-8" />
                </div>
                <nav className="flex flex-col gap-2">
                    <SideNavItem tab="discover" icon="search" label="Découvrir" tourId="discover-tab" />
                    <SideNavItem tab="favorites" icon="heart" label="Favoris" tourId="favorites-tab" />
                    <SideNavItem tab="messages" icon="message" label="Messages" tourId="messages-tab" />
                    <SideNavItem tab="bookings" icon="calendar" label="Réservations" tourId="bookings-tab" />
                    <SideNavItem tab="profile" icon="user" label="Profil" tourId="profile-tab" />
                </nav>
            </aside>

            {/* Main content area */}
            <div className="h-full flex flex-col relative">
                {/* Main grows to fill available space and acts as a positioning context for its child. */}
                <main className="flex-1 relative">
                    {/* This child div now fills its parent (`main`) completely and handles its own scrolling. */}
                    {/* This ensures that children needing a defined height (like the map) get one, while long content can still scroll. */}
                    <div key={activeTab} className="absolute inset-0 overflow-y-auto animate-fade-in-fast">
                        {children}
                    </div>
                </main>
                
                {/* Bottom Navigation for Small screens */}
                {showNavBar && (
                    <nav className="absolute bottom-0 left-0 right-0 bg-gray-900/70 backdrop-blur-md border-t border-gray-700/50 grid grid-cols-5 items-center gap-1 px-1 z-[1000] md:hidden mobile-bottom-nav">
                        <BottomNavItem tab="discover" icon="search" label="Découvrir" tourId="discover-tab" />
                        <BottomNavItem tab="favorites" icon="heart" label="Favoris" tourId="favorites-tab" />
                        <BottomNavItem tab="messages" icon="message" label="Messages" tourId="messages-tab" />
                        <BottomNavItem tab="bookings" icon="calendar" label="Réservations" />
                        <BottomNavItem tab="profile" icon="user" label="Profil" tourId="profile-tab" />
                    </nav>
                )}
            </div>
        </div>
    );
};

export default Layout;