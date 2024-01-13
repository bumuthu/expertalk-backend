import { AuthType, CouponValidPeriod, FeatureType, PricingPlanName } from "./common";

export namespace entity {
    export class Entity {
        _id?: any;
    }


    // User related
    export enum HistoryEventType {
        GENERAL_EVENT = "GENERAL_EVENT",
        COLLECTION_SUCCESS_EVENT = "COLLECTION_SUCCESS_EVENT",
        COLLECTION_FAILED_EVENT = "COLLECTION_FAILED_EVENT",
        PRICING_UPGRADE_EVENT = "PRICING_UPGRADE_EVENT",
        PRICING_DOWNGRADE_EVENT = "PRICING_DOWNGRADE_EVENT"
    }
    export enum PaymentStatus {
        IN_PROGRESS = "IN_PROGRESS",
        CANCELLED = "CANCELLED",
        USER_UPDATE_FAILED = "USER_UPDATE_FAILED",
        COMPLETED = "COMPLETED"
    }
    export interface Event {
        timestamp: number,
        eventType: HistoryEventType
    }
    export interface GeneralEvent extends Event {
        title: string,
        description?: string
    }
    export interface CollectionEvent extends Event {
        collectionName: string,
        outputsCount: number,
        failureReason?: string
    }
    export interface PricingEvent extends Event {
        pricingPlanName: string,
        planValidTill?: number,
        reason?: string
    }
    export interface Notification {
        timestamp: number,
        title: string,
        description: string
    }
    export interface PaymentHistory {
        status: PaymentStatus,
        stripeSessionId: string,
        timestamp: number,
        renew: boolean
    }
    export interface User extends Entity {
        name: string,
        email: string,
        cognitoUserSub: string,
        authType: AuthType,
        collectionIds: string[],
        notifications: Notification[],
        history: (GeneralEvent | CollectionEvent | PricingEvent)[],
        paymentHistory: PaymentHistory[],
        collectionAttemptsUsed: number,
        billingStartsAt: number,
        billingEndsAt: number,
        currentPlan: PricingPlanName,
        planValidTill?: number
    }


    // Collection related
    export interface Feature {
        featureId: string,
        name: string,
        rarity: number
    }
    export interface Layer {
        layerId: string,
        name: string,
        images: Feature[]
    }
    export interface LayerConfigs {
        growEditionSizeTo: number,
        layersOrder: Layer[]
    }
    export interface CollectionMetadata {
        namePrefix: string,
        baseUri?: string,
        description?: string,
        layerConfigurations?: LayerConfigs[],
        format?: {
            width: number,
            height: number,
            smoothing: boolean
        },
        background?: {
            generate: boolean,
            brightness: string,
            static: boolean,
            default: string
        },
        gif?: {
            export: boolean,
            repeat: number,
            quality: number,
            delay: number
        },
        preview_gif?: {
            numberOfImages: number,
            order: string,
            repeat: number,
            quality: number,
            delay: number,
            imageName: string
        }
        extraMetadata?: any,
        metadata_props?: string[],
        frontEndConfigData?: any
    }

    export interface Collection extends Entity {
        createdAt: number,
        lastModifiedAt: number,
        generatedAt?: number,
        userId: string,
        metadata?: CollectionMetadata,
        previewImage?: string
    }


    // PricingPlan related
    export interface PricingFeature {
        description: string,
        value: number | string
    }
    export interface PricingPlan extends Entity {
        displayName: PricingPlanName,
        description: string,
        monthlyPrice: number,
        monthlyOriginalPrice: number,
        monthlyDiscount: number,
        anualPrice: number,
        anualOriginalPrice: number,
        anualDiscount: number,
        features: {
            [FeatureType.COLLECTION_GENERATION_ATTEMPTS]: PricingFeature,
            [FeatureType.MAX_IMAGES_PER_COLLECTION]: PricingFeature,
            [FeatureType.CUSTOMER_SUPPORT]: PricingFeature
        }
    }
    export interface AllPricingPlans {
        FREE: PricingPlan,
        STANDARD: PricingPlan,
        PREMIUM: PricingPlan
    }

    // Coupon related
    export interface CouponCode {
        code: string,
        validFrom: number,
        validTo: number,
        discount: number,
        validPeriod: CouponValidPeriod
    }
    export interface AllCoupons {
        coupons: CouponCode[]
    }

    export interface PromoImages {
        images: string[]
    }

    export interface Product {
        productId: string,
        stripeProductId: string,
        price?: number
    }

    export interface PricingProducts {
        products: Product[]
    }

    export interface Monitoring {
        email: {
            senderEmail: string,
            senderPassword: string,
            recieverEmails: string[]
        }
    }

    // System Config related
    export interface SystemConfig {
        name: "pricing-plans" | "coupons" | "promo-images" | "pricing-products" | "monitoring"
        value: AllPricingPlans | AllCoupons | PromoImages | PricingProducts | Monitoring
    }
}