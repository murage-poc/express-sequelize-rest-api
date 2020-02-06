import {seqConnection} from "../../bootstrap/boot-sequelize"
import {DataTypes, Model, BelongsTo} from 'sequelize';


export class RolePermissionsModel extends Model {
    public id: number;
    public role_id: number;
    public permission_id: number;
    public author_id: number;
    static author: BelongsTo<RolePermissionsModel, UserModel>;
}

RolePermissionsModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    permission_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    author_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    sequelize: seqConnection,
    modelName: 'role_permission',
    tableName: 'role_permissions',
    underscored: true

});

import {UserModel} from "./UserModel";

RolePermissionsModel.author = RolePermissionsModel.belongsTo(UserModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});
