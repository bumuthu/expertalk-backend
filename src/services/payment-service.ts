// import UserDBModel from "../models/db/user.model";
// import { entity } from "../models/entities";
// import { ingress } from "../models/ingress";
// import { DataNotFoundError } from "../utils/exceptions";
// import connectToTheDatabase from "../utils/mongo-connection";
// import { EntityService } from "./entity.service";
// import { SysConfigsService } from "./sys-config-service";

// const stripe = require('stripe')(process.env.TALK_STRIPE_SECRET_KEY);
// const envUrl = `https://${process.env.TALK_ENV_NAME}.mintoon.io`;

// export class PaymentService extends EntityService {
//     constructor() {
//         super();
//     }

//     async before() {
//         await connectToTheDatabase();
//     }

//     async after() {
//     }

//     async checkout(checkoutInput: ingress.PaymentCheckoutInput): Promise<{ redirectUrl: string }> {
//         await this.before();
//         console.log("Checkout Input:", checkoutInput);

//         const user: entity.User = await UserDBModel.findOne({ _id: checkoutInput.userId });
//         if (!user) throw new DataNotFoundError("User not found in the system");

//         const sysConfigService = new SysConfigsService();
//         const sysConfigRes: entity.PricingProducts = await sysConfigService.getSysConfigs("pricing-products") as entity.PricingProducts;

//         let stripeProductId: string;
//         let productDef: entity.Product;
//         if (checkoutInput && checkoutInput.pricingPackageName && checkoutInput.billingPeriod) {
//             productDef = sysConfigRes.products.filter(prod => prod.productId == `${checkoutInput.pricingPackageName}:${checkoutInput.billingPeriod}`)[0];
//             console.log("Product definition:", productDef);
//             stripeProductId = productDef.stripeProductId;
//         }

//         if (!productDef) {
//             console.log("No pricing definition");
//             throw new DataNotFoundError("Pricing definition not found in the system");
//         }

//         const customer = await stripe.customers.create({
//             email: user.email,
//             name: user.name,
//         });

//         const session = await stripe.checkout.sessions.create({
//             customer: customer.id,
//             line_items: [
//                 {
//                     price: stripeProductId,
//                     quantity: 1,
//                 },
//             ],
//             mode: 'payment',
//             success_url: `${envUrl}/account/payment?success=true`,
//             cancel_url: `${envUrl}/account/payment?canceled=true`,
//             metadata: {
//                 pricingPlanName: checkoutInput.pricingPackageName,
//                 billingPeriod: checkoutInput.billingPeriod
//             },
//             // discounts: [{
//             //     coupon: 'VqojMuR5'
//             // }],
//             allow_promotion_codes: true
//         });
//         console.log("Stripe response:", session);

//         if (user.paymentHistory == null) {
//             user.paymentHistory = [];
//         }
//         const paymentHistory: entity.PaymentHistory = {
//             status: entity.PaymentStatus.IN_PROGRESS,
//             stripeSessionId: session.id,
//             renew: checkoutInput.renew ?? false,
//             timestamp: Date.now()
//         }
//         user.paymentHistory.push(paymentHistory);
//         console.log("Payment history:", paymentHistory);

//         const userRes = await UserDBModel.findByIdAndUpdate(checkoutInput.userId, user, { new: true });
//         console.log("Updated user response:", userRes);

//         return { redirectUrl: session.url };
//     }


//     async retrieveSession(sessionId: string): Promise<any> {
//         const session = await stripe.checkout.sessions.retrieve(sessionId);
//         console.log("Session:", session);

//         return session;
//     }
// }