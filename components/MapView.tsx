import React, { useEffect, useRef, memo, useState } from 'react';
import type { User } from '../types';
import { UserType } from '../types';
import Icon from './Icon';
import { useUser } from '../contexts/UserContext';
import { useAppContext } from '../contexts/AppContext';

// Déclare la variable globale 'L' de Leaflet provenant du script CDN
declare var L: any;

const MapView: React.FC = () => {
  const { users, currentUser } = useUser();
  const { viewProfile } = useAppContext();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: number]: any }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<UserType | 'All'>('All');

  // Effet pour initialiser la carte et les marqueurs
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) {
      return;
    }

    let map: any;

    const initializeMap = (center: [number, number], zoom: number) => {
      map = L.map(mapContainerRef.current!).setView(center, zoom);
      mapInstanceRef.current = map;

      map.zoomControl.setPosition('topright');

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);
      
      const RecenterControl = L.Control.extend({
          onAdd: function(map: any) {
              const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-recenter');
              container.innerHTML = `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v8m-4-4h8m8 0a10 10 0 11-20 0 10 10 0 0120 0z"></path></svg>`;
              container.title = "Recentrer sur ma position";

              L.DomEvent.disableClickPropagation(container);
              L.DomEvent.on(container, 'click', () => {
                  map.locate({setView: true, maxZoom: 14});
              });
              
              return container;
          }
      });
      new RecenterControl({ position: 'topright' }).addTo(map);

      map.on('locationerror', (e: any) => {
          console.error("Erreur de géolocalisation:", e.message);
          alert("Impossible de récupérer votre position. Veuillez vérifier les autorisations de votre navigateur.");
      });

      // Créer et stocker tous les marqueurs
      users.forEach(user => {
        if(user.id === currentUser.id) return;

        const typeClassName = `type-${user.type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;

        const icon = L.divIcon({
          html: `<img src="${user.avatarUrl}" class="marker-image" />`,
          className: `leaflet-custom-icon ${typeClassName}`,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });

        const marker = L.marker([user.location.lat, user.location.lng], { icon });
        marker.bindPopup(`<b>${user.name}</b>`);
        marker.on('click', () => {
            map.setView([user.location.lat, user.location.lng], 15);
            setTimeout(() => viewProfile(user), 300);
        });
        markersRef.current[user.id] = marker;
      });
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        initializeMap([latitude, longitude], 14);

        // Ajoute un marqueur spécial pour l'utilisateur actuel
        const currentUserIcon = L.divIcon({
          html: `<div style="width: 50px; height: 50px; position: relative;">
                   <div style="animation: pulse 2s infinite; background: #c084fc; width: 100%; height: 100%; border-radius: 50%;"></div>
                   <img src="${currentUser.avatarUrl}" style="position: absolute; top: 3px; left: 3px; width: 44px; height: 44px; border-radius: 50%; border: 3px solid #f0f0f0;" />
                 </div>
                 <style>@keyframes pulse { 0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(192, 132, 252, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(192, 132, 252, 0); } 100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(192, 132, 252, 0); } }</style>`,
          className: 'leaflet-custom-icon-current',
          iconSize: [50, 50],
          iconAnchor: [25, 25],
        });
        L.marker([latitude, longitude], { icon: currentUserIcon, zIndexOffset: 1000 })
          .addTo(mapInstanceRef.current)
          .bindPopup("<b>Vous êtes ici</b>");
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error.message);
        initializeMap([48.8566, 2.3522], 13);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effet pour filtrer les marqueurs en fonction de la recherche et du filtre de type
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const lowerCaseQuery = searchQuery.toLowerCase();

    users.forEach(user => {
      if (user.id === currentUser.id) return;
      
      const marker = markersRef.current[user.id];
      if (!marker) return;

      const typeMatch = activeFilter === 'All' || user.type === activeFilter;
      const searchMatch = user.name.toLowerCase().includes(lowerCaseQuery) ||
                          user.headline.toLowerCase().includes(lowerCaseQuery);

      if (typeMatch && searchMatch) {
        if (!map.hasLayer(marker)) {
          marker.addTo(map);
        }
      } else {
        if (map.hasLayer(marker)) {
          marker.remove();
        }
      }
    });
  }, [searchQuery, users, activeFilter, currentUser.id]);


  const FilterButton: React.FC<{ filter: UserType | 'All', label: string }> = ({ filter, label }) => {
    const isActive = activeFilter === filter;
    return (
        <button
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${
                isActive
                    ? 'bg-cyan-500 text-white shadow'
                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80'
            }`}
        >
            {label}
        </button>
    )
  }

  return (
    <div className="relative w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full bg-gray-200" id="map"></div>
        <div className="absolute top-0 left-0 right-0 p-4 z-[1000] flex flex-col gap-3">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="search" className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Rechercher un pro (nom, spécialité...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900/70 backdrop-blur-md text-white border border-gray-600 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <FilterButton filter="All" label="Tous" />
                {Object.values(UserType).map(type => (
                    <FilterButton key={type} filter={type} label={`${type}s`} />
                ))}
            </div>
        </div>
    </div>
  );
};

export default memo(MapView);