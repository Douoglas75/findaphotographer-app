export enum UserType {
  Model = 'Modèle',
  Photographer = 'Photographe',
  Videographer = 'Vidéaste',
}

/**
 * Représente un avis laissé par un utilisateur.
 */
export interface Review {
  id: number;
  authorId: number;
  rating: number;
  comment: string;
  timestamp: string;
}

/**
 * Représente un élément du portfolio, qui peut être une image ou une vidéo.
 */
export interface PortfolioItem {
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string; // Pour les vidéos
}

/**
 * Représente un utilisateur de l'application.
 */
export interface User {
  id: number;
  name: string;
  type: UserType;
  avatarUrl: string;
  location: {
    lat: number;
    lng: number;
  };
  headline: string;
  rating: number; // Note de base, la moyenne sera calculée à partir des avis
  portfolio: PortfolioItem[];
  bio: string;
  rate: number;
  isPro?: boolean;
  isPremium?: boolean;
  reviews?: Review[];
  socialLinks?: {
    website?: string;
    instagram?: string;
  };
  age?: number;
  email?: string;
}

/**
 * Représente une question du quiz de photographie.
 */
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

/**
 * Représente un message unique dans une conversation de chat.
 */
export interface ChatMessage {
  id: number;
  senderId: number; // 100 for CURRENT_USER
  text: string;
  timestamp: string;
}

/**
 * Représente une conversation complète entre deux utilisateurs.
 */
export interface MessageThread {
  id: number;
  participantId: number;
  messages: ChatMessage[];
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

/**
 * Représente une réservation effectuée sur la plateforme.
 */
export interface Booking {
    id: number;
    professionalId: number;
    date: string;
    time: string;
    status: 'Confirmé' | 'Terminée';
    reviewSubmitted?: boolean;
}

/**
 * Représente une suggestion de collaboration générée par l'IA.
 */
export interface AISuggestion {
  userId: number;
  justification: string;
}

/**
 * Représente une méthode de paiement enregistrée par l'utilisateur.
 */
export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard';
  last4: string;
  expiry: string;
  isDefault?: boolean;
}

/**
 * Représente une transaction financière sur la plateforme.
 */
export interface Transaction {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: 'expense' | 'income';
}