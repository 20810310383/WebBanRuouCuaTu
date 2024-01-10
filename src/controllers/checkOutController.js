const SanPham = require("../models/SanPham")
const Cart = require("../models/Cart")
const HoaDon = require("../models/HoaDon")
const mongoose = require('mongoose');
require('rootpath')();
const nodemailer = require('nodemailer');
require('dotenv').config();

// --------------------------------------

module.exports = {   
    hienThiFormCheckOut: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.taikhoan
        let loggedIn = sessions.loggedIn

        // Hàm để định dạng số tiền thành chuỗi có ký tự VND
        function formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        }

        const customerAccountId = req.session.userId;
        let detailCart = await Cart.findOne({MaTKKH: customerAccountId}).exec();
        let cartItemss = detailCart.cart 

        res.render("layouts/checkout.ejs", {
            formatCurrency: formatCurrency, 
            logIn: loggedIn, 
            taikhoan, 
            detailCart,
            cartItemss: cartItemss,
        })
    },

    handleDatHang: async (req, res) => {
        try{
            let HoTen = req.body.HoTen
            let QuocGia = req.body.QuocGia
            let ThanhPho = req.body.ThanhPho
            let DiaChi_ChiTiet = req.body.DiaChi_ChiTiet
            let SoDienThoai = req.body.SoDienThoai
            let Email = req.body.Email
            let TongSLDat = req.body.TongSLDat
            let PhiShip = req.body.PhiShip
            let GiamGia = req.body.GiamGia
            let TongTien = req.body.TongTien

            //---- GỬI XÁC NHẬN ĐƠN HÀNG VỀ EMAIL
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASS
                }
            });
              
            const sendOrderConfirmationEmail = async (toEmail) => {
                const mailOptions = {
                    from: 'Khắc Tú',
                    to: toEmail,
                    subject: 'Xác nhận đơn hàng của bạn.',
                    html: `
                            <p style="color: navy; font-size: 20px;">Cảm ơn bạn <span style="color: black; font-weight: bold; font-style: italic;">${HoTen} </span>đã đặt hàng!!</p>
                            <p style="color: green; font-style: italic;">Đơn hàng của bạn đã được xác nhận.</p>
                            <p>Tổng số lượng đặt: ${TongSLDat}</p>
                            <p>Phí giao hàng: <span style="color: red;">${PhiShip}</span></p>
                            <p>Thành tiền cần thanh toán: <span style="color: red;">${TongTien}</span></p>
                            <p>Link Website của tôi: <a href="https://liquor-dokhactu.onrender.com">https://liquor-dokhactu.onrender.com</a></p>
                        `
                    // text: `Cảm ơn bạn ${HoTen} đã đặt hàng!!\nĐơn hàng của bạn đã được xác nhận.\nTổng số lượng đặt : ${TongSLDat}\nPhí giao hàng: ${PhiShip}\nThành tiền cần thanh toán: ${TongTien}\nLink web của tôi: https://liquor-dokhactu.onrender.com`                        
                };
              
                return new Promise((resolve, reject) => {
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            reject(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                            resolve();
                        }
                    });
                });
            };
            //-------------
    
            // Chuyển đổi từ chuỗi sang số
            const giaTriSo_PhiShip = parseInt(PhiShip.replace(/[^0-9]/g, ''));
            const giaTriSo_GiamGia = parseInt(GiamGia.replace(/[^0-9]/g, ''));
            const giaTriSo_TongTien = parseInt(TongTien.replace(/[^0-9]/g, ''));
    
            const customerAccountId = req.session.userId;
            console.log(">>> check id customerAccountId checkout: ", customerAccountId);

            // --------------------------------------
            let idcanxoa = await Cart.findOne({MaTKKH: customerAccountId})    
            let cartId = idcanxoa._id
            let giohang = await Cart.findById(cartId).populate('cart.items.productId')
            console.log(">>> check giohang:",giohang);

            const cartItems = giohang.cart.items
            const cartTongTien = giohang.cart.totalPrice
            const cartTongSL = giohang.cart.totalQuaty
            
            console.log(" cartItems: ", cartItems, 
            "\n cartTongTien: ", cartTongTien,
            "\n cartTongSL: ", cartTongSL);
    
            let datHang = await HoaDon.create({
                HoTen: HoTen,
                QuocGia: QuocGia,
                ThanhPho: ThanhPho,
                DiaChi_ChiTiet: DiaChi_ChiTiet,
                SoDienThoai: SoDienThoai,
                Email: Email,
                TongSLDat: TongSLDat,
                PhiShip: giaTriSo_PhiShip,
                GiamGia: giaTriSo_GiamGia,
                TongTien: giaTriSo_TongTien,
                MaKH: customerAccountId,
                cart: {
                    items: cartItems.map(item => ({
                        productId: item.productId._id,
                        qty: item.qty
                    })),
                    totalPrice: cartTongTien,
                    totalQuaty: cartTongSL,
                }
            })                
                        
            if(datHang){
                // Gửi email thông báo đặt hàng thành công
                await sendOrderConfirmationEmail(Email);

                // khi login thì sẽ có giỏ hàng khi add, khi dat hang thanh cong đi sẽ xóa luôn trong db đi
                await Cart.deleteOne({_id: idcanxoa._id});
                
                // Nếu có giỏ hàng, xóa giỏ hàng
                req.session.cartId = null;

                let cart = new Cart({
                    cart: {
                        items: [],
                        totalPrice: 0,
                        totalQuaty: 0,
                    },
                    MaTKKH: customerAccountId,
                });
                await cart.save()


                res.status(201).json({ success: true, message: 'Bạn Đã Đặt Hàng Thành Công' });
            }else {
                console.log("dat hang that bai");
                res.status(500).json({ success: false, message: 'Đặt Hàng thất bại' });
            }
        }catch (error) {
            console.error("Error during order handling:", error);
            res.status(500).json({ success: false, message: 'Đặt Hàng thất bại' });
        }        
    },
}