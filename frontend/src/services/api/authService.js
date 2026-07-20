import axios from 'axios';



const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,                
    headers: {
        'Content-Type': 'application/json'
    }
});


export const authService = {
    loginWithGoogle: async (userName, userEmail) => {
        try {
            const response = await api.post('/auth/google', { userName, userEmail });
            return response.data;
        } catch (error) {
            console.error("Google Auth Request Failed:", error);
            throw error.response?.data || error.message;
        }
    },

    getCurrentUser: async (dispatch) => {
        try {
            const response = await api.get('/user/currentuser');
            console.log("Dispatching setUser with:", response.data);
            dispatch(setUser(response.data));
            return response.data;
        } catch (error) {
            dispatch(setUser(null));
            console.error("Get Current User Request Failed:", error);
            throw error.response?.data || error.message;
        }
    }
};