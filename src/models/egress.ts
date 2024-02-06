export namespace egress {

    export interface CouponValidateResponse {
        validity: boolean,
        price?: number,
        discount?: number
    }

    export interface GetSourceUploadUrlResponse {
        uploadUrl: string,
        readUrl: string
    }

    export interface ChatComletionResponse {
        response: string
    }

}