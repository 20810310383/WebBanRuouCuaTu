require('dotenv').config();
const express = require('express')
const configViewEngine = require('./config/viewEngine');
const homeRoutes = require('./routes/homeRouter');
const homeAPIRoutes = require('./routes/homeAPI');

const connection = require('./config/database');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { MongoClient } = require('mongodb');
const cookieParser = require("cookie-parser");
const session = require('express-session');

const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

// default options
app.use(fileUpload());
configViewEngine(app);

const oneDay = 1000 * 60 * 60 * 24;     // lưu phiên trong 1 ngày
app.use(session({
    secret: 'secret-key',  // Chuỗi bí mật để mã hóa phiên
    saveUninitialized: true,
    cookie: { 
        maxAge: oneDay, 
    },     // đặt thời gian hết hạn của cookie
    resave: true  
}));
app.use(cookieParser());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// khai bao route
app.use('/', homeRoutes);
app.use('/api/v1/', homeAPIRoutes);


//test connection
(async () => {
    try {
        // using mongoose
        await connection()

        app.listen(port, hostname, () => {
            console.log(`http://localhost:${port}`)
        })
    } catch(error) {
        console.log(">>> LỖI RỒI CỤ: ", error);
    }  
})();
// app.listen(port, hostname, () => {
//     console.log(`ĐÃ CHẠY ...   >>>  http://localhost:${port}`)
// })



