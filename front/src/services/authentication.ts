import md5 from "md5"
import {Apis} from "../api";

export class AuthenticationService {

    public async isAuthorized({name, password}: { name: string, password: string }): Promise<{
        success: boolean,
        token?: string
    }> {
        const ownHash = md5(name + password)
        try {

            const salt = (await Apis.authentication.authenticationLoginInit({name: name})).data.salt
            const hash = md5(ownHash + salt);
            console.log({salt, ownHash, hash})
            const res = (await Apis.authentication.authenticationLogin({name: name, hash}));
            if (res.status === 200) return {success: true, token: res.data.token}
        } catch (e) {
            console.error("ERROR in isAuthorized", e);
        }
        return {success: false};
    }

    public async isValid() {
        let success = false
        try {
            const res = await Apis.authentication.authenticationValidToken();
            success = res.status >= 200 && res.status < 300
        } catch (e) {
        }
        return {success};
    }

}
