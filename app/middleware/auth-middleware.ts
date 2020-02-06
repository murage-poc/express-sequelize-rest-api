import * as jwt from 'jsonwebtoken';

import {notAuthenticated, authorizationHeaderNotReceived} from "../controllers/error.controller";

export function validateJWTTokenMiddleware(req, resp, next) {

    if (pathExemptedAuthorization(req.path, req.method)) {
        return next();
    }
    let headers = req.headers;
    if (!headers) {
        return authorizationHeaderNotReceived(req, resp);
    }
    let bearerHeader = headers.authorization || headers.Authorization;
    if (!bearerHeader) {
        return authorizationHeaderNotReceived(req, resp);
    }


    const access_token = bearerHeader.split(' ')[1];

    /**
     * verify if token is valid
     * */
    jwt.verify(access_token, process.env.JWT_KEY, (err, data) => {
        if (err) {
            return notAuthenticated(req, resp);
        }
        //add the user data to request app locals object
        req.app.locals = {...req.app.locals, ...data, ...{access_token}};
        return next();
    });


}

export function pathExemptedAuthorization(path: String, method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'BATCH' | 'OPTIONS' | 'DELETE') {
    if (process.env.AUTH_EXEMPTED_ROUTES) {
        const routes: { method: string, url: string }[] = JSON.parse(process.env.AUTH_EXEMPTED_ROUTES);
        const matchingIndex = routes.findIndex((route) => {
            return method.trim().toLowerCase() === route.method.trim().toLowerCase() &&
                new RegExp(route.url).test(path.trim().replace(/^\/|\/$/g, ''))
        });

        return matchingIndex > -1;

    }
    return false;
}

export function allocateJWTToken(payloadToEncode: object): Promise<{ success: boolean, result: string }> {
    return new Promise((resolve, reject) => {
        jwt.sign(payloadToEncode, process.env.JWT_KEY, {expiresIn: '1hr'}, (err, token) => {
            if (err) {
                reject({success: true, result: `Error generating authentication token`});
                return
            }
            resolve({success: true, result: token});
        })
    })

}
