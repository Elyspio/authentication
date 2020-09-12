import {BodyParams, Controller, Cookies, Delete, Get, Post, Res} from "@tsed/common";
import {Login} from "./types/request";
import {logger} from "../util/logger";
import {Core} from "../core/account/account";
import {Forbidden} from "@tsed/exceptions"
import {authorization_cookie_name, token_expiration} from '../config/accounts';
import * as Express from "express";

@Controller("/authentication")
export class Authentication {

    @Get("/")
    async get() {
        return {users: Core.Account.users}
    }


    @Post("/login")
    async login(@Cookies() cookies: any, @BodyParams() {name, hash}: Login["body"], @Res() res: Express.Response) {


        if (cookies[authorization_cookie_name]) {
            logger.info("cookies", {cookies: cookies})

            return {token: cookies[authorization_cookie_name], comment: "already logged in"};
        } else {
            if (hash) {

                const {token, authorized} = await Core.Account.verify({name: name, hash: hash})

                if (authorized && token) {
                    // httpOnly = false pour pouvoir les utiliser dans le JS
                    res.cookie(authorization_cookie_name, token, {httpOnly: false, expires: new Date(Date.now() + token_expiration)}).json({token})
                } else {
                    throw new Forbidden("Token required")
                }

            } else {

                const salt = await Core.Account.init(name)

                return ({salt})
            }
        }

    }


    @Post("/valid")
    async validToken(@BodyParams("token") token: string, @Cookies(authorization_cookie_name) token_cookie) {

        if (!token && token_cookie) {
            token = token_cookie;
        }

        if (!await Core.Account.Token.validate(token)) {
            throw new Forbidden("Invalid token");
        }

    }

    @Delete("/valid")
    async deleteToken(@BodyParams("user") user: string) {
        await Core.Account.Token.del(user);
    }
}
