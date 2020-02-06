import {Router} from "express";
import * as path from "path";
import {webRouteNotFound} from "../app/controllers/error.controller";

const router = Router();

router.get('', (req, resp) => {
    resp.sendFile(path.join(__dirname, '../../', 'public/index.html'));
});

router.route('*').all((req, res) => webRouteNotFound(req, res));

export default router;
