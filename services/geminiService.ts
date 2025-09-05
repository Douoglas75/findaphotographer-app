import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion, UserType, User, AISuggestion } from '../types';

// Fix: Adhering to the coding guidelines to use process.env.API_KEY for the API key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Génère 10 questions uniques à choix multiples sur les techniques et l'histoire de la photographie, en français. Propose 4 options pour chaque question. Indique l'index de la bonne réponse.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              description: "A list of 10 photography quiz questions.",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: {
                    type: Type.STRING,
                    description: "The question text."
                  },
                  options: {
                    type: Type.ARRAY,
                    description: "An array of 4 possible answers.",
                    items: {
                      type: Type.STRING
                    }
                  },
                  correctAnswerIndex: {
                    type: Type.INTEGER,
                    description: "The 0-based index of the correct answer in the options array."
                  }
                },
                required: ["question", "options", "correctAnswerIndex"]
              }
            }
          },
          required: ["questions"]
        },
      },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);

    if (parsed.questions && Array.isArray(parsed.questions)) {
       // A quick validation to ensure the data structure is as expected.
       return parsed.questions.filter((q: any) => 
         typeof q.question === 'string' &&
         Array.isArray(q.options) && q.options.length === 4 &&
         typeof q.correctAnswerIndex === 'number' &&
         q.correctAnswerIndex >= 0 && q.correctAnswerIndex < 4
       );
    }
    
    console.error("Parsed JSON does not contain a 'questions' array:", parsed);
    return [];

  } catch (error) {
    console.error("Error generating quiz questions:", error);
    // Fallback to mock data in case of API error
    return [
        { question: "Que signifie ISO ?", options: ["Image Sensor Output", "Organisation internationale de normalisation", "Image Saturation Overlay", "Internal Shutter Operation"], correctAnswerIndex: 1 },
        { question: "Quel réglage d'ouverture laisse entrer le plus de lumière ?", options: ["f/1.8", "f/4", "f/8", "f/16"], correctAnswerIndex: 0 },
        { question: "Qu'est-ce que la 'Règle des Tiers' ?", options: ["Une stratégie de prix", "Une directive de composition", "Une méthode de nettoyage de lentille", "Un type de trépied"], correctAnswerIndex: 1 },
    ];
  }
};


export const generateChatSuggestion = async (currentUserType: UserType, targetUserType: UserType): Promise<string[]> => {
    try {
        const prompt = `Je suis un ${currentUserType} et je veux contacter un ${targetUserType} pour une collaboration. Suggère 3 messages d'introduction courts, professionnels et engageants en français. Retourne-les sous forme d'un tableau JSON de chaînes de caractères. Exemple: ["message 1", "message 2", "message 3"]`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
             config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            description: "A list of 3 chat suggestions.",
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["suggestions"]
                }
            }
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString);

        if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
            return parsed.suggestions;
        }

        console.error("Parsed JSON does not contain a 'suggestions' array:", parsed);
        return [];

    } catch (error) {
        console.error("Error generating chat suggestions:", error);
        return ["Bonjour, j'aime beaucoup votre travail ! Seriez-vous disponible pour une collaboration ?", "Salut ! Votre portfolio est impressionnant. Parlons d'un projet potentiel.", "Bonjour, je suis à la recherche d'un talent comme le vôtre. Intéressé(e) ?"];
    }
};

export const getAICollaborationSuggestions = async (currentUser: User, viewedUser: User, allUsers: User[]): Promise<AISuggestion[]> => {
    // Filter out the current and viewed user from the candidates
    const candidates = allUsers.filter(u => u.id !== currentUser.id && u.id !== viewedUser.id)
        .map(u => ({ id: u.id, type: u.type, headline: u.headline, bio: u.bio }));

    if (candidates.length === 0) {
        return [];
    }

    try {
        const prompt = `
            Contexte: Tu es un directeur artistique expert pour une plateforme de collaboration créative. Ta mission est de trouver les meilleures synergies entre professionnels.
            
            Utilisateur Actuel:
            - Type: ${currentUser.type}
            - Titre: ${currentUser.headline}
            - Bio: ${currentUser.bio}

            Profil Consulté:
            - Type: ${viewedUser.type}
            - Titre: ${viewedUser.headline}
            - Bio: ${viewedUser.bio}

            Liste de candidats potentiels (ID, type, titre, bio):
            ${JSON.stringify(candidates, null, 2)}

            Mission: En te basant sur une analyse créative des styles, personnalités et spécialités, sélectionne jusqu'à 2 candidats de la liste qui formeraient une collaboration exceptionnellement intéressante avec l'Utilisateur Actuel et le Profil Consulté. Pour chaque suggestion, fournis l'ID de l'utilisateur et une justification courte et percutante expliquant pourquoi la synergie créative serait excellente.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            description: "Liste de 1 ou 2 suggestions de collaboration.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    userId: { type: Type.INTEGER, description: "L'ID de l'utilisateur suggéré." },
                                    justification: { type: Type.STRING, description: "La raison créative de la suggestion." }
                                },
                                required: ["userId", "justification"]
                            }
                        }
                    },
                    required: ["suggestions"]
                }
            }
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString);

        if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
            return parsed.suggestions;
        }

        console.error("Parsed JSON does not contain a 'suggestions' array:", parsed);
        return [];

    } catch (error) {
        console.error("Error generating AI collaboration suggestions:", error);
        return []; // Return empty array on error, as this is a non-critical feature.
    }
};

export const generateProfileSuggestions = async (userType: UserType): Promise<{ headlines: string[], bio: string }> => {
  const fallback = {
    headlines: [
      `Créatif ${userType} passionné`,
      `${userType} avec un oeil pour le détail`,
      `Spécialiste en ${userType} lifestyle`,
    ],
    bio: `Passionné par l'art de la ${userType}, je cherche constamment à capturer des moments uniques et à raconter des histoires à travers mon objectif. Mon style est...`
  };

  try {
    const prompt = `Je suis un ${userType} qui crée mon profil sur une application de collaboration créative.
    Génère 3 titres de profil (headlines) courts et percutants (maximum 10 mots chacun).
    Génère également 1 suggestion de biographie (bio) engageante et professionnelle d'environ 50 mots.
    La biographie doit être inspirante et donner envie de collaborer.
    Le ton doit être créatif et professionnel. La langue doit être le français.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headlines: {
              type: Type.ARRAY,
              description: "Une liste de 3 titres de profil.",
              items: { type: Type.STRING }
            },
            bio: {
              type: Type.STRING,
              description: "Une suggestion de biographie."
            }
          },
          required: ["headlines", "bio"]
        }
      }
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);

    if (parsed.headlines && Array.isArray(parsed.headlines) && typeof parsed.bio === 'string') {
      return parsed;
    }

    console.error("Parsed JSON does not match expected schema:", parsed);
    return fallback;
  } catch (error) {
    console.error("Error generating profile suggestions:", error);
    return fallback;
  }
};