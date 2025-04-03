import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
    (config) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo?.token) {
                config.headers.Authorization = `Bearer ${userInfo.token}`;
                console.log('Token ajouté aux headers:', config.headers.Authorization);
            }
            return config;
        } catch (error) {
            console.error('Erreur lors de la récupération du token:', error);
            return config;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Erreur de réponse:', error.response?.status);
        console.error('Message d\'erreur:', error.response?.data);
        
        if (error.response?.status === 401) {
            // Ne pas rediriger automatiquement, laisser le composant gérer la redirection
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default api; 