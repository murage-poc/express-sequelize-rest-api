import * as express from "express";
import * as path from 'path';

import {bootstrap} from './bootstrap/app';

//!IMPORTANT :load the environment config first before importing other user custom modules
bootstrap();

import apiRouter from "./routes/api-main";
import webRoutes from "./routes/web-main";
import {validateJWTTokenMiddleware} from './app/middleware/auth-middleware'


const port = process.env.PORT || 3000;
const app = express();


//Middleware definitions
app.disable('x-powered-by');
app.use(express.json()); //form data to json
app.use(express.urlencoded({extended: true})); //support for multiform data

app.use(express.static(path.join(__dirname, 'public')));

app.use(validateJWTTokenMiddleware); // Token Authentication middleware

//router definition
app.use('/api/v1', apiRouter); // API endpoint
app.use('/web', webRoutes); // web endpoints


//launch the server
app.listen(port, () => {
    console.log(`server running at port ${port}`);
});
