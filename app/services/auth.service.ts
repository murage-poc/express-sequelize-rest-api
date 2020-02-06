import {Request} from "express-serve-static-core";
import {responseCodes} from "../helpers/constants";
import {AuthModel} from "../models/AuthModel";
import {UserModel} from "../models/UserModel";
import {RoleModel} from "../models/RoleModel";
import {verifyPassword} from "./encryption.service";
import {allocateJWTToken} from "../middleware/auth-middleware";

const {Validator, Rule} = require("@cesium133/forgjs");

export async function authenticate(req: Request): Promise<Response> {
    //validate user data first
    const validator = new Validator({
        username: new Rule({type: 'string'}, 'Username is required'),
        password: new Rule({type: 'string'}, 'Password is required'),
    });

    let errors = validator.getErrors(req.body);

    if (errors && errors.length > 0) {
        return {
            code: responseCodes.invalidData,
            message: 'Invalid username/password. Kindly try again',
            results: errors,
            success: false
        }
    }

    const res = await AuthModel.findOne({
        where: {username: req.body.username},
        include: [{
            association: AuthModel.user,
            attributes: ['id', 'first_name', 'last_name'],
            include: [
                {
                    association: UserModel.role, attributes: ['name'],
                    include: [{association: RoleModel.permissions, attributes: ['id', 'name']}]
                }
            ]
        }]
    });

    // if no user was found
    if (!res) {
        return {
            code: responseCodes.ok,
            message: 'Invalid username/password. Kindly try again',
            success: false,
            results: []
        }
    }

    const user: User = {
        id: res.user.id,
        name: `${res.user.first_name} ${res.user.last_name}`,
        role: {id: res.user.role.id, name: res.user.role.name},
        permissions: res.user.role.permissions.map((permission) => {
            return {
                id: permission.id,
                name: permission.name
            }
        })
    };

    // check if password match, send response with token
    const jwtToken = await allocateJWTToken({user});

    if (verifyPassword(req.body.password, res.password)) {
        if (!jwtToken || !jwtToken.success) {
            return {
                code: responseCodes.serverError,
                message: 'System encountered an error',
                success: false,
                results: jwtToken.result
            }
        }
        return {
            code: responseCodes.ok,
            message: 'Authenticated successfully',
            success: true,
            results: {access_token: jwtToken.result}
        }
    }

    return {
        code: responseCodes.ok,
        message: 'Invalid username/password. Kindly try again',
        success: false,
        results: []
    }
}

