import {files, Storage} from "../storage";
import * as md5 from "md5";
import {UserNotFound} from "./errors";
import {token_expiration} from "../../config/authentication";
import {Login} from "../../controllers/types/request";
import {$log} from "@tsed/common";


export namespace Core.Account {

    export const users: { [p: string]: { salt: string, token?: string } } = {};

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


    export async function verify(user: Login["body"]) {
        const salt = users[user.name].salt;


        $log.debug("verify", {user, users})

        let account = JSON.parse(await Storage.read(files.account));
        const userStoredHash = account[user.name]
        $log.debug("infos", {user, account})
        if (userStoredHash === undefined) {
            throw UserNotFound(user.name)
        }
        const isAuthorized = user.hash === md5(userStoredHash + salt);
        if (isAuthorized) {
            users[user.name] = {
                ...users[user.name],
                token: Token.generate(15)
            }

            setTimeout(() => {
                Token.del(user.name)
            }, token_expiration)


        }
        return {authorized: isAuthorized, token: users[user.name].token};
    }


    export namespace Token {
        export let validate = (token: string) => Object.values(users).some(v => token === v.token);

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
