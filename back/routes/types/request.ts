import {Request} from "express";


// @ts-ignore
interface Uri<Query, Body> extends Request {
    body: Body,
    query: Query
}

type User = {
    username: string
}


export type Login = Uri<{}, User & {
    hash?: string
}>

export type IsValid = Uri<{}, User & {
    username: string
    token: string
}>

export type DeleteToken = Uri<{}, User>


export type Clientify<U extends Uri<any, any>> = { body: U["body"], query: U["query"] }



