import {AuthenticationApi} from "./core";
import {getApiPath} from "../config/api";

export const Apis ={
    authentication: new AuthenticationApi({basePath: getApiPath()})
}