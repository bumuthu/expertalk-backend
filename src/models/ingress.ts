import { SysConfigName } from "./enums";

export namespace ingress {

    export interface Request {
        requestId?: string
        userId?: string,
        connectionId?: string
    }

    // Auth related
    export interface LoginInput extends Request {
        email: string,
        password: string
    }
    export interface SignUpInput extends Request {
        name: string,
        email: string,
        password: string
    }
    export interface LogInInput extends Request {
        email: string,
        password: string
    }


    // User related
    export interface UserUpdateInput extends Request {
        name?: string,
        email?: string
    }
    export interface UserUpgradeCouponInput extends Request {
        code: string,
        originalPrice: number
    }
    export interface SystemConfigRetrievalInput extends Request {
        name: SysConfigName
    }
    export interface SystemConfigUpdateInput extends Request {
        name: SysConfigName
    }

    // Workspace related
    export interface WorkspaceCreateInput extends Request {
        name: string,
        admins: string[],
        members: string[],
    }
    export interface WorkspaceUpdateInput extends Request {
        workspaceId: string,
        name?: string,
    }

    // Knowledge related
    export interface KnowledgeCreateInput extends Request {
        title: string,
        description: string,
        public: boolean,
        workspace?: string,
        categories: string[]
    }
    export interface KnowledgeUpdateInput extends Request {
        knowledgeId: string,
        title?: string,
        description?: string,
        public?: boolean,
        categories?: string[]
    }
    export interface KnowledgeQueryInput extends Request {
        knowledgeId?: string, // returns this knowledge
        workspaceId?: string // returns all knowledges of ws
    }

    // Source related
    export interface SourceAddInput extends Request {
        name: string,
        url: string,
        knowledgeId: string
    }
    export interface SourceRemoveInput extends Request {
        sourceId: string,
        knowledgeId: string
    }
    export interface SourceUploadUrlInput extends Request {
        knowledgeId: string,
    }

    // Chat related
    export interface ChatCompletionInput extends Request {
        knowledgeId: string,
        message: string
    }
}