import { SysConfigName, UploadStatus } from "./enums";


export class Entity {
    _id?: any;

    // getId?(): string {
    //     return this._id;
    // }
}

// User related
export interface KnowledgeChat {
    knowledge: string | KnowledgeModel,
    chats: (string | ChatModel)[]
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
    workspaces: (string | WorkspaceModel)[],
    knowledgeChats: KnowledgeChat[]
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
    owner: string | UserModel,
    admins: (string | UserModel)[],
    members: (string | UserModel)[],
    logoUrl?: string,
    tokens: WorkspaceToken
}

// Knowledge related
export interface KnowledgeModel extends Entity {
    title: string,
    description: string,
    public: boolean,
    imageUrl?: string,
    workspace?: string | WorkspaceModel,
    sources: string[],
    categories?: (string | CategoryModel)[]
    publicChats: (string | ChatModel)[]
}

// Chat related
export interface ChatModel extends Entity {
    message: string
    timestamp: number
    byBot: boolean,
    user?: string | UserModel,
    parentChat?: string | ChatModel,
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

// Category related
export interface CategoryModel extends Entity {
    name: string,
    childCategories?: (string | CategoryModel)[]
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