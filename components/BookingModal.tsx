import React, { useState } from 'react';
import type { User } from '../types';
import Icon from './Icon';
import { useAppContext } from '../contexts/AppContext';
import { useUser } from '../contexts/UserContext';

interface BookingModalProps {
  user: User;
}

type BookingStep = 'date' | 'time' | 'payment' | 'confirmed';

const timeSlots = [
    { id: 'morning', label: 'Matin', time: '09:00 - 12:00', duration: 3 },
    { id: 'afternoon', label: 'Après-midi', time: '14:00 - 17:00', duration: 3 },
    { id: 'evening', label: 'Soirée', time: '18:00 - 20:00', duration: 2 },
];

const BookingModal: React.FC<BookingModalProps> = ({ user }) => {
  const [step, setStep] = useState<BookingStep>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<(typeof timeSlots)[0]>(timeSlots[0]);
  const { setBookingUser } = useAppContext();
  const { confirmBooking } = useUser();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setStep('time');
  };
  
  const handleTimeSelect = (slot: (typeof timeSlots)[0]) => {
    setSelectedTimeSlot(slot);
    setStep('payment');
  };

  const handlePaymentConfirm = () => {
    if (selectedDate && selectedTimeSlot) {
      confirmBooking({
        professionalId: user.id,
        date: selectedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: selectedTimeSlot.time,
      });
      setStep('confirmed');
    }
  };
  
  const onClose = () => setBookingUser(null);

  const renderContent = () => {
    switch (step) {
      case 'date':
        // Pour la simplicité, nous allons juste afficher un bouton pour confirmer la date d'aujourd'hui
        return (
          <div className="p-6 text-center">
            <Icon name="calendarDays" className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Quand souhaitez-vous réserver ?</h3>
            <p className="text-gray-400 mb-6">Sélectionnez une date pour le shooting.</p>
            <p className="text-2xl font-semibold bg-gray-700/50 py-3 rounded-lg mb-6">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <button onClick={() => handleDateSelect(new Date())} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg">
              Confirmer cette date
            </button>
          </div>
        );
      case 'time':
        return (
          <div className="p-6">
            <button onClick={() => setStep('date')} className="text-sm text-cyan-400 mb-4">&larr; Changer la date</button>
            <h3 className="text-xl font-bold mb-4 text-center">Choisissez un créneau horaire</h3>
            <div className="space-y-3">
                {timeSlots.map(slot => (
                    <button key={slot.id} onClick={() => handleTimeSelect(slot)} className="w-full text-left p-4 rounded-lg bg-gray-700/50 hover:bg-cyan-600/50 flex justify-between items-center">
                       <div>
                         <p className="font-semibold">{slot.label}</p>
                         <p className="text-sm text-gray-300">{slot.time}</p>
                       </div>
                       <p className="font-bold text-lg">${user.rate * slot.duration}</p>
                    </button>
                ))}
            </div>
          </div>
        );
      case 'payment':
        const prestationTotal = user.rate * selectedTimeSlot.duration;
        const commissionRate = user.isPremium ? 0.08 : (user.isPro ? 0.15 : 0.20);
        const serviceFee = prestationTotal * commissionRate;
        const netGain = prestationTotal - serviceFee;

        return (
          <div className="p-6">
            <button onClick={() => setStep('time')} className="text-sm text-cyan-400 mb-4">&larr; Changer le créneau</button>
            <h3 className="text-xl font-bold mb-4">Récapitulatif & Paiement</h3>
            <div className="bg-gray-800/60 p-4 rounded-lg mb-6 border border-gray-700 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Prestation</span>
                    <span className="font-semibold">${prestationTotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-gray-300">Frais de service ({commissionRate * 100}%)</span>
                    <span className="font-semibold text-red-400">-${serviceFee.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between items-center text-green-400 pt-2 border-t border-gray-700">
                    <span className="font-semibold">Gain estimé pour {user.name}</span>
                    <span className="font-bold">${netGain.toFixed(2)}</span>
                </div>
            </div>
            
            <div className="space-y-3">
                <input type="text" placeholder="Numéro de carte" className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 outline-none" />
                <div className="flex gap-3">
                    <input type="text" placeholder="MM/AA" className="w-1/2 bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 outline-none" />
                    <input type="text" placeholder="CVC" className="w-1/2 bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 outline-none" />
                </div>
            </div>

            <button onClick={handlePaymentConfirm} className="w-full mt-6 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg">
              Envoyer la Demande (${prestationTotal.toFixed(2)})
            </button>
          </div>
        );
      case 'confirmed':
        return (
            <div className="p-8 text-center">
                 <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="check" className="w-10 h-10 text-green-400" />
                 </div>
                 <h3 className="text-2xl font-bold text-white">Réservation envoyée !</h3>
                 <p className="text-gray-300 mt-2">Votre demande a été envoyée à {user.name}. Vous recevrez une notification dès qu'elle sera confirmée.</p>
                 <button onClick={onClose} className="w-full mt-8 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg">
                    Terminé
                </button>
            </div>
        )
    }
  };

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl shadow-purple-500/10 animate-scale-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">Réserver {user.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <Icon name="close" />
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default BookingModal;