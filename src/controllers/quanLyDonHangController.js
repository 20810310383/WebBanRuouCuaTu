const TaiKhoan_Admin = require("../models/TaiKhoan_Admin")
const TaiKhoan_KH = require("../models/TaiKhoan_KH")
const SanPham = require("../models/SanPham")
const LoaiSP = require("../models/LoaiSP")
const aqp = require('api-query-params')

const {uploadSingleFile} = require('../services/fileService')
const {
    createSanPhamService,

    } = require('../services/sanPhamService')
require('rootpath')();

//  --------------------------------------------

module.exports = { 
    getTrangQLDonHang: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn
        
        console.log(sessions);
        console.log(taikhoan);
        console.log(loggedIn);

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

        res.render("User_Admin/QL_DonHang/quanLyDonHang.ejs", {
            logIn: loggedIn, 
            taikhoan,
            rootPath: '/', 
            formatCurrency: formatCurrency,
            getRelativeImagePath: getRelativeImagePath,

        })
    },
}