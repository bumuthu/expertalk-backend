export enum SourceUploadStatus {
    PENDING,
    PROCESSING,
    FAILED,
    SUCCESS
}

export enum SysConfigName {
    PRICING_PLANS = "pricing-plans",
    COUPONS = "coupons",
    PROMO_IMAGES = "promo-images",
    PRICING_PRODUCTS = "pricing-products",
    MONITORING = "monitoring"
}

export enum ChatScope {
    PRIVATE,
    WORKSPACE,
    PUBLIC
}