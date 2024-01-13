const SanPham = require("../models/SanPham")
const Cart = require("../models/Cart")
const HoaDon = require("../models/HoaDon")
const mongoose = require('mongoose');
require('rootpath')();
const nodemailer = require('nodemailer');
require('dotenv').config();

// --------------------------------------

module.exports = {
    hienThiFormHistoryOrder: async (req, res) => {
        var sessions = req.session;
        let loggedIn = sessions.loggedIn
        let hoten = sessions.hoten
        let diachi = sessions.diachi

        // Hàm để định dạng số tiền thành chuỗi có ký tự VND
        function formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        }

        // edit file img
        function getRelativeImagePath(absolutePath) {
            const rootPath = '<%= rootPath.replace(/\\/g, "\\\\") %>';
            const relativePath = absolutePath ? absolutePath.replace(rootPath, '').replace(/\\/g, '/').replace(/^\/?images\/upload\//, '') : '';
            return relativePath;
        }



        res.render("layouts/OrderHistory/orderHistory.ejs", {
            rootPath: '/',
            formatCurrency, 
            getRelativeImagePath,
            logIn: loggedIn, 
            hoten, diachi,
        })
    },
}