import { entity } from "../models/entities";
import connectToTheDatabase from "../utils/mongo-connection";
import { EntityService } from "./entity.service";
import { SysConfigsService } from "./sys-config-service";
const nodemailer = require('nodemailer');

const MINTOON_HOST = "mintoon.io";

export enum EmailSubject {
    NEW_USER_REGISTRATION = "MINTOON ALERT: New User Registration",
    USER_UPGRADE = "MINTOON ALERT: An User Upgrade",
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
        if (process.env.MO_ENV_NAME != "app") {
            return;
        }

        try {
            await this.before();

            const systemService = new SysConfigsService();
            const monitoringConfigs: entity.Monitoring = await systemService.getSysConfigs("monitoring") as entity.Monitoring;

            const transporter = nodemailer.createTransport({
                host: MINTOON_HOST,
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