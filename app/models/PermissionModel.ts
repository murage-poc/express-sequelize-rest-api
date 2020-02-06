import {seqConnection} from "../../bootstrap/boot-sequelize"
import {BelongsToMany, DataTypes, HasMany, Model} from 'sequelize';

export class PermissionModel extends Model {
    public id: number;
    public name: string;
    public description?: string;
    static rolesAllocation: HasMany<PermissionModel, RolePermissionsModel>;
    static roles: BelongsToMany<PermissionModel, RoleModel>;

}

PermissionModel.init({
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
}, {
    sequelize: seqConnection,
    tableName: 'permissions',
    modelName: 'permission',
    underscored: true
});


import {RolePermissionsModel} from "./RolePermissionsModel";

PermissionModel.rolesAllocation = PermissionModel.hasMany(RolePermissionsModel, {
    foreignKey: 'permission_id',
    sourceKey: 'id',
});


import {RoleModel} from "./RoleModel";

PermissionModel.roles = PermissionModel.belongsToMany(RoleModel, {
    through: RolePermissionsModel,
    foreignKey: 'permission_id',
    sourceKey: 'id'
});

