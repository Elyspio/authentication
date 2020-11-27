import {AuthenticationApi} from "./core";
import {getApiPath} from "../config/api";
import {default as axios,} from "axios"

const instance = axios.create({withCredentials: true,})


export const Apis = {
    authentication: new AuthenticationApi({basePath: getApiPath(), baseOptions: {}}, getApiPath(), instance)
}
