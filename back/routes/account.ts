import {Router} from "express";
import {DeleteToken, IsValid, Login} from "./types/request";
import {Core} from "../core/account/account";

export const router = Router();


router.post("/login", async (req: Login, res) => {
    if (req.body.hash) {

        const {token, authorized} = await Core.Account.verify({name: req.body.username, hash: req.body.hash},)

        if (authorized && token) {
            res.cookie("authorisation_token", token, {httpOnly: true, expires: new Date(Date.now() + 900000)}).json({token})
        } else {
            res.sendStatus(403)
        }

    } else {

        const salt = await Core.Account.init(req.body.username)

        res.json({
            salt
        })
    }

})

router.post("/valid", async (req: IsValid, res) => {

    const status = await Core.Account.Token.validate({token: req.body.token, name: req.body.username}) ? 200 : 403
    res.sendStatus(status);
})

router.delete("/valid", async (req: DeleteToken, res) => {
    await Core.Account.Token.del(req.body.username);
    res.sendStatus(200);
})
