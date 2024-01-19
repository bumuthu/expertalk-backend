import mongoose, { Document, Schema } from 'mongoose';
import { ChatModel } from '../entities';

export interface ChatDocument extends Document, ChatModel { }

const chatSchema = new Schema({
    message: String,
    timestamp: Number,
    byBot: Boolean,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    parentChat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    public: Boolean
});

const ChatDBModel = mongoose.model<ChatDocument>('Chat', chatSchema);

export default ChatDBModel;
