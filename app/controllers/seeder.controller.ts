import {sendHTTPJSONResponse} from "../helpers/utils";
import {seed} from "../services/initial-seeder.service";

export class SeederController {

    static seed(req,resp){
        sendHTTPJSONResponse(resp,seed())
    }

}
