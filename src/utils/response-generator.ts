import { ErrorCode } from "@mintoven/common";

export default class ResponseGenerator {
    private status: number;
    private response: any;

    private getResponse() {
        return {
            statusCode: this.status,
            body: JSON.stringify({
                ...this.response
            }),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            }
        };
    }

    public handleSuccessfullResponse(data: any) {
        this.response = { payload: data };
        this.status = 200;
        return this.getResponse();
    }

    public handleDataNotFound(type: string, id?: string) {
        this.response = { errorMessage: `${type} data with id ${id} not found` };
        this.status = 400;
        return this.getResponse();
    }

    public handleCouldntInsert(type: string) {
        this.response = { errorMessage: `Server couldn't insert ${type} data` };
        this.status = 400;
        return this.getResponse();
    }

    public handleGenericError(err: string) {
        this.response = { errorMessage: `Server returns error: \n${err}` };
        this.status = 400;
        return this.getResponse();
    }

    public handleBusinessLoginError(err: string) {
        this.response = { errorMessage: `Server returns error: \n${err}` };
        this.status = 500;
        return this.getResponse();
    }

    public handleAuthorizationError() {
        this.response = { errorMessage: `Invalid authorization token` };
        this.status = 401;
        return this.getResponse();
    }

    public handleUserLoginError(err: { message: string, code: string }) {
        this.response = {
            errorMessage: "User login failed",
            reason: err.message,
            code: err.code
        };
        this.status = 401;
        return this.getResponse();
    }

    public handleUserRegistrationError(err: { message: string, code: string }) {
        this.response = {
            errorMessage: "User registraion failed",
            reason: err.message,
            code: err.code
        };
        this.status = 400;
        return this.getResponse();
    }
}


export interface ErrorResponse {
    status: number,
    code: ErrorCode,
    message: string
}

export function respondError(response: ErrorResponse) {
    console.log("ERROR:", response);
    console.log("ERROR CODE:", response.code);
    console.log("ERROR MESSAGE:", response.message);

    if (Object.values(ErrorCode).includes(response.code) == false) {
        response.status = 500;
        response.code = ErrorCode.INTERNAL_SERVER_ERROR;
    }

    return {
        statusCode: response.status,
        body: JSON.stringify({ message: response.message, errorCode: response.code }),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        }
    };
}

export function respondSuccess(payload: any, others?: any) {
    console.log("Payload:", payload)
    return {
        statusCode: 200,
        body: JSON.stringify({ payload, ...others }),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
        }
    };
}

export function respondRedirect(url: string, payload?: any) {
    console.log("Redirect URL:", url)
    console.log("Payload:", payload)
    return {
        statusCode: 303,
        body: JSON.stringify({ payload }),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Location": url
        }
    };
}

