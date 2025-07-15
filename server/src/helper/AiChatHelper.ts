import { ChatOpenAI } from "@langchain/openai";

class AiChatHelper{

    private readonly model: ChatOpenAI;
    
    constructor(){
        this.model = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0
        });

        
    }
    

    public async callModel(messagesHistory: Array<{role: string, content: string}>){
        let messageArr:Array<{role: string, content: string}> = [
            { role: "system", content: "Your are a good AI assistent!" }
        ];
        
        messageArr.push(...messagesHistory);
        const result = await this.model.invoke(messagesHistory);
        
        return result.content;
    }
    

}

export default AiChatHelper;