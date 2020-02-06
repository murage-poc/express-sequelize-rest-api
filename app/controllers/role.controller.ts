import {sendHTTPJSONResponse} from "../helpers/utils";
import {createRole, deleteRole, fetchAllRoles, fetchRole, updateRole} from "../services/user-role.service";
import {ParamsDictionary, Response, Request} from "express-serve-static-core";

export class RoleController {
    static index(req, resp) {
        sendHTTPJSONResponse(resp, fetchAllRoles())
    }

    static show(req: Request, resp) {
        sendHTTPJSONResponse(resp, fetchRole(req.params.id))
    }

    static store(req, resp) {
        sendHTTPJSONResponse(resp, createRole(req))
    }

    static update(req: Request<ParamsDictionary, any, any>, resp: Response<any>) {
        sendHTTPJSONResponse(resp, updateRole(req))

    }

    static destroy(req: Request<ParamsDictionary, any, any>, resp: Response<any>) {
        sendHTTPJSONResponse(resp, deleteRole(req.params.id))
    }
}
