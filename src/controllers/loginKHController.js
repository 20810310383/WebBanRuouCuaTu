const TaiKhoan_KH = require("../models/TaiKhoan_KH")
const Cart = require("../models/Cart")
const aqp = require('api-query-params')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//  --------------------------------------------

module.exports = {
    homeLoginKH: (req, res) => {

        res.render("User_KH/form_loginKH.ejs")
    },

    dangKyKH: async (req, res) => {
        try {
            let TenDangNhap = req.body.account
            let HoTen = req.body.name
            let DiaChi = req.body.address
            let SDT = req.body.phone
            let Email = req.body.email
            let MatKhau = req.body.pass
            

            console.log("TenDangNhap: ", TenDangNhap);
            console.log("MatKhau: ", MatKhau);
            console.log("HoTen: ", HoTen);
            console.log("DiaChi: ", DiaChi);
            console.log("SDT: ", SDT);
            console.log("Email: ", Email);
        
            // Check if the username is already taken
            const kt = await TaiKhoan_KH.findOne({ TenDangNhap:TenDangNhap });
            if (kt) {
                // return res.status(400).json({ message: 'Tài Khoản Đã Tồn Tại' });
                return res.status(400).json({ success: false, message: 'Tài Khoản Đã Tồn Tại' });
                // return res.status(400).send("Tài Khoản Đã Tồn Tại")
            }
        
            if (!MatKhau) {
                return res.status(400).json({ message: 'Invalid password' });
            }                        

            // Create a new user
            let newUser = await TaiKhoan_KH.create({
                TenDangNhap,
                MatKhau,
                HoTen,
                DiaChi,
                SDT,
                Email
            });
        
            return res.status(201).json({ success: true, message: 'Đăng ký tài khoản thành công' });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false,message: 'Internal server error' });
        }        
    },

    dangNhapKH: async (req, res) => {
        try {
            let taikhoan = req.body.taikhoan
            let matkhau = req.body.matkhau
            var sessions

            if (req.session.cartId) {

                // khi login thì sẽ có giỏ hàng khi add, khi logout đi sẽ xóa luôn trong db đi
                // await Cart.findByIdAndDelete(req.session.cartId);
                await Cart.deleteById(req.session.cartId);

                // Nếu có giỏ hàng, xóa giỏ hàng
                req.session.cartId = null;
            }
      
            // Check if the user exists
            const user = await TaiKhoan_KH.findOne({ TenDangNhap: taikhoan, MatKhau: matkhau });
            if (!user) {
                return res.status(401).send("<span style=\"color: red; font-weight: bold;\">sai tài khoản or mật khẩu.</span>");
            }                      

            req.session.loggedIn = true
            req.session.taikhoan = taikhoan
            req.session.userId = user._id
            req.user = { _id: user._id };

            sessions=req.session
            console.log("sessions:",sessions)

            let cart;
            if (user) {
                // Nếu đã đăng nhập, kiểm tra xem có giỏ hàng trong database không
                cart = await Cart.findOne({ 'MaTKKH': user._id });

                if (!cart) {
                    cart = new Cart({
                        cart: {
                            items: [],
                            totalPrice: 0,
                            totalQuaty: 0,
                        },
                        MaTKKH: user._id,
                    });
                    await cart.save();
                }

                // Đặt thông tin giỏ hàng trong phiên
                req.session.cartId = cart._id;
            }

            // let cart = await Cart.findOne({ 'cart.MaTKKH': user._id })
            // if (!cart) {
            //     cart = new Cart({ 
            //         cart: { 
            //                 items: [], 
            //                 totalPrice: 0, 
            //                 totalQuaty: 0 
            //             },
            //             MaTKKH: user._id,
            //             })
            //     await cart.save()
            // }                   
            // // Set the cart information in the session
            // req.session.cartId = cart._id

            console.log("user: ", user)            
        
            res.redirect(`/`);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    getLogoutKH: async (req, res) => {

        // if (req.session.taikhoan) {
        //     // Kiểm tra xem có giỏ hàng trong session hay không
        //     if (req.session.cartId) {

        //         // khi login thì sẽ có giỏ hàng khi add, khi logout đi sẽ xóa luôn trong db đi
        //         // await Cart.findByIdAndDelete(req.session.cartId);
        //         await Cart.deleteById(req.session.cartId);

        //         // Nếu có giỏ hàng, xóa giỏ hàng
        //         req.session.cartId = null;
        //     }
        //     req.session.destroy();
        // }
        // res.redirect("/")

        if (req.session.taikhoan) {
            req.session.destroy();
        }
        res.redirect("/")

    },
}