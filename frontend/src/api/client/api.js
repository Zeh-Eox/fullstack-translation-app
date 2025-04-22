import axios from 'axios';
import useAuthStore from '../../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://0.0.0.0:8000/api'; // Docker local server

const HTTP_CLIENT = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Intercepteur pour ajouter le token aux requêtes
HTTP_CLIENT.interceptors.request.use(
    (config) => {
        const { token } = useAuthStore.getState();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs
HTTP_CLIENT.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Si le token est invalide ou expiré, déconnecter l'utilisateur
                    const { logout } = useAuthStore.getState();
                    logout();
                    window.location.href = '/login?session=expired';
                    break;
                case 403:
                    // Gestion des erreurs d'autorisation
                    console.error('Accès non autorisé');
                    break;
                case 404:
                    // Gestion des ressources non trouvées
                    console.error('Ressource non trouvée');
                    break;
                case 500:
                    // Gestion des erreurs serveur
                    console.error('Erreur serveur');
                    break;
                default:
                    console.error('Erreur inattendue:', error.response.status);
            }
        }
        return Promise.reject(error);
    }
);

export default HTTP_CLIENT;
