const SanPham = require("../models/SanPham")
const Cart = require("../models/Cart")
require('rootpath')();

const aqp = require('api-query-params')

// --------------------------------------

module.exports = {
    chiTietSP: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.taikhoan
        // let loggedIn = sessions.loggedIn
        let loggedIn = req.session.loggedIn ? true : false;        

        let id = req.query.idCTSP

        let ctsp = await SanPham.findById({_id: id}).exec();

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
        
        

        res.render("layouts/chiTietSP.ejs", {
            CTSP: ctsp, 
            formatCurrency: formatCurrency, 
            rootPath: '/', 
            getRelativeImagePath: getRelativeImagePath,
            logIn: loggedIn, 
            taikhoan, 

        })
        
    },    

}