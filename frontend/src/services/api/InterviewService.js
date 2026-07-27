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
    },

    generateInterviewQuestions: async (formData) => {
        try {
            const { role, experience, mode, projects, skills, resumeText } = formData;
            const result=await api.post('/interview/generate-questions',{ role, experience, mode, projects, skills, resumeText })
            return result.data;
        }
        catch (error) {
            console.error("Error generating interview questions:", error);
            throw error.response?.data || error.message;
        }
    },

    submitAnswer:async(formData)=>{
        try{
            const{interviewId,questionIndex,answer,timetaken}=formData;
            const response =await api.post('/interview/submit-answer',{interviewId,questionIndex,answer,timetaken})
            return response;
        }
        catch(error){
            console.error("Error submitting answer:", error);
            throw error.response?.data || error.message;
        }
    },

    finishInterview:async(interviewId)=>{
        try{
            const response=await api.post('/interview/finish-interview',{interviewId})
            return response;
        }
        catch(error){
            console.error("Error finishing interview:", error);
            throw error.response?.data || error.message;
        }

    },

    getInterviewDetails: async (interviewId) => {
        try{
           const response=await api.get('/interview/details')
            return response; 
        }
        catch(error){
            console.error("Error fetching interview details:", error);
            throw error.response?.data || error.message;
        }
    },

    getInterviewReport: async(id)=>{
        try{
            const response=await api.get(`/interview/report/${id}`)
            return response;
        }
        catch(error){
            console.error("Error fetching interview report:", error);
            throw error.response?.data || error.message;
        }
    }

}

export default interviewService;