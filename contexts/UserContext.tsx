import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import { MOCK_USERS, MOCK_MESSAGES, MOCK_BOOKINGS, CURRENT_USER } from '../constants';
import type { User, Booking, MessageThread, Review, UserType } from '../types';

interface UserContextType {
  // State
  isLoggedIn: boolean;
  isProfileComplete: boolean;
  users: User[];
  messages: MessageThread[];
  bookings: Booking[];
  currentUser: User;

  // Actions
  login: () => void;
  logout: () => void;
  completeInitialSetup: (data: { name: string; type: UserType }) => { startTour: boolean };
  updateCurrentUser: (updatedData: Partial<User>) => void;
  saveProfile: (updatedUser: User) => void;
  startChat: (userId: number) => number;
  confirmBooking: (bookingDetails: { professionalId: number; date: string; time: string; }) => void;
  completeProOnboarding: () => void;
  postReview: (booking: Booking, review: { rating: number; comment: string }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('isLoggedIn'));
  const [isProfileComplete, setProfileComplete] = useState(() => !!localStorage.getItem('isProfileComplete'));
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [messages, setMessages] = useState<MessageThread[]>(MOCK_MESSAGES);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : CURRENT_USER;
    } catch (error) {
      return CURRENT_USER;
    }
  });

  const login = useCallback(() => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  }, []);
  
  const logout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isProfileComplete');
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setProfileComplete(false);
    setCurrentUser(CURRENT_USER);
    setMessages(MOCK_MESSAGES);
    setBookings(MOCK_BOOKINGS);
  }, []);

  const completeInitialSetup = useCallback((data: { name: string; type: UserType }) => {
    const newUser = {
      ...CURRENT_USER,
      name: data.name,
      type: data.type,
      bio: "Modifiez votre profil pour ajouter une biographie et attirer des collaborations !",
      headline: `Nouveau ${data.type} sur la plateforme !`
    };
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setCurrentUser(newUser);
    localStorage.setItem('isProfileComplete', 'true');
    setProfileComplete(true);
    
    const hasSeenTour = localStorage.getItem('hasViewedTour');
    return { startTour: !hasSeenTour };
  }, []);

  const updateCurrentUser = useCallback((updatedData: Partial<User>) => {
      const newUserData = { ...currentUser, ...updatedData };
      localStorage.setItem('currentUser', JSON.stringify(newUserData));
      setCurrentUser(newUserData);
  }, [currentUser]);

  const saveProfile = useCallback((updatedUser: User) => {
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  }, []);

  const startChat = useCallback((userId: number) => {
    const existingThread = messages.find(t => t.participantId === userId);
    if (existingThread) {
      return existingThread.id;
    } else {
      const newThread: MessageThread = {
        id: Date.now(),
        participantId: userId,
        messages: [],
        lastMessage: "Démarrez la conversation !",
        timestamp: "À l'instant",
        unread: false,
      };
      setMessages(prev => [newThread, ...prev]);
      return newThread.id;
    }
  }, [messages]);

  const confirmBooking = useCallback((bookingDetails: { professionalId: number; date: string; time: string; }) => {
    const newBooking: Booking = { id: Date.now(), ...bookingDetails, status: 'Confirmé' };
    setBookings(prev => [newBooking, ...prev]);
  }, []);

  const completeProOnboarding = useCallback(() => {
    updateCurrentUser({ isPro: true });
  }, [updateCurrentUser]);

  const postReview = useCallback((booking: Booking, review: { rating: number; comment: string }) => {
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === booking.professionalId) {
        const newReview: Review = {
          id: Date.now(),
          authorId: currentUser.id,
          rating: review.rating,
          comment: review.comment,
          timestamp: new Date().toISOString()
        };
        return { ...u, reviews: [...(u.reviews || []), newReview] };
      }
      return u;
    }));
    setBookings(prevBookings => prevBookings.map(b =>
      b.id === booking.id ? { ...b, reviewSubmitted: true } : b
    ));
  }, [currentUser.id]);

  const contextValue = useMemo(() => ({
      isLoggedIn,
      isProfileComplete,
      users,
      messages,
      bookings,
      currentUser,
      login,
      logout,
      completeInitialSetup,
      updateCurrentUser,
      saveProfile,
      startChat,
      confirmBooking,
      completeProOnboarding,
      postReview,
  }), [
      isLoggedIn, isProfileComplete, users, messages, bookings, currentUser,
      login, logout, completeInitialSetup, updateCurrentUser, saveProfile,
      startChat, confirmBooking, completeProOnboarding, postReview
  ]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};