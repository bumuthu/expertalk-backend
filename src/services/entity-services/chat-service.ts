import ChatDBModel, { ChatDocument } from "../../models/db/chat.model";
import { ChatModel } from "../../models/entities";
import { EntityService } from "./entity.service";


export class SourceService extends EntityService<ChatModel, ChatDocument> {
    constructor() {
        super(ChatDBModel);
    }
}