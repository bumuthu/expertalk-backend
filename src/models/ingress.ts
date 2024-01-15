import { SysConfigName } from "./enums";

export namespace ingress {

    export interface Request {
        requestId?: string
        userId?: string,
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
}