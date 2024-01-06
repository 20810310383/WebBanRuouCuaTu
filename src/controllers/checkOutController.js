const SanPham = require("../models/SanPham")
const Cart = require("../models/Cart")
const HoaDon = require("../models/HoaDon")
const mongoose = require('mongoose');
require('rootpath')();

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
}