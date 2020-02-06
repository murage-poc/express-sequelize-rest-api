import {sendHTTPJSONResponse} from "../helpers/utils";
import {ParamsDictionary, Response, Request} from "express-serve-static-core";
import {
    createUserAccount,
    deleteUserAccount,
    fetchAllUsers,
    fetchUser,
    updateUserAccount
} from "../services/users.service";

export class UserController {

    static index(req, resp) {
        sendHTTPJSONResponse(resp, fetchAllUsers())
    }

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchUser(req.params.id))
    }

    static store(req: Request, resp) {
        sendHTTPJSONResponse(resp, createUserAccount(req))
    }

    static update(req: Request, resp) {
        sendHTTPJSONResponse(resp, updateUserAccount(req));
    }

    static destroy(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, deleteUserAccount(req));
    }
}
