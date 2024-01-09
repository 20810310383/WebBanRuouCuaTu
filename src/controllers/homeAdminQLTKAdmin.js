const TaiKhoan_Admin = require("../models/TaiKhoan_Admin")
const aqp = require('api-query-params')
const {
    createTaiKhoanAdminService

    } = require('../services/sanPhamService')

const moment = require('moment-timezone');
//  --------------------------------------------

// Hàm chuyển đổi ngày giờ sang múi giờ Việt Nam
function convertToVietnamTime(dateTime) {
    // 'Asia/Ho_Chi_Minh' là mã của múi giờ Việt Nam
    return moment(dateTime).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
}

module.exports = {

    getHomePhanTrang_TKAdmin: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/home-qltk-admin?page=${req.query.page}`)
        }
        res.redirect(`/home-qltk-admin`)
    },

    getHomeQL_TKAdmin: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn        

        let page = 1
        const limit = 3
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }
        
        let skip = (page - 1) * limit
        const allTKAdmin = await TaiKhoan_Admin.find({}).skip(skip).limit(limit).exec()

        // Chuyển đổi ngày giờ tạo tài khoản admin sang múi giờ Việt Nam
        const allTKAdminWithVietnamTime = allTKAdmin.map(item => ({
            ...item._doc,
            NgayTao: convertToVietnamTime(item.NgayTao)
        }));

        // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
        let numPage = parseInt((await TaiKhoan_Admin.find({})).length) / limit

        // kiểm tra xem phần thập phân của numPage có bằng 0 hay không
        // Nếu bằng 0, nghĩa là numPage là một số nguyên, không cần phải thêm một trang nữa
        // Ngược lại, nếu có phần thập phân, nó thêm một trang nữa để đảm bảo rằng tất cả các sản phẩm được hiển thị.
        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1                

        res.render("User_Admin/QL_taikhoan_Admin/homeQLTaiKhoanAdmin.ejs", {
            soTrang: numPage, 
            curPage: page, 
            logIn: loggedIn, 
            taikhoan,            
            QLtaikhoan_admin: allTKAdminWithVietnamTime,
        })
    },

    gethomeSearchQL_TKAdmin: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/searchQL_TKAdmin?page=${req.query.page}`)
        }
        res.redirect(`/searchQl_TKAdmin`)
    },

    getSearchQL_TKAdmin: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn
        
        let page = 1
        const limit = 3
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }
        
        let skip = (page - 1) * limit
        let tenSPSearch = req.query.searchAdmin
        const timKiemTaiKhoanAdmin = await TaiKhoan_Admin.find({ TenDangNhap: { $regex: new RegExp(tenSPSearch, 'i') } }).skip(skip).limit(limit).exec();

        // Chuyển đổi ngày giờ tạo tài khoản admin sang múi giờ Việt Nam
        const allTKAdminWithVietnamTime = timKiemTaiKhoanAdmin.map(item => ({
            ...item._doc,
            NgayTao: convertToVietnamTime(item.NgayTao)
        }));

        if (!timKiemTaiKhoanAdmin) {
            // Nếu không tìm thấy sản phẩm
            return res.status(404).send("Không tìm thấy tài khoản.");
        }

        // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
        let numPage = parseInt((await TaiKhoan_Admin.find({ TenDangNhap: { $regex: new RegExp(tenSPSearch, 'i') } })).length) / limit

        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1        
        
        res.render("User_Admin/QL_taikhoan_Admin/searchTaiKhoanAdmin.ejs", {
            soTrang: numPage, 
            curPage: page, 
            logIn: loggedIn, 
            taikhoan,            
            timKiemTaiKhoanAdmin: allTKAdminWithVietnamTime

        })
    },

    remove_TKAdmin: async (req, res) => {
        try {
            let idRemove = req.body.idRemove_admin;                
      
            // Sử dụng deleteById để xóa sản phẩm theo id
            const xoaTKAdmin = await TaiKhoan_Admin.findByIdAndDelete(idRemove);

            // Kiểm tra xem tai khoan admin đã được xóa thành công hay không
            if (xoaTKAdmin) {
                // res.status(200).json({ message: 'Xóa thành công.' });
                res.redirect('/home-qltk-admin'); 
            } else {
                res.status(404).send("Không tìm thấy tài khoản để xóa.");
            }
      
        } catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    hienThiFormCreate_TKAdmin: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn
                
        res.render("User_Admin/QL_taikhoan_Admin/createTaiKhoanAdmin.ejs", {
            logIn: loggedIn, 
            taikhoan,
        })
    },

    postCreate_TKAdmin: async (req, res) => {

        try {            
            let TenDangNhap = req.body.TenDangNhap
            let MatKhau = req.body.MatKhau
            let HoTen = req.body.HoTen        


            let TKAdminData = {
                TenDangNhap, MatKhau, HoTen
            }

            let SP = await createTaiKhoanAdminService(TKAdminData)
            
            // res.status(201).json({ success: true, message: 'Thêm thành công' });
            res.redirect('/home-qltk-admin'); 

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false,message: 'Internal server error' });
        } 
    },

    hienThiFormUpdate_TKAdmin: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn

        let idUpdate_admin = req.query.idUpdate_admin
        console.log("idUpdateSp",idUpdate_admin);
        let getId = await TaiKhoan_Admin.findById({ _id: idUpdate_admin}).exec()
        console.log("getId",getId._id);

                
        res.render("User_Admin/QL_taikhoan_Admin/updateTaiKhoanAdmin.ejs", {
            logIn: loggedIn, 
            taikhoan,
            getId: getId
        })
    },

    postUpdate_TKAdmin: async (req, res) => {

        try {
            let id = req.body.idupdateadmin
            let TenDangNhap = req.body.TenDangNhap
            let MatKhau = req.body.MatKhau
            let HoTen = req.body.HoTen   

            let tkUpdateAdmin = await TaiKhoan_Admin.findByIdAndUpdate( {_id: id}, {
                TenDangNhap, MatKhau, HoTen
            })

            console.log("chinh sua tkUpdateAdmin: ", tkUpdateAdmin);
            
            // res.status(201).json({ success: true, message: 'Chỉnh sửa sản phẩm thành công' });
            res.redirect('/home-qltk-admin'); 

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false,message: 'Internal server error' });
        } 
    },
}