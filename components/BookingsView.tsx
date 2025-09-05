import React, { useState, memo } from 'react';
import type { Booking, User } from '../types';
import Icon from './Icon';
import { useUser } from '../contexts/UserContext';
import { useAppContext } from '../contexts/AppContext';

const BookingsView: React.FC = () => {
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming');
  const { bookings, users } = useUser();
  const { setReviewingBooking } = useAppContext();

  const findUser = (id: number) => users.find(u => u.id === id) || { name: 'Utilisateur inconnu', type: '', avatarUrl: '' };

  const upcomingBookings = bookings.filter(b => b.status === 'Confirmé');
  const pastBookings = bookings.filter(b => b.status === 'Terminée');
  const bookingsToShow = view === 'upcoming' ? upcomingBookings : pastBookings;

  const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
    const professional = findUser(booking.professionalId);
    const isPast = booking.status === 'Terminée';

    return (
      <div className={`bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col gap-4 ${isPast ? 'opacity-70' : ''}`}>
        <div className="flex gap-4">
            <img src={professional.avatarUrl} alt={professional.name} className="w-20 h-24 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm text-gray-400">{professional.type}</p>
              <h3 className="font-bold text-white text-lg">{professional.name}</h3>
              <p className="text-cyan-400 mt-1">{booking.date} &bull; {booking.time}</p>
              <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${isPast ? 'bg-gray-600 text-gray-300' : 'bg-green-500/20 text-green-300'}`}>
                {booking.status}
              </div>
            </div>
        </div>
        {isPast && !booking.reviewSubmitted && (
            <button 
                onClick={() => setReviewingBooking(booking)}
                className="w-full bg-purple-600/80 hover:bg-purple-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Icon name="penSquare" className="w-5 h-5"/>
                Laisser un avis
            </button>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full animate-fade-in">
      <header className="p-4 border-b border-gray-800/50 flex-shrink-0">
        <h1 className="text-xl font-bold text-white">Réservations</h1>
      </header>
      <div className="p-4">
        <div className="flex bg-gray-800/50 p-1 rounded-lg">
          <button 
            onClick={() => setView('upcoming')}
            className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${view === 'upcoming' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            À venir
          </button>
          <button 
            onClick={() => setView('past')}
            className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${view === 'past' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Passées
          </button>
        </div>
      </div>
      <div className="flex-1 px-4 pb-24 md:pb-4">
        <div className="space-y-4">
          {bookingsToShow.length > 0 ? (
             bookingsToShow.map(booking => <BookingCard key={booking.id} booking={booking} />)
          ) : (
            <div className="text-center py-12 text-gray-500">
                <p>Aucune réservation {view === 'upcoming' ? 'à venir' : 'passée'}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(BookingsView);