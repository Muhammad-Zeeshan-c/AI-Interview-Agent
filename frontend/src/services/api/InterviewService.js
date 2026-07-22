import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,                
    headers: {
        'Content-Type': 'application/json'
    }
});

const interviewService = {
    analyzeResume: async (resumeFile) => {

        try {
            const formdata = new FormData();
            formdata.append('resume', resumeFile);
            const response = await api.post('/interview/resume', formdata,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            });

            return response.data;
        } catch (error) {
            console.error("Error analyzing resume:", error);
            throw error.response?.data || error.message;
        }
    }
}

export default interviewService;