import { ErrorCode } from "@mintoven/common";


export class InternalServerError extends Error {
    public status: number;
    public code: ErrorCode;

    constructor() {
        super("Internal server error. Contact the support service.");
        this.message = "Internal server error. Contact the support service.";
        this.status = 500;
        this.code = ErrorCode.INTERNAL_SERVER_ERROR;
    }
}

export class KnownError extends Error {
    public readonly knownError: boolean = true;
    public status: number;
    public code: ErrorCode;

    constructor(status: number, code: ErrorCode, message: string) {
        super(message);

        this.status = status;
        this.code = code;
        this.message = message;
    }
}

export class ValidationError extends KnownError {
    constructor(message: string) {
        super(400, ErrorCode.VALIDATION_ERROR, message)
    }
}

export class NotImplementedError extends KnownError {
    constructor(message: string) {
        super(400, ErrorCode.NOT_IMPLEMENTED_ERROR, message);
    }
}

export class BusinessReject extends KnownError {
    constructor(message: string) {
        super(400, ErrorCode.BUSINESS_REJECT_ERROR, message)
    }
}

export class NotAuthorizedError extends KnownError {
    constructor(message: string) {
        super(403, ErrorCode.NOT_AUTHORIZED_ERROR, message)
    }
}

export class AuthenticationError extends KnownError {
    constructor(message: string) {
        super(403, ErrorCode.AUTHENTICATION_ERROR, message);
    }
}

export class DataNotFoundError extends KnownError {
    constructor(message: string) {
        super(404, ErrorCode.DATA_NOT_FOUND_ERROR, message);
    }
}