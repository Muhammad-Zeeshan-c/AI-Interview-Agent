const axios=require('axios');


const api=axios.create({
    baseURL:'https://api.openrouter.ai/v1',
    headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "HTTP-Referer":'', 
    "X-OpenRouter-Title":'',
    }
})

const askAi=async (message)=>{

    try{
        if(!message || !Array.isArray(message) || message.length===0){
        throw new Error('Invalid prompt');
        }
        const response=await api.post('/chat/completions',{
        model:'openai/gpt-4o-mini',
        messages:message,
        response_format: { type: 'json_object' }
        });
        console.log(response)
        const content=response?.data?.choices?.[0]?.message?.content;

        if(!content || content.trim().length===0){
            throw new Error('Invalid response');
        }
        content = content.replace(/```json\n?|\n?```/g, '').trim();
        return content;
    }
    catch (error) {
        console.error('Error occurred while asking AI:', error.response?.data || error.message || error);
        throw new Error('Failed to get a valid response from the AI service.');
    }

    
}

module.exports={askAi};