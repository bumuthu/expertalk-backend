// Auth related 
export enum AuthType {
    EMAIL = "EMAIL",
}

// Pricing related
export enum PricingPlanName {
    FREE = "FREE",
    STANDARD = "STANDARD",
    PREMIUM = "PREMIUM"
}
export enum BillingPeriod {
    MONTHLY = "MONTHLY",
    ANNUALLY = "ANNUALLY"
}
export enum CouponValidPeriod {
    ONE_MONTH = "ONE_MONTH",
    THREE_MONTHS = "THREE_MONTHS",
    SIX_MONTHS = "SIX_MONTHS",
    FOREVER = "FOREVER"
}
export enum FeatureType {
    COLLECTION_GENERATION_ATTEMPTS = "COLLECTION_GENERATION_ATTEMPTS",
    MAX_IMAGES_PER_COLLECTION = "MAX_IMAGES_PER_COLLECTION",
    CUSTOMER_SUPPORT = "CUSTOMER_SUPPORT"
}