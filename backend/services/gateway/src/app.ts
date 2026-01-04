import express from 'express';
import proxy from 'express-http-proxy'
import { env } from './config/env';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json({
    limit: '50mb',
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));



//* Routes Gatway Proxy
app.use('/user', proxy(env.USER_SERVICE_URL));
app.use('/admin', proxy(env.ADMIN_SERVICE_URL));
app.use('/product', (req, res, next) => {
    //* Check if the request is a file upload
    const isFileUpload = req.headers['content-type']?.includes('multipart/form-data');
    proxy(env.PRODUCT_SERVICE_URL, {
        limit: '50mb',
        parseReqBody: !isFileUpload,
    })(req, res, next);
});
app.use('/order', proxy(env.ORDER_SERVICE_URL));
app.use('/activity', proxy(env.ACTIVITY_SERVICE_URL))



const PORT = env.PORT;

app.listen(PORT, () => {
    console.log(`Gateway is running on port ${PORT}`);
}); 