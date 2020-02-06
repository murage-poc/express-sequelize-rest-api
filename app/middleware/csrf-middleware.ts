import {uuid} from '../helpers/utils';
import {invalidCSRFToken, CSRFTokenNotFound} from "../controllers/error.controller";

let validCSRFTokens = [];
let nextValidToken;

export function generateCRFToken() {
    nextValidToken = uuid();
    validCSRFTokens.push(nextValidToken);
    return nextValidToken;
}


export function csrfMiddleware(req, resp, next) {
    let nextToken = generateCRFToken();
    //add the token to locals
    resp.locals = {...resp.locals, ...{XCSRFTOKEN: nextToken}};

    //check if url exempted from XCSRF token
    if (process.env.CSRF_EXEMPTED_ROUTES) {
        const routes: { method: string, url: string }[] = JSON.parse(process.env.CSRF_EXEMPTED_ROUTES);
        const matchingIndex = routes.findIndex((route) => {
            return req.method.trim().toLowerCase() === route.method.trim().toLowerCase() &&
                new RegExp(route.url.trim().replace(/^\/|\/$/g, '')).test(
                    req.path.trim().replace(/^\/|\/$/g, ''))
        });
        if (matchingIndex > -1) {
            return next();
        }

    }

    //check if valid token was provided, else invalidate the request.
    if (!req.body.XCSRFTOKEN && !req.headers.XCSRFTOKEN && !req.query.crsf_token) {
        return CSRFTokenNotFound(req, resp);
    }

    //Validate the CSRF
    if (!isValidCSRFToken(req.headers.XCSRFTOKEN || req.query.crsf_token || req.body.XCSRFTOKEN)) {
        return invalidCSRFToken(req, resp);
    }

    return next();
}

export function isValidCSRFToken(token) {
    let index = validCSRFTokens.findIndex((csrf) => {
        return csrf === token
    });
    if (index < 0) {
        return false
    }
    validCSRFTokens.splice(index, 1);
    return true;
}

