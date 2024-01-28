import { ChatModel } from "../../models/entities";


export const buildQuery = (context: any[], prevMessages: ChatModel[], message: string) => {
    return `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
    \n----------------\n
    PREVIOUS CONVERSATION:
    ${prevMessages.map((message) => {
        if (!message.byBot)
            return `User: ${message.message}\n`
        return `Assistant: ${message.message}\n`
    })}
                                                                                                                              
    \n----------------\n
    
    CONTEXT:
    ${context.map((r) => r.pageContent).join('\n\n')}
    
    USER INPUT: ${message}`
}