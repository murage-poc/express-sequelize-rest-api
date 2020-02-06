import {seqConnection} from "../../bootstrap/boot-sequelize"
import {BelongsToMany, DataTypes, HasMany, BelongsTo, Model} from 'sequelize';


export class RoleModel extends Model {
    public id: number;
    public name: string;
    public description?: string;
    public author_id: number;
    static permissions: BelongsToMany<RoleModel, PermissionModel>;
    static author: BelongsTo<RoleModel, UserModel>;
    static users: HasMany<RoleModel, UserModel>;
    static permissionsAlloc: HasMany<RoleModel, RolePermissionsModel>;
    static modifiedBy: BelongsTo<RoleModel, UserModel>;

}

RoleModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    author_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    modified_by_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    sequelize: seqConnection,
    tableName: 'roles',
    modelName: 'role',
    underscored: true
});

import {UserModel} from "./UserModel";

RoleModel.users = RoleModel.hasMany(UserModel, {
    foreignKey: 'role_id',
    sourceKey: 'id',
    as: 'users',
    constraints: false
});

RoleModel.author = RoleModel.belongsTo(UserModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id',
    constraints: false
});

RoleModel.modifiedBy = RoleModel.belongsTo(UserModel, {
    as: 'modifiedBy',
    foreignKey: 'modified_by_id',
    targetKey: 'id',
    constraints: false
});


import {RolePermissionsModel} from "./RolePermissionsModel";

RoleModel.permissionsAlloc = RoleModel.hasMany(RolePermissionsModel, {
    foreignKey: 'role_id',
    sourceKey: 'id',
});

import {PermissionModel} from "./PermissionModel";

RoleModel.permissions = RoleModel.belongsToMany(PermissionModel, {
    through: RolePermissionsModel,
    foreignKey: 'role_id',
    constraints: false
});
