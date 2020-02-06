import {sendHTTPJSONResponse} from "../helpers/utils";
import {fetchAllPermissions, fetchPermission} from "../services/permissions.service";
import {ParamsDictionary, Response, Request} from "express-serve-static-core";

export class PermissionController {
    static index(req, resp) {
        sendHTTPJSONResponse(resp, fetchAllPermissions())
    }

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchPermission(req.params.id))

    }
}
