// import { ingress } from "../../models/ingress";
// import { PaymentService } from "../../services/payment-service";
// import { respondError, respondSuccess } from "../../utils/response-generator";
// import { enrichRequest, validateAllowedFields, validateRequiredFields } from "../../validation/utils";


// // PaymentCheckoutHandler
// // Checkout
// export const handler = async (event, _context) => {
//     try {
//         const requestBody: ingress.Request = JSON.parse(event.body) as ingress.Request;
//         console.log("Event", event);

//         validateAllowedFields(requestBody, ["pricingPackageName", "billingPeriod", "renew"]);
//         validateRequiredFields(requestBody, ["pricingPackageName", "billingPeriod"]);

//         const paymentCheckoutInput: ingress.PaymentCheckoutInput = enrichRequest(event.headers.Authorization, requestBody) as ingress.PaymentCheckoutInput;
//         const paymentService = new PaymentService();
//         const checkoutURL = await paymentService.checkout(paymentCheckoutInput);

//         return respondSuccess(checkoutURL);
//     } catch (err) {
//         return respondError(err)
//     }
// }
