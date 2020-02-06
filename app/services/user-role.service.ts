import {Request} from "express-serve-static-core";
import {RoleModel} from "../models/RoleModel";
import {PermissionModel} from "../models/PermissionModel";
import {UserModel} from "../models/UserModel";
import {responseCodes} from "../helpers/constants";
import {getCurrentUser} from "../helpers/utils";
import {RolePermissionsModel} from "../models/RolePermissionsModel";

const {Validator, Rule} = require("@cesium133/forgjs");

export async function fetchAllRoles(): Promise<Response> {
    let roles = await RoleModel.findAll({
        include: [
            {model: PermissionModel, through: {attributes: []}},
            {model: UserModel, as: 'author', attributes: ['id', 'first_name', 'last_name']}
        ]
    });

    return {
        code: 200,
        results: roles,
        success: true,
        message: ''
    }
}

export async function fetchRole(id): Promise<Response> {
    if (isNaN(id)) {
        return {
            code: responseCodes.notfound,
            results: null,
            message: 'Invalid role identifier',
            success: false
        }
    }
    const role = await RoleModel.findByPk(id, {
        include: [
            {model: PermissionModel, through: {attributes: []}},
            {model: UserModel, as: 'author', attributes: ['id', 'first_name', 'last_name']}
        ]
    });
    if (!role) {
        return {
            code: responseCodes.notfound,
            results: null,
            message: 'Role with specified id not found',
            success: false
        }
    }
    return {
        code: 200,
        results: role,
        success: true,
        message: 'ok'
    }
}

export async function createRole(req: Request): Promise<Response> {
    const existingPermissions: PermissionModel[] = await PermissionModel.findAll();

    const validator = new Validator({
        permissions: new Rule({
            type: 'array',
            notEmpty: true,
            of: new Rule({
                type: 'int',
                oneOf: existingPermissions.map((obj) => obj.id)
            }, 'selection permission does not exist'),
        }, 'Invalid permissions provided'),

        name: new Rule({type: 'string'}, 'role name is required'),
        description: new Rule({type: 'string'})
    });

    let errors = validator.getErrors(req.body);
    if (errors && errors.length > 0) {

        return {
            code: responseCodes.invalidData,
            message: 'Invalid request data. Try again',
            results: errors,
            success: false
        }
    }

    const role = await RoleModel.create({
        name: req.body.name,
        description: req.body.description,
        author_id: getCurrentUser(req).id,
        modified_by_id: getCurrentUser(req).id,
        role_permissions: req.body.permissions.map((perm) => {
            return {
                permission_id: perm,
                author_id: getCurrentUser(req).id
            }
        })
    }, {include: [RoleModel.permissionsAlloc, RoleModel.permissions]})
        .catch((error) => {
            return {
                success: false,
                code: responseCodes.processError,
                message: 'Role not created',
                results: error.errors.map((err) => err.message)
            }
        });

    if (!role || (role.code && role.results)) {
        return role;
    }


    const mappedRole = {
        id: role.id,
        name: role.name,
        description: role.description,
        author_id: role.author_id,
        modified_by_id: role.modified_by_id,
        createdAt: role.createdAt,
        updatedAt: role.createdAt,
        permissions: existingPermissions
            .filter((perm) => req.body.permissions.findIndex((d) => d == perm.id) > -1)
    };


    return {
        code: responseCodes.created,
        message: 'Role created successfully',
        results: mappedRole,
        success: true
    };
}

export async function updateRole(req: Request): Promise<Response> {
    //validate first
    const existingPermissions = await PermissionModel.findAll({attributes: ['id']}).map((obj) => obj.id);

    const validator = new Validator({
        permissions: new Rule({
            type: 'array',
            optional: true,
            of: new Rule({
                type: 'int',
                oneOf: existingPermissions
            }, 'selection permission does not exist'),
        }, 'Invalid permissions provided'),

        name: new Rule({type: 'string|int', optional: true}, 'role name is required'),
        description: new Rule({type: 'string', optional: false})
    });

    let errors = validator.getErrors(req.body);
    if (errors && errors.length > 0) {

        return {
            code: responseCodes.invalidData,
            message: 'Invalid request data. Try again',
            results: errors,
            success: false
        }
    }


    let resp = await RoleModel.update({
        name: req.body.name,
        description: req.body.description,
        modified_by_id: getCurrentUser(req).id,
    }, {where: {id: req.params.id}}).catch(() => {
        return {
            code: responseCodes.processError,
            message: 'Internal server error encountered. Role could not be updated',
            success: false,
            results: []
        }
    });

    if (resp == 0) {
        return {
            code: responseCodes.notfound,
            message: 'Role not found',
            success: false,
            results: []
        };
    }

    if (resp.code && resp.results) {
        return resp;
    }


    //update the permissions allocated to the role if available
    if (!req.body.permissions) {
        return roleUpdatedResponse;
    }

    let re = await RolePermissionsModel.destroy({where: {role_id: req.params.id}})
        .catch(() => {
            return {
                code: responseCodes.processError,
                message: 'Internal server error encountered. Role permissions could not be updated',
                success: false,
                results: []
            }
        });

    if (re.code && re.results) {
        return re;
    }

    let fin = RolePermissionsModel.bulkCreate(req.body.permissions.map((perm) => {
        return {
            role_id: req.params.id,
            permission_id: perm,
            author_id: getCurrentUser(req).id
        }
    })).catch(() => {
        return {
            code: responseCodes.processError,
            message: 'Permissions could not be updated. Fatal internal system error encountered',
            success: false,
            results: []
        }
    });

    if (fin.code && fin.results) {
        return fin;
    }

    return roleUpdatedResponse;

}

export async function deleteRole(id): Promise<Response> {
    if (isNaN(id)) {
        return {
            code: responseCodes.notfound,
            results: null,
            message: 'Invalid role identifier',
            success: false
        }
    }
    const resp = await RoleModel.destroy({where: {id}, force: true}) //returns 1 if deleted, 0 if not found
        .catch(() => {
            return {
                code: responseCodes.processError,
                message: 'Role cannot be deleted. Some users have already been allocated this role.',
                success: false,
                results: []
            }
        });

    if (resp == 0) {
        return {
            code: responseCodes.notfound,
            message: 'Role not found',
            success: false,
            results: []
        };
    }

    if (resp && !resp.results) {
        return {
            results: [],
            success: true,
            message: 'Role deleted successfully',
            code: responseCodes.ok
        }
    }
}

const roleUpdatedResponse: Response = {
    results: [],
    success: true,
    message: 'Role updated successfully',
    code: responseCodes.ok
};
