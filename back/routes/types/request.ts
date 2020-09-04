import {Request} from "express";
import {Core} from "../../core/example/types";

interface Body<T> extends Request {
    body: T
}


