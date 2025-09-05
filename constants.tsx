import { User, UserType, MessageThread, Booking, Review, PaymentMethod, Transaction } from './types';

export const CURRENT_USER: User = {
    id: 100,
    name: '', // Sera défini lors de la configuration initiale
    type: UserType.Photographer, // Défaut, sera écrasé par la config initiale
    avatarUrl: '', // L'utilisateur doit ajouter sa propre photo
    location: { lat: 48.8570, lng: 2.3550 },
    headline: '', // Défini lors de la modification du profil
    rating: 0,
    portfolio: [],
    bio: "", // Défini lors de la modification du profil
    rate: 100,
    isPro: false,
    isPremium: false,
    socialLinks: {
        website: '',
        instagram: '',
    },
    email: '',
    age: undefined,
};

export const MOCK_USERS: User[] = [];

export const MOCK_MESSAGES: MessageThread[] = [];

export const MOCK_BOOKINGS: Booking[] = [];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [];

export const MOCK_TRANSACTIONS: Transaction[] = [];


export const ICONS = {
    compass: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5V21" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12h-2.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M5.5 12H3" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.95 7.05l-1.768 1.768" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.818 15.182l-1.768 1.768" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.95 16.95l-1.768-1.768" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.818 8.818l-1.768-1.768" /></>,
    message: <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
    calendar: <><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></>,
    user: <><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></>,
    userCircle: <><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16.5c2.57 0 4.98.657 7.022 1.764M15.252 10.248a3.75 3.75 0 11-6.499-1.25M12 21a9 9 0 100-18 9 9 0 000 18z" /></>,
    plusCircle: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></>,
    close: <><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></>,
    gift: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.354l-6.364-6.364a5 5 0 017.07-7.071L12 6.586l-1.707-1.707a5 5 0 017.07-7.071L18.364 4.99A5.002 5.002 0 0112 18.354z" /></>,
    star: <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />,
    play: <path fill="currentColor" d="M8 5.13v13.74c0 .8.87 1.28 1.55.84l10.28-6.87a.99.99 0 000-1.68L9.55 4.29C8.87 3.85 8 4.32 8 5.13z" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
    xmark: <><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></>,
    map: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13V7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m-6 3l6-3m0 13l-6-3" /></>,
    grid: <><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></>,
    cog: <><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 5.625l-1.096-1.096M6.375 6.375L5.28 5.28m13.44 0l-1.096 1.096m-1.096 11.328l1.096 1.096M12 4.5V3m0 18v-1.5m5.625-1.5l1.096-1.096M6.375 17.625l-1.096-1.096" /></>,
    bell: <><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></>,
    creditCard: <><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3.375m-3.375 2.25h10.5m4.5-9.75a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5h13.5a1.5 1.5 0 011.5 1.5v1.5z" /></>,
    questionMarkCircle: <><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></>,
    logout: <><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></>,
    chevronRight: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />,
    search: <><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></>,
    locationMarker: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></>,
    heart: <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />,
    calendarDays: <><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008zm-3 0h.008v.008H9v-.008zm6 0h.008v.008h-6v-.008zm-3 3h.008v.008H9v-.008zm6 0h.008v.008h-6v-.008zm-3 3h.008v.008H9v-.008z" /></>,
    clock: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></>,
    shieldCheck: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></>,
    banknotes: <><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125-1.125h-15c-.621 0-1.125-.504-1.125-1.125v-9.75c0-.621.504-1.125 1.125-1.125h1.5" /></>,
    signature: <><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></>,
    penSquare: <><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125m-8.288 8.288L15 11.25m-2.122 2.122L11.25 15" /></>,
    sparkles: <><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18l-1.813-2.096a4.5 4.5 0 00-6.364-6.364L3 7.5l2.096-1.813a4.5 4.5 0 006.364 6.364zm10.187 0L15 18l2.096 1.813a4.5 4.5 0 006.364-6.364L21 7.5l-2.096 1.813a4.5 4.5 0 00-6.364 6.364zM12 3a1 1 0 00-1 1v2a1 1 0 102 0V4a1 1 0 00-1-1zm0 14a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1zM4.929 4.929a1 1 0 00-1.414 0l-1.414 1.414a1 1 0 001.414 1.414l1.414-1.414a1 1 0 000-1.414zm12.728 12.728a1 1 0 00-1.414 0l-1.414 1.414a1 1 0 001.414 1.414l1.414-1.414a1 1 0 000-1.414zM4.929 17.657a1 1 0 001.414 1.414l1.414-1.414a1 1 0 10-1.414-1.414l-1.414 1.414zm12.728-12.728a1 1 0 001.414 1.414l1.414-1.414a1 1 0 10-1.414-1.414l-1.414 1.414z" /></>,
    link: <><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></>,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></>,
    documentText: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></>,
    shieldExclamation: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></>,
    camera: <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039" />,
    visa: <><g fillRule="evenodd"><path d="M7.955 6.228L5.93 0H2.528l-2.45 11.23h3.107l.663-3.18L5.93 11.23h2.332l3.43-11.23H8.74L7.955 6.228z" fill="#00579F"/><path d="M14.47 0h-2.59L8.448 11.23h3.047l.58-2.583h2.89s.25 1.25.37 2.583h2.95L14.47 0zm-1.84 6.322c.23-1.04.8-3.55 1.01-4.5h.06c.2.95.77 3.46 1.01 4.5h-2.08z" fill="#F9A600"/></g></>,
    mastercard: <g><circle cx="7" cy="7" r="7" fill="#EA001B"/><circle cx="17" cy="7" r="7" fill="#F79E1B"/><path d="M12 7a7 7 0 0 1-5 6.7A7 7 0 0 0 12 7z" fill="#FF5F00"/></g>,
};

export type IconName = keyof typeof ICONS;