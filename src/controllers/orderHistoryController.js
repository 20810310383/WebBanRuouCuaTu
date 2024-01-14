const SanPham = require("../models/SanPham")
const Cart = require("../models/Cart")
const HoaDon = require("../models/HoaDon")
const mongoose = require('mongoose');
require('rootpath')();
const nodemailer = require('nodemailer');
require('dotenv').config();

const moment = require('moment-timezone');
const HuyDonHang = require("../models/HuyDonHang");
//  --------------------------------------------


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
        const customerAccountId = req.session.userId;
        console.log("customerAccountId: ",customerAccountId);

        let soLuongDH = await HoaDon.find({MaKH: customerAccountId})
        console.log("tong hoa don: ", soLuongDH.length);
        let tongTienHD = soLuongDH.map(item => item.TongTien || 0).reduce((acc, TongTien) => acc + TongTien, 0);
        console.log("Tổng giá của tất cả hóa đơn: ", tongTienHD);

        let all = await HoaDon.find({MaKH: customerAccountId}).populate('cart.items.productId')
        let chuaGiao = await HoaDon.find({MaKH: customerAccountId, TinhTrangDonHang: 'Chưa giao hàng'}).populate('cart.items.productId')
        let dangGiao = await HoaDon.find({MaKH: customerAccountId, TinhTrangDonHang: 'Đang giao hàng'}).populate('cart.items.productId')
        let daGiao = await HoaDon.find({MaKH: customerAccountId, TinhTrangDonHang: 'Đã giao hàng'}).populate('cart.items.productId')
        let daHuy = await HuyDonHang.find({MaKH: customerAccountId}).populate('cart.items.productId')



        res.render("layouts/OrderHistory/orderHistory.ejs", {
            rootPath: '/',
            formatCurrency, 
            getRelativeImagePath,
            logIn: loggedIn, 
            hoten, diachi,
            soLuongDH, tongTienHD,
            all, chuaGiao, dangGiao, daGiao, daHuy

        })
    },

    getChiTietHD: async (req, res) => {
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
        const customerAccountId = req.session.userId;
        console.log("customerAccountId: ",customerAccountId);

        let soLuongDH = await HoaDon.find({MaKH: customerAccountId})
        console.log("tong hoa don: ", soLuongDH.length);
        let tongTienHD = soLuongDH.map(item => item.TongTien || 0).reduce((acc, TongTien) => acc + TongTien, 0);
        console.log("Tổng giá của tất cả hóa đơn: ", tongTienHD);

        let xemcthd = req.query.xemcthd
        let chitietHD = await HoaDon.findById(xemcthd).populate('cart.items.productId')        

        
        // convert ngày giờ theo VN
        function convertToVietnamTime(utcDateString) {
            const options = {
                timeZone: 'Asia/Ho_Chi_Minh', // Set the time zone to Vietnam
                hour12: false, // Use 24-hour format
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            };
        
            const utcDate = new Date(utcDateString);
            const vietnamTime = utcDate.toLocaleString('en-US', options);
            
            return vietnamTime;
        }

        res.render("layouts/OrderHistory/chiTietHD.ejs", {
            rootPath: '/',
            formatCurrency, 
            getRelativeImagePath,
            logIn: loggedIn, 
            hoten, diachi,
            soLuongDH, tongTienHD,
            convertToVietnamTime,
            cthd: chitietHD
        })
    },

    huyDonHang: async (req, res) => {

        let id_huydonhang = req.query.huydonhang
        console.log("id huy don hang: ",id_huydonhang);

        let timHDCanHuy = await HoaDon.findOne({_id: id_huydonhang})
        let luuHuyHD = await HuyDonHang.create({
            HoTen: timHDCanHuy.HoTen,
            QuocGia: timHDCanHuy.QuocGia,
            ThanhPho: timHDCanHuy.ThanhPho,
            DiaChi_ChiTiet: timHDCanHuy.DiaChi_ChiTiet,
            SoDienThoai: timHDCanHuy.SoDienThoai,
            Email: timHDCanHuy.Email,
            PhiSanPham: timHDCanHuy.PhiSanPham,
            TinhTrangDonHang: timHDCanHuy.TinhTrangDonHang,
            TinhTrangThanhToan: timHDCanHuy.TinhTrangThanhToan,
            NgayLap: timHDCanHuy.NgayLap,
            TongSLDat: timHDCanHuy.TongSLDat,
            PhiShip: timHDCanHuy.PhiShip,
            GiamGia: timHDCanHuy.GiamGia,
            TongTien: timHDCanHuy.TongTien,
            MaKH: timHDCanHuy.MaKH,
            cart: timHDCanHuy.cart
        })

        if(luuHuyHD){
            await HoaDon.deleteOne({_id: id_huydonhang});
            res.redirect("/order-history")
            res.status(201).json({ success: true, message: 'Bạn Đã Hủy Đơn Hàng Thành Công' });
        } else {
            res.status(500).json({ success: false, message: 'Hủy Đơn Hàng thất bại' });
        }
    },

    getChiTietHDDaHuy: async (req, res) => {
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
        const customerAccountId = req.session.userId;
        console.log("customerAccountId: ",customerAccountId);

        let soLuongDH = await HoaDon.find({MaKH: customerAccountId})
        console.log("tong hoa don: ", soLuongDH.length);
        let tongTienHD = soLuongDH.map(item => item.TongTien || 0).reduce((acc, TongTien) => acc + TongTien, 0);
        console.log("Tổng giá của tất cả hóa đơn: ", tongTienHD);

        let xemchitiet_HDon_DaHuy = req.query.xemchitiet_HDon_DaHuy
        let chitietHDDaHuy = await HuyDonHang.findById(xemchitiet_HDon_DaHuy).populate('cart.items.productId')        

        
        // convert ngày giờ theo VN
        function convertToVietnamTime(utcDateString) {
            const options = {
                timeZone: 'Asia/Ho_Chi_Minh', // Set the time zone to Vietnam
                hour12: false, // Use 24-hour format
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            };
        
            const utcDate = new Date(utcDateString);
            const vietnamTime = utcDate.toLocaleString('en-US', options);
            
            return vietnamTime;
        }

        res.render("layouts/OrderHistory/chiTietHD_DaHuy.ejs", {
            rootPath: '/',
            formatCurrency, 
            getRelativeImagePath,
            logIn: loggedIn, 
            hoten, diachi,
            soLuongDH, tongTienHD,
            convertToVietnamTime,
            chitietHDDaHuy
        })
    },
}