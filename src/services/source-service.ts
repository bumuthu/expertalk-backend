import SourceDBModel, { SourceDocument } from "../models/db/source.model";
import { SourceModel } from "../models/entities";
import { InternalServerError, KnownError } from "../utils/exceptions";
import { EntityService } from "./entity.service";

export class SourceService extends EntityService<SourceModel, SourceDocument> {
    constructor() {
        super(SourceDBModel);
    }
}