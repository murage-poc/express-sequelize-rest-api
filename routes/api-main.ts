import {Router} from "express";
import {apiRouteNotFound} from "../app/controllers/error.controller";
import {UserController} from "../app/controllers/user.controller";
import {SessionController} from "../app/controllers/session.controller";
import {PermissionController} from "../app/controllers/permission.controller";
import {RoleController} from "../app/controllers/role.controller";
import {SeederController} from "../app/controllers/seeder.controller";

const router = Router(); // instantiate the router object

router.route('/system/init')
    .post((req, res) => SeederController.seed(req, res));

router.route('/session/login')
    .post((req, res) => SessionController.login(req, res));


router.route('/permissions/:id')
    .get((req, res) => PermissionController.show(req, res));

router.route('/permissions')
    .get((req, res) => PermissionController.index(req, res));


router.route('/roles/:id')
    .get((req, res) => RoleController.show(req, res))
    .patch((req, res) => RoleController.update(req, res))
    .delete(((req, res) => RoleController.destroy(req, res)));

router.route('/roles')
    .get((req, res) => RoleController.index(req, res))
    .post((req, res) => RoleController.store(req, res));


router.route('/users/:id')
    .get((req, res) => UserController.show(req, res))
    .patch((req, res) => UserController.update(req, res))
    .delete((req, res) => UserController.destroy(req, res));

router.route('/users')
    .get((req, res) => UserController.index(req, res))
    .post((req, res) => UserController.store(req, res));


//ERROR  routes
router.route('*').all((req, res) => apiRouteNotFound(req, res));


export default router;
