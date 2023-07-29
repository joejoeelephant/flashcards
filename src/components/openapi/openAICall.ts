const { Configuration, OpenAIApi } = require("openai");

const axios = require('axios');
import { HttpsProxyAgent } from 'https-proxy-agent';

const agent = new HttpsProxyAgent('http://192.168.0.103:7890');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const devChat = async (sysPrompt: string, userPrompt: string) => {
    const response = await axios({
        url: 'https://api.openai.com/v1/chat/completions',
        method: 'post',
        httpsAgent: agent,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        data: {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system", 
                    content: sysPrompt
                },
                  {"role": "user", "content": userPrompt}
            ]
        }
    });
    return response.data.choices[0].message
}

const productionChat = async (sysPrompt: string, userPrompt: string) => {
    try {
        const result = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system", 
                    content: sysPrompt
                },
                  {"role": "user", "content": userPrompt}
            ]
        });
        return result.data.choices[0].message
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const chatCompletion = async (word: string) => {
    const env = process.env.NODE_ENV;
    const sysPrompt = `
        You are a helpful assistant that provides word definitions,
        the etymology of the word,
        examples, and other related information. 
        I need you return the data in json style for example {word:string,definitions:string[],examples:string[],etymology:string}.
    `
    const userPrompt = `Can you provide the information of the word ${word}?`

    if(env !== 'development') {
        return await productionChat(sysPrompt, userPrompt)
    }else {
        return await devChat(sysPrompt, userPrompt)
    }
}


