import axios from 'axios';
import { toast } from 'react-toastify';

const ServerUrl = 'http://localhost:5000'; 

const api = axios.create({
    withCredentials: true,
    baseURL: ServerUrl,
});

// Interceptor for attaching auth token
api.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                toast.error('Session Expired! Please Login Again.', {
                    position: "top-center",
                    autoClose: 1500,
                    theme: "colored",
                });
                localStorage.removeItem('token');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }

            if (status === 403) {
                toast.error(data.message || 'Access Denied!', {
                    position: "top-center",
                    autoClose: 1500,
                    theme: "colored",
                });
            }
        }

        return Promise.reject(error);
    }
);

class Api {
    // Auth API
    static async registerUser(data) {
        return await api.post('/api/auth/register', data);
    }

    static async loginUser(data) {
        return await api.post('/api/auth/login', data);
    }

    static async getUserProfile() {
        return await api.get('/api/auth/profile');
    }

    // Game API
    static async createGameRoom(data) {
        return await api.post('/api/game/create-room', data);
    }
    
    static async addOpponent(data) {
        return await api.post('/api/game/add-opponent', data);
    }
    

    static async joinGameRoom(data) {
        return await api.post('/api/game/join-room', data);
    }
    static async addGameDetails(data) {
        return await api.post('/api/game/game-details', data);
    }

    static async makeMove(data) {
        return await api.post('/api/game/make-move', data);
    }

    static async getGameHistory(username) {
        return await api.get(`api/game/history/${username}`);
    }
}

export default Api;
