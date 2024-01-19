import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { AuthenticationError } from '../utils/exceptions';

export enum PasswordChallenge {
    NEW_PASSWORD_REQUIRED = 'NEW_PASSWORD_REQUIRED',
    SMS_MFA = 'SMS_MFA',
}

const POOL_ID = process.env.TALK_COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.TALK_COGNITO_USER_POOL_CLIENT;


export class AuthenticationService {

    private userPool: CognitoUserPool;
    private cognitoUser: CognitoUser;

    constructor() {
        this.userPool = new CognitoUserPool({
            UserPoolId: POOL_ID,
            ClientId: CLIENT_ID,
        });
    }

    async signUp(email: string, password: string, userId: string) {
        console.log('email=' + email + ', password=' + password + ', userId=' + userId)

        this.cognitoUser = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });

        try {
            const userIdAttr = new CognitoUserAttribute({
                Name: 'custom:user_id',
                Value: userId
            })

            return await new Promise(
                (resolve, reject) => {
                    this.userPool.signUp(
                        email,
                        password,
                        [userIdAttr],
                        null,
                        function (error, response) {
                            if (error) reject(error);
                            resolve(response);
                        }
                    )
                }
            );
        } catch (err) {
            console.error(err);
            throw new AuthenticationError(err.message);
        }
    }


    async signIn(email: string, password: string): Promise<{ accessToken: string, idToken: string, refreshToken: string }> {
        console.log('sign-in: email=' + email + ', password=' + password);

        const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        });
        this.cognitoUser = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });

        try {
            return await new Promise(
                (resolve, reject) => {
                    this.cognitoUser.authenticateUser(authenticationDetails, {
                        onSuccess: function (result) {
                            const accessToken: string = result.getAccessToken().getJwtToken();
                            const idToken: string = result.getIdToken().getJwtToken();
                            const refreshToken: string = result.getRefreshToken().getToken();
                            resolve({ accessToken, idToken, refreshToken })
                        },
                        onFailure: function (err) {
                            reject(err)
                        }
                    });
                })

            // const cognitoUser = await this.userPool.signIn(username, password).catch(err => console.log(err));

            // console.log('current user = ', cognitoUser);

            // const challenge = cognitoUser.challengeName;
            // if (challenge !== PasswordChallenge.NEW_PASSWORD_REQUIRED) {
            //     return cognitoUser.getSignInUserSession()?.getIdToken().getJwtToken();
            // } else {
            //     console.log('new password required');
            //     throw new Error('password change required');
            // }

        } catch (err) {
            console.error(err);
            throw new AuthenticationError(err.message);
        }
    }

    async signOut(email: string) {
        console.log('sign-out: email=', email);

        try {
            this.cognitoUser = new CognitoUser({
                Username: email,
                Pool: this.userPool
            });
            this.cognitoUser.signOut();
            return;
        } catch (err) {
            throw new AuthenticationError("User sign out exception")
        }
    }


    async verifyUser(email: string, code: string) {
        this.cognitoUser = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });

        try {
            return await new Promise(
                (resolve, reject) => {
                    this.cognitoUser.confirmRegistration(
                        code, true, (err, result) => {
                            if (err) return reject(err);
                            return resolve(result);
                        });
                })
        } catch (err) {
            console.error(err);
            throw new AuthenticationError(err.message)
        }
    }


    async resendVerification(email: string) {
        this.cognitoUser = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });

        try {
            return await new Promise(
                (resolve, reject) => {
                    this.cognitoUser.resendConfirmationCode(
                        (err, result) => {
                            if (err) return reject(err);
                            return resolve(result);
                        });
                })
        } catch (err) {
            console.error(err);
            throw new AuthenticationError(err.message)
        }
    }


    async forgotPassword(email: string) {
        this.cognitoUser = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });

        try {
            return await new Promise(
                (resolve, reject) => {
                    this.cognitoUser.forgotPassword(
                        {
                            onSuccess: function (result) {
                                resolve(result)
                            },
                            onFailure: function (err) {
                                reject(err)
                            }
                        })
                })
        } catch (err) {
            console.error(err);
            throw new AuthenticationError(err.message)
        }
    }


    async changePassword(email: string, oldPassword: string, newPassword: string) {
        try {
            await this.signIn(email, oldPassword);

            return await new Promise(
                (resolve, reject) => {
                    this.cognitoUser.changePassword(
                        oldPassword,
                        newPassword,
                        (err, result) => {
                            if (err) return reject(err);
                            return resolve(result);
                        });
                })
        } catch (err) {
            console.error(err);
            throw new AuthenticationError(err.message)
        }
    }


    async deleteUser() {
        await new Promise(
            (resolve, reject) => {
                this.cognitoUser.deleteUser((err) => {
                    if (err) {
                        console.error("ERROR", err)
                        reject();
                    }
                    resolve("Deleted");
                });
            }
        );
    }
}
