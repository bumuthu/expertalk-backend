import { AuthType, BillingPeriod, PricingPlanName } from "./common";
import { entity } from "./entities";

export namespace ingress {

    export interface Request {
        requestId?: string
        userId?: string,
    }


    // Auth related
    export interface LoginInput extends Request {
        type: AuthType.EMAIL,
        email: string,
        password: string
    }
    export interface SignUpInput extends Request {
        type: AuthType.EMAIL,
        name: string,
        email: string,
        password: string
    }


    // Collection related
    export interface CollectionCreateInput extends Request {
        metadata: entity.CollectionMetadata
    }

    export interface CollectionUpdateInput extends Request {
        collectionId: string,
        name?: string,
        description?: string,
        previewImage?: string,
        metadata?: entity.CollectionMetadata
    }
    export interface CollectionRetrievalInput extends Request {
        collectionId: string
    }
    export interface CollectionDeleteInput extends Request {
        collectionId: string
    }
    export interface CollectionCompleteInput extends Request {
        collectionId: string
    }
    export interface CollectionFailedInput extends Request {
        collectionId: string,
        failureReason?: string
    }
    export interface AddImageInput extends Request {
        collectionId: string,
        layerId: string,
        imageName: string,
        imageData: string, // base64 encoded image
    }
    export interface RemoveImageInput extends Request {
        collectionId: string,
        layerId: string,
        imageName: string
    }
    export interface GetImagesInput extends Request {
        collectionId: string,
        layerId: string,
        imageName: string
    }
    export interface CollectionAllRetrievalInput extends Request {
    }


    // User related
    export interface UserUpdateInput extends Request {
        name?: string,
        email?: string
    }
    export interface UserPricingUpgradeInput extends Request {
        // pricingPlan: PricingPlanName,
        // billingPeriod: BillingPeriod
    }
    export interface UserUpgradeCouponInput extends Request {
        code: string,
        originalPrice: number
    }
    export interface SystemConfigRetrievalInput extends Request {
        name: "pricing-plans" | "coupons" | "promo-images" | "pricing-products" | "monitoring"
    }
    export interface SystemConfigUpdateInput extends Request {
        name: "pricing-plans" | "coupons" | "promo-images" | "pricing-products" | "monitoring"
    }

    // Payment related
    export interface PaymentCheckoutInput extends Request {
        pricingPackageName: PricingPlanName,
        billingPeriod: BillingPeriod,
        renew?: boolean
    }
}