const TaiKhoan_KH = require("../models/TaiKhoan_KH")

const moment = require('moment-timezone');
//  --------------------------------------------

// Hàm chuyển đổi ngày giờ sang múi giờ Việt Nam
function convertToVietnamTime(dateTime) {
    // 'Asia/Ho_Chi_Minh' là mã của múi giờ Việt Nam
    return moment(dateTime).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
}

module.exports = {

    getHomePhanTrang_TKKH: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/home-qltk-kh?page=${req.query.page}`)
        }
        res.redirect(`/home-qltk-kh`)
    },

    getHomeQL_TKKH: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn        

        let page = 1
        const limit = 6
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }
        
        let skip = (page - 1) * limit
        const allTKKH = await TaiKhoan_KH.find({}).skip(skip).limit(limit).exec()

        // Chuyển đổi ngày giờ tạo tài khoản admin sang múi giờ Việt Nam
        const allTKKhachHangnWithVietnamTime = allTKKH.map(item => ({
            ...item._doc,
            NgayTao: convertToVietnamTime(item.NgayTao)
        }));

        // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
        let numPage = parseInt((await TaiKhoan_KH.find({})).length) / limit

        // kiểm tra xem phần thập phân của numPage có bằng 0 hay không
        // Nếu bằng 0, nghĩa là numPage là một số nguyên, không cần phải thêm một trang nữa
        // Ngược lại, nếu có phần thập phân, nó thêm một trang nữa để đảm bảo rằng tất cả các sản phẩm được hiển thị.
        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1                

        res.render("User_Admin/QL_taikhoan_KH/homeQLTaiKhoanKH.ejs", {
            soTrang: numPage, 
            curPage: page, 
            logIn: loggedIn, 
            taikhoan,            
            QLtaikhoan_kh: allTKKhachHangnWithVietnamTime,
        })
    },

    gethomeSearchQL_TKKH: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/searchQL_TKKH?page=${req.query.page}`)
        }
        res.redirect(`/searchQl_TKKH`)
    },

    getSearchQL_TKKH: async (req, res) => {
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
        let tenSPSearch = req.query.searchKH
        const timKiemTaiKhoanKH = await TaiKhoan_KH.find({ TenDangNhap: { $regex: new RegExp(tenSPSearch, 'i') } }).skip(skip).limit(limit).exec();

        // Chuyển đổi ngày giờ tạo tài khoản admin sang múi giờ Việt Nam
        const allTKKHWithVietnamTime = timKiemTaiKhoanKH.map(item => ({
            ...item._doc,
            NgayTao: convertToVietnamTime(item.NgayTao)
        }));

        if (!timKiemTaiKhoanKH) {
            // Nếu không tìm thấy sản phẩm
            return res.status(404).send("Không tìm thấy tài khoản.");
        }

        // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
        let numPage = parseInt((await TaiKhoan_KH.find({ TenDangNhap: { $regex: new RegExp(tenSPSearch, 'i') } })).length) / limit

        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1        
        
        res.render("User_Admin/QL_taikhoan_KH/searchTaiKhoanKH.ejs", {
            soTrang: numPage, 
            curPage: page, 
            logIn: loggedIn, 
            taikhoan,            
            timKiemTaiKhoanKH: allTKKHWithVietnamTime

        })
    },

    remove_TKKH: async (req, res) => {
        try {
            let idRemove = req.body.idRemove_kh;                
      
            // Sử dụng deleteById để xóa sản phẩm theo id
            const xoaTKKH = await TaiKhoan_KH.findByIdAndDelete(idRemove);

            // Kiểm tra xem tai khoan admin đã được xóa thành công hay không
            if (xoaTKKH) {
                // res.status(200).json({ message: 'Xóa thành công.' });
                res.redirect('/home-qltk-kh'); 
            } else {
                res.status(404).send("Không tìm thấy tài khoản để xóa.");
            }
      
        } catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    hienThiFormUpdate_TKKH: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn

        let idUpdate_kh = req.query.idUpdate_kh
        console.log("idUpdate_kh",idUpdate_kh);
        let getId = await TaiKhoan_KH.findById({ _id: idUpdate_kh}).exec()
        console.log("getId",getId._id);

                
        res.render("User_Admin/QL_taikhoan_KH/updateTaiKhoanKH.ejs", {
            logIn: loggedIn, 
            taikhoan,
            getId
        })
    },

    postUpdate_TKKH: async (req, res) => {

        try {
            let id = req.body.idupdateKH
            let TenDangNhap = req.body.TenDangNhap
            let MatKhau = req.body.MatKhau
            let HoTen = req.body.HoTen   

            let tkUpdateKH = await TaiKhoan_KH.findByIdAndUpdate( {_id: id}, {
                TenDangNhap, MatKhau, HoTen
            })

            console.log("chinh sua tkUpdateKH: ", tkUpdateKH);
            
            // res.status(201).json({ success: true, message: 'Chỉnh sửa sản phẩm thành công' });
            res.redirect('/home-qltk-kh'); 

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false,message: 'Internal server error' });
        } 
    },
}