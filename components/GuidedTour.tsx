import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import Icon from './Icon';

interface GuidedTourProps {
  onClose: () => void;
}

const tourSteps = [
  {
    selector: '[data-tour="app-logo"]',
    title: "Bienvenue sur Findaphotographer !",
    content: "Suivez cette courte visite pour découvrir les fonctionnalités principales de l'application.",
  },
  {
    selector: '[data-tour="view-switcher"]',
    title: "Changez de vue",
    content: "Basculez entre la vue carte pour localiser les pros et la vue grille pour parcourir les profils.",
  },
  {
    selector: '[data-tour="discover-tab"]',
    title: "Découvrir",
    content: "C'est ici que vous êtes ! Explorez et trouvez de nouveaux talents.",
  },
  {
    selector: '[data-tour="favorites-tab"]',
    title: "Favoris",
    content: "Retrouvez ici tous les profils que vous avez ajoutés en favoris pour un accès rapide.",
  },
  {
    selector: '[data-tour="messages-tab"]',
    title: "Messages",
    content: "Gérez toutes vos conversations et collaborations depuis cet onglet.",
  },
  {
    selector: '[data-tour="profile-tab"]',
    title: "Profil",
    content: "Consultez et modifiez votre profil public, vos photos et vos paramètres ici.",
  },
  {
    title: "Prêt à explorer ?",
    content: "Vous avez toutes les clés en main. Bonne découverte et créez des collaborations incroyables !",
  },
];

const GuidedTour: React.FC<GuidedTourProps> = ({ onClose }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const currentStep = tourSteps[stepIndex];
  const lastActiveElementRef = React.useRef<HTMLElement | null>(null);

  const updatePosition = useCallback(() => {
    const { selector } = currentStep;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (selector) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        const parentContainer = element.closest('nav, header') as HTMLElement | null;
        const highlightTarget = parentContainer || element;
        const targetRect = highlightTarget.getBoundingClientRect();
        
        highlightTarget.classList.add('tour-highlight-active');
        lastActiveElementRef.current = highlightTarget;

        setHighlightStyle({
          width: targetRect.width + 12,
          height: targetRect.height + 12,
          top: targetRect.top - 6,
          left: targetRect.left - 6,
          opacity: 1,
        });

        const tooltipWidth = 300;
        const tooltipHeight = 180; // Adjusted for content and buttons
        
        let top;
        // Si la cible est dans la moitié inférieure de l'écran, placer la bulle au-dessus
        if (targetRect.top + (targetRect.height / 2) > screenHeight / 2) {
          top = targetRect.top - tooltipHeight - 15;
        } else {
          // Sinon, la placer en dessous
          top = targetRect.bottom + 15;
        }

        let left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        if (left < 10) left = 10;
        if (left + tooltipWidth > screenWidth - 10) {
          left = screenWidth - tooltipWidth - 10;
        }

        setTooltipStyle({ top: `${top}px`, left: `${left}px`, opacity: 1, transform: 'none' });

      }
    } else {
      setHighlightStyle({ opacity: 0, width: 0, height: 0 });
      setTooltipStyle({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 1 });
      if (lastActiveElementRef.current) {
         lastActiveElementRef.current.classList.remove('tour-highlight-active');
         lastActiveElementRef.current = null;
      }
    }
  }, [currentStep]);

  useLayoutEffect(() => {
    if (lastActiveElementRef.current) {
        lastActiveElementRef.current.classList.remove('tour-highlight-active');
        lastActiveElementRef.current = null;
    }
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition]);
  
   useEffect(() => {
    return () => {
        if(lastActiveElementRef.current) {
            lastActiveElementRef.current.classList.remove('tour-highlight-active');
        }
    };
   }, []);


  const handleNext = () => {
    if (stepIndex < tourSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const isLastStep = stepIndex === tourSteps.length - 1;

  return (
    <div className="absolute inset-0 z-[10000] animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div
        className="absolute border-2 border-cyan-400 rounded-lg shadow-2xl shadow-cyan-500/50 transition-all pointer-events-none"
        style={highlightStyle}
      ></div>
      <div
        className="absolute w-[300px] bg-gray-800 rounded-lg shadow-xl p-5 transition-all text-center"
        style={tooltipStyle}
      >
        <h3 className="font-bold text-lg text-cyan-400 mb-2">{currentStep.title}</h3>
        <p className="text-sm text-gray-300 mb-5">{currentStep.content}</p>
        <div className="flex justify-between items-center">
          <button onClick={onClose} className="text-xs text-gray-400 hover:text-white">Passer la visite</button>
          <div className="flex items-center gap-3">
             {stepIndex > 0 && !isLastStep && <button onClick={handlePrev} className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md transition-colors">Précédent</button>}
             <button
               onClick={handleNext}
               className="text-sm bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-4 py-2 rounded-md transition-colors"
             >
              {isLastStep ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedTour;