import jwt_decode from "jwt-decode";
import UserDBModel, { UserDocument } from "../../models/db/user.model";
import { ingress } from "../../models/ingress";
import { AuthenticationError, DataNotFoundError, InternalServerError, KnownError, ValidationError } from "../../utils/exceptions";
import { EntityService } from "./entity.service";
import { EmailSubject, MonitoringService } from "../monitoring-service";
import { UserModel } from "../../models/entities";

const MONTH_IN_MS = 30.5 * 24 * 3600 * 1000;
const YEAR_IN_MS = 12 * 30.5 * 24 * 3600 * 1000;

export class UserService extends EntityService<UserModel, UserDocument> {
    constructor() {
        super(UserDBModel);
    }

    async getUserByToken(accessToken: string): Promise<UserModel> {
        await this.before();

        if (!accessToken) throw new AuthenticationError("Null access token found");

        const decodedUser: any = jwt_decode(accessToken);
        console.log("Decoded user:", decodedUser);

        const user: UserModel = await UserDBModel.findOne({ cognitoUserSub: decodedUser.sub });                                   
        if (!user) throw new DataNotFoundError("User not found in the system");                    

        return user;
    }


    async getUserByUserId(userId: string): Promise<UserModel> {
        await this.before();

        const user: UserModel = await UserDBModel.findOne({ _id: userId });
        if (!user) throw new DataNotFoundError("User not found in the system");

        return user;
    }


    getUserIdByToken(accessToken: string): string {
        if (!accessToken) throw new AuthenticationError("Null access token found");

        const decodedUser: any = jwt_decode(accessToken);
        console.log("Decoded user:", decodedUser);
        const userId: string = decodedUser["custom:user_id"];

        return userId;
    }


    async getEmailByToken(accessToken: string): Promise<string> {

        if (!accessToken) throw new AuthenticationError("Null access token found");

        const decodedUser: any = jwt_decode(accessToken);
        console.log("Decoded user:", decodedUser);
        const email: string = decodedUser["email"];

        return email;
    }


    async createNewUser(newUser: ingress.SignUpInput): Promise<UserModel> {
        try {
            await this.before();

            const checkExistingUsersWIthEmail: UserModel | null = await UserDBModel.findOne({ email: newUser.email });
            if (checkExistingUsersWIthEmail != undefined) {
                throw new ValidationError("User with the given email exists")
            }
            const userEntry: UserModel = await this.insertNewUser(newUser);
            console.log("New User DB Response:", userEntry);
            return userEntry
        } catch (e) {
            console.error(e);
            if (e.knownError) throw new KnownError(e.status, e.code, e.message);
            throw new InternalServerError();
        }
    }


    async insertNewUser(newUser: ingress.SignUpInput): Promise<UserModel> {
        await this.before();

        const timestamp = Date.now();

        const newUserDB: UserModel = {
            name: newUser.name,
            email: newUser.email,
            workspaces: [],
            cognitoUserSub: '',
            notifications: [{
                timestamp,
                title: `Welcome to ExperTalk!`,
                description: `Welcome to ExperTalk journey. You have recieved your free tier rewards.`
            }],
        };

        const user = await UserDBModel.create(newUserDB);

        const emailBody = {
            "Email Address": user.email,
            "User ID": user._id,
            "Environment": process.env.TALK_ENV_NAME,
            "Time": (new Date()).toString()
        }
        const monitoringService = new MonitoringService();
        await monitoringService.sendAdminEmail(EmailSubject.NEW_USER_REGISTRATION, emailBody).catch((err) => { console.log("Error while admin email", err) });

        return user;
    }

    // async upgradePricing(userId: string): Promise<UserModel> {
    //     try {
    //         await this.before();

    //         const user: UserModel = await UserDBModel.findOne({ _id: userId });
    //         if (!user) throw new DataNotFoundError("User not found in the system");

    //         if (user.paymentHistory.length == 0) {
    //             return user;
    //         }

    //         const lastPaymentHistory: entity.PaymentHistory = user.paymentHistory[user.paymentHistory.length - 1];
    //         console.log("Payment history:", lastPaymentHistory);

    //         if ([entity.PaymentStatus.IN_PROGRESS, entity.PaymentStatus.USER_UPDATE_FAILED].includes(lastPaymentHistory.status) == false) {
    //             return user;
    //         }
    //         const paymentService = new PaymentService();
    //         const session = await paymentService.retrieveSession(lastPaymentHistory.stripeSessionId);
    //         console.log("Retrieved session:", session);

    //         if (session.payment_status == "unpaid") {
    //             user.paymentHistory[user.paymentHistory.length - 1].status = entity.PaymentStatus.CANCELLED;

    //             const userRes = await UserDBModel.findByIdAndUpdate(userId, user, { new: true });
    //             console.log("Updated user response:", userRes);

    //             return userRes;
    //         }

    //         user.paymentHistory[user.paymentHistory.length - 1].status = entity.PaymentStatus.COMPLETED;

    //         const pricingPlanName: PricingPlanName = session.metadata.pricingPlanName;
    //         const billingPeriod: BillingPeriod = session.metadata.billingPeriod;

    //         const pricingPlans = await SysConfigDBModel.findOne({ name: "pricing-plans" });
    //         console.log("Pricing plans:", pricingPlans.value);

    //         const pricingPlan: entity.PricingPlan = pricingPlans.value[pricingPlanName];

    //         let timestamp = Date.now();

    //         // Billing related
    //         user.currentPlan = pricingPlanName;
    //         if (lastPaymentHistory.renew) {
    //             timestamp = user.planValidTill;
    //         } else {
    //             user.billingStartsAt = timestamp;
    //             user.billingEndsAt = timestamp + MONTH_IN_MS;
    //         }

    //         if (billingPeriod == BillingPeriod.MONTHLY) {
    //             user.planValidTill = timestamp + MONTH_IN_MS;
    //         } else if (billingPeriod == BillingPeriod.ANNUALLY) {
    //             user.planValidTill = timestamp + YEAR_IN_MS;
    //         } else {
    //             throw new BusinessReject("Invalid billing period");
    //         }

    //         // History
    //         user.history.push({
    //             timestamp,
    //             eventType: entity.HistoryEventType.PRICING_UPGRADE_EVENT,
    //             pricingPlanName: pricingPlanName,
    //             planValidTill: user.planValidTill
    //         });

    //         // Notification
    //         user.notifications.push({
    //             timestamp,
    //             title: `Successfully upgraded!`,
    //             description: `Congradulations! You have successfully upgraded with ${pricingPlan.displayName} package. Enjoy with NFT generations! Thank you!`
    //         })

    //         const userRes = await UserDBModel.findByIdAndUpdate(userId, user, { new: true });
    //         console.log("Updated user response:", userRes);

    //         const emailBody = {
    //             "Pricing Plan": user.currentPlan,
    //             "Billing Period": billingPeriod,
    //             "Email Address": user.email,
    //             "User ID": user._id,
    //             "Environment": process.env.MO_ENV_NAME,
    //             "Time": (new Date()).toString()
    //         }
    //         const monitoringService = new MonitoringService();
    //         await monitoringService.sendAdminEmail(EmailSubject.USER_UPGRADE, emailBody).catch((err) => { console.log("Error while admin email", err) });

    //         return userRes;
    //     } catch (e) {
    //         console.error(e);
    //         if (e.knownError) throw new KnownError(e.status, e.code, e.message);
    //         throw new InternalServerError();
    //     }
    // }

    // Triggered periodically
    // async validateUsersBillingPeriod() {
    //     console.log("Billiing validation job triggered at", new Date());

    //     try {
    //         await this.before();

