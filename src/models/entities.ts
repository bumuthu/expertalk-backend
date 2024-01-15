import { SysConfigName, UploadStatus } from "./enums";


export class Entity {
    _id?: any;

    // getId?(): string {
    //     return this._id;
    // }
}

// User related
export interface KnowledgeChat {
    knowledgeId: string,
    chatIds: string[]
}
export interface Notification {
    timestamp: number,
    title: string,
    description: string
}
export interface UserModel extends Entity {
    name: string,
    email: string,
    cognitoUserSub: string,
    workspaceIds: string[],
    knowledgeChatIds: KnowledgeChat[]
    notifications: Notification[],
}

export interface WorkspaceToken {
    openAI?: string
}
export interface WorkspaceKnowledgeChat {
    knowledgeId: string,
    userId: string,
    chatIds: ChatModel[]
}
// Workspace related
export interface WorkspaceModel extends Entity {
    name: string,
    ownerId: string,
    adminIds: string[],
    memberIds: string[],
    logoUrl?: string,
    tokens: WorkspaceToken
}

// Knowledge related
export interface KnowledgeModel extends Entity {
    title: string,
    description: string,
    public: boolean,
    imageUrl?: string,
    workspaceId?: string,
    sourceIds: string[],
    categories?: string[]
    publicChats: string[]
}

// Chat related
export interface ChatModel extends Entity {
    message: string
    timestamp: number
    byBot: boolean,
    userId?: string,
    childChats: string[],
    public: boolean // To be used for security purposes
}

// Source related
export interface SourceModel extends Entity {
    name: string
    uploadStatus: UploadStatus
    url: string
    key: string
    createdAt: number
    updatedAt: number
}

export interface Monitoring {
    email: {
        senderEmail: string,
        senderPassword: string,
        recieverEmails: string[]
    }
}

// System Config related
export interface SystemConfigModel {
    name: SysConfigName
    value: any
}