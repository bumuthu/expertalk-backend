import { SysConfigName, SourceUploadStatus, ChatScope } from "./enums";


export class Entity {
    _id?: any;
}

// User related
export interface ChatWithSubChats {
    chat: string | ChatModel,
    subChats: (string | ChatModel)[]
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
    notifications: Notification[],
}

export interface WorkspaceToken {
    openAI?: string
}
export interface WorkspaceChatModel extends Entity {
    knowledge: string | KnowledgeModel,
    privateChats: ChatWithSubChats[] // Used for both private & workspace scoped chats
}
// Workspace related
export interface WorkspaceModel extends Entity {
    name: string,
    owner: string | UserModel,
    admins: (string | UserModel)[],
    members: (string | UserModel)[],
    knowledgeChats: (string | WorkspaceChatModel)[],
    logoUrl?: string,
    tokens: WorkspaceToken
}

// Knowledge related
export interface KnowledgeModel extends Entity {
    title: string,
    description: string,
    public: boolean, // true -> public, false -> scoped to workspace
    imageUrl?: string,
    workspace?: string | WorkspaceModel,
    sources: (string | SourceModel)[],
    categories?: (string | CategoryModel)[]
    publicChats: ChatWithSubChats[]
}

// Chat related
export interface ChatModel extends Entity {
    message: string
    timestamp: number
    scope: ChatScope
    byBot: boolean,
    user?: string | UserModel, // if byBot is false user is required
}

// Source related
export interface SourceModel extends Entity {
    name: string
    uploadStatus: SourceUploadStatus
    url: string
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