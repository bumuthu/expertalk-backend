import { SysConfigName } from "src/models/enums";
import SysConfigDBModel from "../models/db/sys-config.model";
import { InternalServerError, KnownError, ValidationError } from "../utils/exceptions";
import connectToTheDatabase from "../utils/mongo-connection";
import { EntityService } from "./entity.service";
import { SystemConfigModel, UserModel } from "src/models/entities";

export class SysConfigsService extends EntityService {
    constructor() {
        super();
    }

    async before() {
        await connectToTheDatabase();
    }

    async after() {
    }

    async updateSysConfigs(update: SystemConfigModel, requestedUser: UserModel): Promise<any> {
        try {
            await this.before();

            if (requestedUser.email !== process.env.SUPER_ADMIN_EMAIL) {
                throw new ValidationError(`Unauthorized attempt by ${requestedUser.email}`);
            }

            const sysConfigEntry = await SysConfigDBModel.findOneAndUpdate({ name: update.name }, { value: update.value }, { new: true, upsert: true });
            console.log("Updated system configs:", sysConfigEntry.value);

            return sysConfigEntry.value;
        } catch (e) {
            console.error(e);
            if (e.knownError) throw new KnownError(e.status, e.code, e.message);
            throw new InternalServerError();
        }
    }

    async getSysConfigs(name: SysConfigName): Promise<any> {
        try {
            await this.before();
            const sysConfigEntry = await SysConfigDBModel.findOne({ name });
            console.log("System configs:", sysConfigEntry.value);

            return sysConfigEntry.value;
        } catch (e) {
            console.error(e);
            if (e.knownError) throw new KnownError(e.status, e.code, e.message);
            throw new InternalServerError();
        }
    }
}