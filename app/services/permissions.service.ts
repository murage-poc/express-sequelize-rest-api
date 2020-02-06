import {PermissionModel} from "../models/PermissionModel";
import {responseCodes} from "../helpers/constants";

export async function fetchAllPermissions(): Promise<Response> {
    const permissions = await PermissionModel.findAll();
    return {
        code: responseCodes.ok,
        success: true,
        results: permissions,
        message: 'ok'
    }
}

export async function fetchPermission(id): Promise<Response> {
    if (isNaN(id)) {
        return {
            code: responseCodes.notfound,
            results: null,
            message: 'Invalid permission identifier',
            success: false
        }
    }
    const permission = await PermissionModel.findByPk(id);
    if (!permission) {
        return {
            code: responseCodes.notfound,
            success: false,
            results: null,
            message: 'Permission with similar ID not found'
        }
    }
    return {
        code: responseCodes.ok,
        success: true,
        results: permission,
        message: ''
    }
}
