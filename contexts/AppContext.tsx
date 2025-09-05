import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import type { User, Booking } from '../types';

export type ActiveTab = 'discover' | 'favorites' | 'messages' | 'bookings' | 'profile';
type DiscoverView = 'grid' | 'map';

interface AppContextType {
  // View State
  activeTab: ActiveTab;
  discoverView: DiscoverView;
  viewingUser: User | null;
  activeChatThreadId: number | null;
  activeSubView: string | null;
  
  // Modal State
  isQuizOpen: boolean;
  bookingUser: User | null;
  isOnboardingOpen: boolean;
  reviewingBooking: Booking | null;
  isEditingProfile: boolean;
  isTourActive: boolean;

  // View Setters
  setActiveTab: (tab: ActiveTab) => void;
  setDiscoverView: React.Dispatch<React.SetStateAction<DiscoverView>>;
  setViewingUser: React.Dispatch<React.SetStateAction<User | null>>;
  setActiveChatThreadId: React.Dispatch<React.SetStateAction<number | null>>;
  setActiveSubView: React.Dispatch<React.SetStateAction<string | null>>;

  // Modal Setters
  setQuizOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setBookingUser: React.Dispatch<React.SetStateAction<User | null>>;
  setOnboardingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setReviewingBooking: React.Dispatch<React.SetStateAction<Booking | null>>;
  setEditingProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setTourActive: React.Dispatch<React.SetStateAction<boolean>>;

  // Combined Actions
  handleBack: () => void;
  selectTab: (tab: ActiveTab) => void;
  selectThread: (threadId: number) => void;
  viewProfile: (user: User) => void;
  closeTour: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('discover');
  const [discoverView, setDiscoverView] = useState<DiscoverView>('map');
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [activeChatThreadId, setActiveChatThreadId] = useState<number | null>(null);
  const [activeSubView, setActiveSubView] = useState<string | null>(null);
  
  const [isQuizOpen, setQuizOpen] = useState(false);
  const [bookingUser, setBookingUser] = useState<User | null>(null);
  const [isOnboardingOpen, setOnboardingOpen] = useState(false);
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [isEditingProfile, setEditingProfile] = useState(false);
  const [isTourActive, setTourActive] = useState(false);

  const handleBack = useCallback(() => {
    setViewingUser(null);
    setActiveChatThreadId(null);
    setActiveSubView(null);
  }, []);

  const selectTab = useCallback((tab: ActiveTab) => {
    handleBack();
    setActiveTab(tab);
  }, [handleBack]);

  const selectThread = useCallback((threadId: number) => {
    setActiveChatThreadId(threadId);
    setViewingUser(null);
    setActiveTab('messages');
  }, []);

  const viewProfile = useCallback((user: User) => {
    setViewingUser(user);
    setActiveChatThreadId(null);
  }, []);
  
  const closeTour = useCallback(() => {
    setTourActive(false);
    localStorage.setItem('hasViewedTour', 'true');
  }, []);

  const contextValue = useMemo(() => ({
      activeTab, setActiveTab,
      discoverView, setDiscoverView,
      viewingUser, setViewingUser,
      activeChatThreadId, setActiveChatThreadId,
      activeSubView, setActiveSubView,
      isQuizOpen, setQuizOpen,
      bookingUser, setBookingUser,
      isOnboardingOpen, setOnboardingOpen,
      reviewingBooking, setReviewingBooking,
      isEditingProfile, setEditingProfile,
      isTourActive, setTourActive,
      handleBack,
      selectTab,
      selectThread,
      viewProfile,
      closeTour,
  }), [
      activeTab, discoverView, viewingUser, activeChatThreadId, activeSubView,
      isQuizOpen, bookingUser, isOnboardingOpen, reviewingBooking, isEditingProfile,
      isTourActive, handleBack, selectTab, selectThread, viewProfile, closeTour
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};