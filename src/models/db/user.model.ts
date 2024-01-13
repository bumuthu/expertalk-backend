import mongoose, { Document, Schema } from 'mongoose';
import { entity } from '../entities';

export interface UserDocument extends Document, entity.User { }

const userSchema = new Schema({
    name: String,
    email: String,
    cognitoUserSub: String,
    authType: String,
    collectionIds: [String],
    notifications: [{
        timestamp: Number,
        title: String,
        description: String
    }],
    history: [Schema.Types.Mixed],
    paymentHistory: [{
        status: String,
        stripeSessionId: String,
        timestamp: Number,
        renew: Boolean
    }],
    collectionAttemptsUsed: Number,
    currentPlan: String,
    planValidTill: Number,
    billingStartsAt: Number,
    billingEndsAt: Number
});


const UserDBModel = mongoose.model<UserDocument>('User', userSchema);

export default UserDBModel;
