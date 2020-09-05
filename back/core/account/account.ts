import {files, Storage} from "../storage";
import {Accounts} from "./types";
import {interpret} from "robot3"

import fetch from "node-fetch"
import md5 from "md5";
import {logger} from "../../util/logger";

const users: { [p: string]: { salt: string, token?: string } } = {};

const ttl = 10 // in seconds

export namespace Core.Account {

    export async function init(username: string): Promise<string> {

        const salt = await generateSalt();

        users[username] = {
            salt
        }
        return salt;
    }


    export async function generateSalt() {
        return Token.generate(10)
    }


    export async function verify(user: { name: string, hash: string }) {
        const salt = users[user.name].salt;
        logger.debug("Salts", {stored: salt})
        const userStoredHash = JSON.parse(await Storage.read(files.account))[user.name]
        logger.debug("userStoredHash", {userStoredHash})
        const isAuthorized = user.hash === md5(userStoredHash + salt);
        if (isAuthorized) {
            users[user.name] = {
                ...users[user.name],
                token: Token.generate(15)
            }

            setTimeout(() => {
                Token.del(user.name)
            }, ttl * 1000)


        }
        return {authorized: isAuthorized, token: users[user.name].token};
    }


    export namespace Token {
        export function validate(user: { name: string, token }) {
            return users[user.name].token === user.token
        }

        export function generate(repeat = 10) {
            const rand = () => Math.random().toString(36).slice(2);
            let token = "";
            for (let i = 0; i < repeat; i++) {
                token += rand();
            }
            return token;
        }

        export async function del(username: string) {
            if (users[username].token) delete users[username].token
        }
    }


}
