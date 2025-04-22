import HTTP_CLIENT from "../client/api";
import useAuthStore from '../../stores/authStore';

/**
 * Gestionnaire d'erreurs standardisé pour les requêtes d'authentification
 * @param {Error} error - L'erreur à traiter
 * @returns {Object} Objet contenant les détails de l'erreur formatés
 */
const handleError = (error) => {
  // Si nous avons une réponse du serveur avec des données
  if (error.response && error.response.data) {
    return {
      success: false,
      error: error.response.data,
      status: error.response.status
    };
  }

  // Si l'erreur est due à un timeout ou problème réseau
  if (error.code === 'ECONNABORTED' || !error.response) {
    return {
      success: false,
      error: {
        message: "La connexion au serveur a échoué. Veuillez vérifier votre connexion internet."
      },
      status: 0
    };
  }

  // Erreur par défaut
  return {
    success: false,
    error: {
      message: "Une erreur inattendue est survenue."
    },
    status: 500
  };
};

/**
 * Enregistre un nouvel utilisateur
 * @param {Object} userData - Données d'enregistrement (nom, email, mot de passe, etc.)
 * @returns {Promise<Object>} Résultat de la requête avec statut de succès
 */
export const registerRequest = async (userData) => {
  try {
    console.log('Données envoyées au serveur:', userData);
    const response = await HTTP_CLIENT.post('/users/register', userData);
    console.log('Réponse du serveur:', response);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erreur détaillée:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.'
      }
    };
  }
};

/**
 * Authentifie un utilisateur
 * @param {Object} credentials - Identifiants (email, mot de passe)
 * @returns {Promise<Object>} Résultat de la requête avec statut de succès et token
 */
export const loginRequest = async (credentials) => {
  try {
    console.log('Données de connexion envoyées:', credentials);
    const response = await HTTP_CLIENT.post('/users/login', credentials);
    console.log('Réponse de connexion:', response);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erreur de connexion détaillée:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Identifiants incorrects. Veuillez réessayer.'
      }
    };
  }
};

/**
 * Déconnecte l'utilisateur en supprimant les données de session
 * @returns {Object} Statut de l'opération
 */
export const logoutRequest = () => {
  try {
    const { logout } = useAuthStore.getState();
    logout();
    return {
      success: true,
      message: "Déconnexion réussie"
    };
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return {
      success: false,
      error: {
        message: "Erreur lors de la déconnexion"
      }
    };
  }
};

/**
 * Vérifie si l'utilisateur actuel est authentifié
 * @returns {Boolean} État d'authentification
 */
export const isAuthenticated = () => {
  const { isAuthenticated } = useAuthStore.getState();
  return isAuthenticated;
};

/**
 * Récupère les informations de l'utilisateur connecté
 * @returns {Object|null} Données utilisateur ou null si non connecté
 */
export const getCurrentUser = () => {
  const { user } = useAuthStore.getState();
  return user;
};
