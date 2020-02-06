import {PermissionModel} from "../models/PermissionModel";
import {RoleModel} from "../models/RoleModel";
import {UserModel} from "../models/UserModel";
import {getRandomInt} from "../helpers/utils";
import {responseCodes} from "../helpers/constants";
import {RolePermissionsModel} from "../models/RolePermissionsModel";
import {encrypt} from "./encryption.service";


function preFillPermissions(): Promise<any> {
    return PermissionModel.bulkCreate([
        {name: 'view_all_roles', description: 'Can view all user roles'},
        {name: 'create_user_role', description: 'Can create new user role'},
        {name: 'update_user_role', description: 'Can update user role details'},
        {name: 'delete_user_role', description: 'Can delete user role details'},
        {name: 'view_user_accounts', description: 'Can view all users\' account'},
        {name: 'create_user_account', description: 'Can create new user account'},
        {name: 'update_user_account', description: 'Can update user account'},
        {name: 'delete_user_account', description: 'Can delete user account'},
    ])
}

async function preFillRoles(): Promise<any> {

    return RoleModel.bulkCreate([
        {
            name: 'admin',
            description: 'the overall admin account',
            author_id: 1,
            modified_by_id: 1,
        },
        {
            name: 'staff',
            description: '',
            author_id: 1,
            modified_by_id: 1,
        },
    ])
}

async function preFillRolePermissions() {
    const permissions = await PermissionModel.findAll({attributes: ['id']});
    const roles = await RoleModel.findAll({attributes: ['id', 'name']});
    const users = await UserModel.findAll({attributes: ['id']});

    let rolePerms;

    roles.forEach((role) => {

        if (role.name == 'admin') {
            rolePerms = permissions.map((perm) => {
                return {role_id: role.id, permission_id: perm.id, author_id: users[getRandomInt(0, users.length)]['id']}
            })
        } else {
            rolePerms = [{
                role_id: role.id,
                permission_id: permissions[getRandomInt(0, permissions.length)].id,
                author_id: users[getRandomInt(0, users.length)]['id']
            }]
        }
        RolePermissionsModel.bulkCreate(rolePerms);
    })
}

async function preFillUsers(): Promise<any> {
    const roles = await RoleModel.findAll({attributes: ['id']});

    return UserModel.bulkCreate([
        {
            first_name: 'James',
            last_name: 'Doe',
            role_id: roles[getRandomInt(0, roles.length)]['id'],
            email: 'jamesdoe@gmail.com',
            author_id: 1,
            modified_by_id: 1,
            user_auth: {
                username: 'james',
                password: encrypt('password'),
                author_id: 1,
                modified_by_id: 1
            }
        }
    ], {include: [{association: UserModel.authInfo}]})
}


export async function seed(): Promise<Response> {
    try {

        let res1 = await preFillPermissions();
        let res2 = await preFillRoles();
        let res3 = await preFillUsers();
        let res4 = await preFillRolePermissions();

        return {
            code: responseCodes.ok,
            message: 'Initialized successfully',
            results: [],
            success: true
        }
    } catch (e) {
        console.log(e);
        return {
            code: responseCodes.serverError,
            message: 'Unexpected error encountered. Check the logs for more info',
            results: [],
            success: false
        }
    }
}
