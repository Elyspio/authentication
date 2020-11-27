import {$log, BodyParams, Controller, Cookies, Delete, Get, Post, Req, Res} from "@tsed/common";
import {Core} from "../core/authentication/authentication";
import {Unauthorized,} from "@tsed/exceptions"
import {authorization_cookie_name, token_expiration} from '../config/authentication';
import * as Express from "express";
import {Returns} from "@tsed/schema";
import {PostLoginInitRequest, PostLoginModel, PostLoginModelWithSalt, PostLoginRequest} from "./models";
import * as dayjs from "dayjs"
@Controller("/authentication")
export class Authentication {

    @Get("/")
    async get() {
        return {users: Core.Account.users}
    }


    @Post("/login")
    @Returns(200, PostLoginModel)
    @Returns(Unauthorized.STATUS, Unauthorized)
    async login(@Cookies() cookies: any, @BodyParams() {
        hash,
        name
    }: PostLoginRequest, @Res() res: Express.Response) {


        $log.info("cookies", cookies);


        if (cookies[authorization_cookie_name]) {
            $log.info("cookies", {cookies: cookies})
            return {token: cookies[authorization_cookie_name], comment: "already logged in"};
        } else {
            const {token, authorized} = await Core.Account.verify({name: name, hash: hash})

            if (authorized && token) {
                // httpOnly = false pour pouvoir les utiliser dans le JS
                res.cookie(authorization_cookie_name, token, {expires: dayjs().add(15, "day").toDate()})
                    .json({token})

            } else {
                throw new Unauthorized("Token required")
            }
        }

    }

    @Post("/login/init")
    @Returns(200, PostLoginModelWithSalt)
    @Returns(Unauthorized.STATUS, Unauthorized)
    async loginInit(@Cookies() cookies: any, @BodyParams() {name}: PostLoginInitRequest) {

        $log.info("cookies", cookies);

        if (cookies[authorization_cookie_name]) {
            $log.info("cookies", {cookies: cookies})

            return {token: cookies[authorization_cookie_name], comment: "already logged in"};
        } else {
            const ret = new PostLoginModelWithSalt();
            ret.salt = await Core.Account.init(name)
            return ret
        }
    }


    @Post("/valid")
    @Returns(204)
    @Returns(Unauthorized.STATUS, Unauthorized)
    async validToken(@BodyParams("token") token: string, @Cookies(authorization_cookie_name) token_cookie) {

        $log.info("cookies", token_cookie);

        if (!token && token_cookie) {
            token = token_cookie;
        }

        if (!await Core.Account.Token.validate(token)) {
            throw new Unauthorized("Invalid token");
        }

    }

    @Delete("/valid")
    @Returns(204)
    async deleteToken(@BodyParams("user") user: string) {
        await Core.Account.Token.del(user);
    }
}
