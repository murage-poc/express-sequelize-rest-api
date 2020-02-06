import {sendHTTPJSONResponse} from "../helpers/utils";
import {responseCodes} from "../helpers/constants";

export function apiRouteNotFound(req, resp) {
    sendHTTPJSONResponse(resp, Promise.resolve({
        results: [],
        message: 'Request path not found',
        code: responseCodes.notfound,
        success: false,
    }));
}

export function authorizationHeaderNotReceived(req, resp) {
    sendHTTPJSONResponse(resp, Promise.resolve({
        results: [],
        message: 'Authorization headers not received by server',
        code: responseCodes.unauthorized,
        success: false,
    }));
}

export function notAuthenticated(req, resp) {
    sendHTTPJSONResponse(resp, Promise.resolve({
        results: [],
        message: 'Authorization rejected.Token invalid',
        code: responseCodes.forbidden,
        success: false,
    }));
}

export function authTokenGeneration(req, resp) {
    sendHTTPJSONResponse(resp, Promise.resolve({
        results: [],
        message: 'Error generating authentication token',
        code: responseCodes.serverError,
        success: false,
    }));
}

export function CSRFTokenNotFound(req, resp) {
    sendHTTPJSONResponse(resp, Promise.resolve({
        results: [],
        message: 'CSRF token missing.  Kindly reload and try again',
        code: responseCodes.invalidCRSF,
        success: false,
    }));
}

export function invalidCSRFToken(req, resp) {
    sendHTTPJSONResponse(resp, Promise.resolve({
        results: [],
        message: 'Invalid CSRF token. Page session expired. Kindly reload and try again',
        code: responseCodes.invalidCRSF,
        success: false,
    }));
}

export function webRouteNotFound(req, resp) {
    sendHTTPJSONResponse(resp, Promise.resolve({
        results: [],
        message: 'Request page not found. Replace this with 404 page',
        code: responseCodes.notfound,
        success: false,
    }));
}