    //         const users: UserModel[] = await UserDBModel.find();
    //         const timestamp = Date.now();
    //         for (let usr of users) {
    //             let updated: boolean = false;

    //             if (usr.billingEndsAt < timestamp) {
    //                 usr.collectionAttemptsUsed = 0;
    //                 usr.billingStartsAt = usr.billingEndsAt;
    //                 usr.billingEndsAt = usr.billingEndsAt + MONTH_IN_MS;

    //                 updated = true;
    //                 console.log(`Reset billing end date to [${usr.billingEndsAt}] of user [${usr._id}] email [${usr.email}]`);
    //             }

    //             if (usr.currentPlan != PricingPlanName.FREE && usr.planValidTill && usr.planValidTill < timestamp) {
    //                 console.log(`Pricing plan [${usr.planValidTill}] expired of user [${usr._id}] email [${usr.email}]`);

    //                 // History
    //                 usr.history.push({
    //                     timestamp,
    //                     eventType: entity.HistoryEventType.PRICING_DOWNGRADE_EVENT,
    //                     pricingPlanName: PricingPlanName.FREE,
    //                     reason: `Due to expiration.`
    //                 });

    //                 // Notification
    //                 usr.notifications.push({
    //                     timestamp,
    //                     title: `${usr.currentPlan} packages expired!`,
    //                     description: `Your pricing plan was downgraded to ${PricingPlanName.FREE} package due to expiration. Please be kind enough to upgrade the pricing plan to experience the advanced features.`
    //                 });

    //                 usr.collectionAttemptsUsed = 0;
    //                 usr.billingStartsAt = timestamp;
    //                 usr.billingEndsAt = timestamp + MONTH_IN_MS;

    //                 usr.currentPlan = PricingPlanName.FREE;
    //                 usr.planValidTill = null;

    //                 updated = true;
    //                 console.log(`Reset pricing plan to [${usr.currentPlan}] of user [${usr._id}] email [${usr.email}]`);
    //             }

    //             if (updated == true) {
    //                 try {
    //                     const updatedUser = await UserDBModel.findByIdAndUpdate(usr._id, usr, { new: true });
    //                     console.log("Updated user", updatedUser);
    //                 } catch (e) {
    //                     console.error(e);
    //                     throw new Error("User update failed!")
    //                 }
    //             }
    //         }
    //     } catch (e) {
    //         console.error(e);
    //         if (e.knownError) throw new KnownError(e.status, e.code, e.message);
    //         throw new InternalServerError();
    //     }

    //     console.log("Biliing validation job finished");
    // }

    // async validateCoupon(couponInput: ingress.UserUpgradeCouponInput): Promise<egress.CouponValidateResponse> {
    //     try {
    //         await this.before();

    //         let couponValidateResponse: egress.CouponValidateResponse = {
    //             validity: false
    //         };
    //         const sysConfigEntry = await SysConfigDBModel.findOne({ name: "coupons" });
    //         console.log("Coupons:", sysConfigEntry);

    //         const allCoupons: entity.AllCoupons = sysConfigEntry.value as entity.AllCoupons;
    //         if (sysConfigEntry == undefined || sysConfigEntry.value == undefined) {
    //             return couponValidateResponse;
    //         }

    //         for (let coupon of allCoupons.coupons) {
    //             if (couponInput.code == coupon.code) {
    //                 console.log("Found coupon:", coupon);
    //                 couponValidateResponse.validity = true;
    //                 couponValidateResponse.price = PricingService.calculateDiscountedPrice(couponInput.originalPrice, coupon.discount);
    //                 couponValidateResponse.discount = coupon.discount;
    //                 return couponValidateResponse;
    //             }
    //         }
    //         return couponValidateResponse;
    //     } catch (e) {
    //         console.error(e);
    //         if (e.knownError) throw new KnownError(e.status, e.code, e.message);
    //         throw new InternalServerError();
    //     }
    // }
}