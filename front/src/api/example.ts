import {Interactor} from "./Interactor";
import {Core} from "../../../back/core/example/types";
import {getApiPath} from "../config/api";


export class HaproxyApi extends Interactor {

    private static _instance: HaproxyApi = new HaproxyApi(getApiPath("core"));

    public static get instance() {
        return this._instance;
    }

    public async getConfig(): Promise<Core.Config> {
        return await super.get("/test").then(x => x.json())
    }

 


}
