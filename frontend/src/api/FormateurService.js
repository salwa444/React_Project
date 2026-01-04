import axiosInstance from './axiosConfig';

const FormateurService = {
    getMe: async () => {
        const email = localStorage.getItem('userEmail');
        const response = await axiosInstance.get(`/formateur/me?email=${email}`);
        return response.data;
    },

    getSessions: async () => {
        const email = localStorage.getItem('userEmail');
        const response = await axiosInstance.get(`/formateur/sessions?email=${email}`);
        return response.data;
    },

    getEvaluations: async () => {
        const email = localStorage.getItem('userEmail');
        const response = await axiosInstance.get(`/formateur/evaluations?email=${email}`);
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await axiosInstance.put('/formateur/profile', data);
        return response.data;
    }
};

export default FormateurService;
