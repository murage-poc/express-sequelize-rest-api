import {sendHTTPJSONResponse} from "../helpers/utils";
import {authenticate} from "../services/auth.service";

export class SessionController {

    static login(req,resp){
        sendHTTPJSONResponse(resp,authenticate(req))
    }

}
