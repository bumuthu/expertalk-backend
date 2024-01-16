import { SysConfigName } from "../models/enums";
import connectToTheDatabase from "../utils/mongo-connection";
import { EntityService } from "./entity.service";
import { SysConfigsService } from "./sys-config-service";
import { Monitoring } from "../models/entities";
const nodemailer = require('nodemailer');


export enum EmailSubject {
    NEW_USER_REGISTRATION = "EXPERTALK ALERT: New User Registration",
    USER_UPGRADE = "EXPERTALK ALERT: An User Upgrade",
}

export class MonitoringService extends EntityService {
    constructor() {
        super();
    }

    async before() {
        await connectToTheDatabase();
    }

    async after() {
    }

    private buildUserEventEmailBody(details: Record<string, string>): string {
        let body = ``;
        for (let key in details) {
            body += `${key}: ${details[key]}
            `;
        }
        return body
    }

    async sendAdminEmail(subject: EmailSubject, details: Record<string, string>) {
        if (process.env.TALK_ENV_NAME != "app") {
            return;
        }

        try {
            await this.before();

            const systemService = new SysConfigsService();
            const monitoringConfigs: Monitoring = await systemService.getSysConfigs(SysConfigName.MONITORING) as Monitoring;

            const transporter = nodemailer.createTransport({
                host: process.env.APP_HOST_URL,
                port: 465,
                secure: true,
                auth: {
                    user: monitoringConfigs.email.senderEmail,
                    pass: monitoringConfigs.email.senderPassword
                }
            });

            const recievers: string = monitoringConfigs.email.recieverEmails.join(', ');
            const body = this.buildUserEventEmailBody(details);
            const mailOptions = {
                from: monitoringConfigs.email.senderEmail,
                to: recievers,
                subject: subject,
                text: body
            };

            return new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        resolve(info.response);
                    }
                });
            })
        }
        catch (err) {
            console.error(err)
        }
    }
}