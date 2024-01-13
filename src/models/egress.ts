export namespace egress {

    export interface CouponValidateResponse {
        validity: boolean,
        price?: number,
        discount?: number
    }

}