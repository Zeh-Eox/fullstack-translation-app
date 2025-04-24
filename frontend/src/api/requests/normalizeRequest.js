// Fonction d'assistance pour normaliser les réponses
const normalizeResponse = (response) => {
    // Si la réponse contient status_code ou success
    if (response.data.status_code === 200 || response.data.success === true) {
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.status_message || "Opération réussie"
      };
    }
    // Si la réponse contient une erreur
    return {
      success: false,
      error: {
        message: response.data.status_message || "Une erreur est survenue"
      }
    };
};
  
// Fonction d'assistance pour gérer les erreurs
const handleApiError = (error) => {
    console.error("API Error:", error);
    return {
      success: false,
      error: {
        message: error.response?.data?.status_message || error.message || "Une erreur est survenue"
      }
    };
};

export default {
    normalizeResponse,
    handleApiError
};