import {seqConnection} from "../../bootstrap/boot-sequelize"
import {DataTypes, Model, BelongsTo, HasOne} from 'sequelize';

export class UserModel extends Model {
    public id: number;
    public first_name: string;
    public last_name: string;
    public role_id: number;
    public email: string;
    public author_id: number;
    static role: BelongsTo<UserModel, RoleModel>;
    static author: BelongsTo<UserModel, UserModel>;
    static authInfo: HasOne<UserModel, AuthModel>;
    static modifiedBy: BelongsTo<UserModel, UserModel>;

}

UserModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
    tableName: 'users',
    modelName: 'users',
    underscored: true,
});


import {RoleModel} from "./RoleModel";

UserModel.role = UserModel.belongsTo(RoleModel, {
    foreignKey: 'role_id',
    targetKey: 'id',
});

import {AuthModel} from "./AuthModel";

UserModel.authInfo = UserModel.hasOne(AuthModel, {
    foreignKey: 'user_id',
    sourceKey: 'id',
});

UserModel.author = UserModel.belongsTo(UserModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});

UserModel.modifiedBy = UserModel.belongsTo(UserModel, {
    as: 'modifiedBy',
    foreignKey: 'modified_by_id',
    targetKey: 'id'
});
