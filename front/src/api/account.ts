import {Interactor} from "./Interactor";
import {getApiPath} from "../config/api";
import md5 from "md5"

export class AccountApi extends Interactor {

    private static _instance: AccountApi = new AccountApi(getApiPath("core"));

    public static get instance() {
        return this._instance;
    }


    public async isAuthorized({name, password}: {name: string, password: string}) : Promise<{
        success: boolean,
        token?: string
    }> {
        const ownHash = md5(name + password)
        try {

            const salt = (await super.post("/login", undefined, {username: name}).then(x => x.json())).salt
            const hash = md5(ownHash + salt);
            const res = await super.post("/login", undefined, {username: name, hash});
            if (res.status === 200) return {success: true, token : (await res.json()).token}
        } catch (e) {
            console.error("ERROR in isAuthorized", e);
        }
        return {success: false};
    }


}
