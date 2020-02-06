import {responseCodes} from "./constants";
import {Request} from "express-serve-static-core";

export function sendHTTPJSONResponse(resp, data: Promise<Response>) {
    if (!data) {
        return resp
            .header('XCSRFTOKEN', resp.locals['XCSRFTOKEN'])
            .status(responseCodes.serverError)
            .send({message: 'unexpected error encountered'})
    }

    Promise.resolve(data).then((rs) => {
        resp.header('XCSRFTOKEN', resp.locals['XCSRFTOKEN'])
            .status(rs && rs.code ? rs.code : responseCodes.ok)
            .send(rs)
    }).catch((error) => {
            resp.header('XCSRFTOKEN', resp.locals['XCSRFTOKEN'])
                .status(error && error.code ? error.code : responseCodes.unknownError)
                .send(error);
        }
    );
}


export function uuid(splitBy = '') {
    let lut = [];
    for (let i = 0; i < 256; i++) {
        lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
    }
    let d0 = Math.random() * 0xffffffff | 0;
    let d1 = Math.random() * 0xffffffff | 0;
    let d2 = Math.random() * 0xffffffff | 0;
    let d3 = Math.random() * 0xffffffff | 0;
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + splitBy +
        lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + splitBy + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + splitBy +
        lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + splitBy + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
        lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


export function getCurrentUser(req: Request): User {
    return req.app.locals.user;
}
