import {seqConnection} from "../../bootstrap/boot-sequelize"
import {DataTypes, Model, BelongsTo} from 'sequelize';

export class AuthModel extends Model {
    public id: number;
    public user_id: number;
    public username: string;
    public password: string;
    public author_id: number;
    static author: BelongsTo<AuthModel, UserModel>;
    static user: BelongsTo<AuthModel, UserModel>;
    static modifiedBy: BelongsTo<AuthModel, UserModel>;

}

AuthModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        unique: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {isEmail: true}
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
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
    tableName: 'user_auth',
    modelName: 'user_auth',
    underscored: true
});


import {UserModel} from "./UserModel";

AuthModel.user = AuthModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    targetKey: 'id',
    as: 'user',
});

AuthModel.author = AuthModel.belongsTo(UserModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});

AuthModel.modifiedBy = AuthModel.belongsTo(UserModel, {
    as: 'modifiedBy',
    foreignKey: 'modified_by_id',
    targetKey: 'id'
});
