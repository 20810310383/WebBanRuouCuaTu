const TaiKhoan_KH = require("../models/TaiKhoan_KH")
const SanPham = require("../models/SanPham")
const LoaiSP = require("../models/LoaiSP")
const HoaDon = require("../models/HoaDon")
const aqp = require('api-query-params')


require('rootpath')();

const moment = require('moment-timezone');
//  --------------------------------------------

// Hàm chuyển đổi ngày giờ sang múi giờ Việt Nam
function convertToVietnamTime(dateTime) {
    // 'Asia/Ho_Chi_Minh' là mã của múi giờ Việt Nam
    return moment(dateTime).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
}

module.exports = { 
    getTrangQLDonHang_ChuaGiao_PhanTrang: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/ql-don-hang?page=${req.query.page}`)

        } else if (req.query.page_dangGH){
            return res.redirect(`/ql-don-hang?page_dangGH=${req.query.page_dangGH}`)

        } else if (req.query.page_daGH){
            return res.redirect(`/ql-don-hang?page_daGH=${req.query.page_daGH}`)

        } else {
            res.redirect(`/ql-don-hang`)
        }
    },

    getTrangQLDonHang: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn

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

        // hiển thị đơn hàng khi "Chưa giao hàng"
        let page = 1
        const limit = 3        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }        
        let skip = (page - 1) * limit
        const showHDChuaGiao = await HoaDon.find({TinhTrangDonHang: "Chưa giao hàng"}).skip(skip).limit(limit).populate("cart.items.productId").exec()
        
        let numPage = parseInt((await HoaDon.find({TinhTrangDonHang: "Chưa giao hàng"}).populate("cart.items.productId")).length) / limit
        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1

        const showHDChuaGiaoWithVietnamTime = showHDChuaGiao.map(item => ({
            ...item._doc,
            NgayLap: convertToVietnamTime(item.NgayLap)
        }));


        // hiển thị đơn hàng khi "Đang giao hàng"
        let page_dangGH = 1
        const limit_dangGH = 3        
        if(req.query.page_dangGH){
            page_dangGH = req.query.page_dangGH
            page_dangGH = page_dangGH < 1 ? page_dangGH + 1 : page_dangGH
        }        
        let skip_dangGH = (page_dangGH - 1) * limit_dangGH
        const showHDDangGiao = await HoaDon.find({TinhTrangDonHang: "Đang giao hàng"}).skip(skip_dangGH).limit(limit_dangGH).populate("cart.items.productId").exec()
        
        let numPage_dangGH = parseInt((await HoaDon.find({TinhTrangDonHang: "Đang giao hàng"}).populate("cart.items.productId")).length) / limit_dangGH
        numPage_dangGH = numPage_dangGH - parseInt(numPage_dangGH) === 0 ? numPage_dangGH : numPage_dangGH + 1

        const showHDDangGiaoWithVietnamTime = showHDDangGiao.map(item => ({
            ...item._doc,
            NgayLap: convertToVietnamTime(item.NgayLap)
        }));


        // hiển thị đơn hàng khi "Đã giao hàng"
        let page_daGH = 1
        const limit_daGH = 3        
        if(req.query.page_daGH){
            page_daGH = req.query.page_daGH
            page_daGH = page_daGH < 1 ? page_daGH + 1 : page_daGH
        }        
        let skip_daGH = (page_daGH - 1) * limit_daGH
        const showHDDaGiao = await HoaDon.find({TinhTrangDonHang: "Đã giao hàng", TinhTrangThanhToan: "Đã Thanh Toán"}).skip(skip_daGH).limit(limit_daGH).populate("cart.items.productId").exec()
        
        let numPage_daGH = parseInt((await HoaDon.find({TinhTrangDonHang: "Đã giao hàng", TinhTrangThanhToan: "Đã Thanh Toán"}).populate("cart.items.productId")).length) / limit_daGH
        numPage_daGH = numPage_daGH - parseInt(numPage_daGH) === 0 ? numPage_daGH : numPage_daGH + 1

        const showHDDaGiaoWithVietnamTime = showHDDaGiao.map(item => ({
            ...item._doc,
            NgayLap: convertToVietnamTime(item.NgayLap)
        }));

        res.render("User_Admin/QL_DonHang/quanLyDonHang.ejs", {
            soTrang: numPage, curPage: page, 
            soTrang_dangGH: numPage_dangGH, curPage_dangGH: page_dangGH, 
            soTrang_daGH: numPage_daGH, curPage_daGH: page_daGH, 
            logIn: loggedIn, 
            taikhoan,
            rootPath: '/', 
            formatCurrency: formatCurrency,
            getRelativeImagePath: getRelativeImagePath,
            showHDChuaGiao: showHDChuaGiaoWithVietnamTime,
            showHDDangGiao: showHDDangGiaoWithVietnamTime,
            showHDDaGiao: showHDDaGiaoWithVietnamTime,
        })
    },

    getEditDH: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn

        let idUpdate_HD = req.query.idUpdate_HD
        console.log("idUpdate_HD",idUpdate_HD);
        let getId = await HoaDon.findById({ _id: idUpdate_HD}).exec()
        console.log("getId",getId._id);

        res.render("User_Admin/QL_DonHang/formEditDH.ejs", {
            logIn: loggedIn, 
            taikhoan,
            getId
        })
    },

    postUpdate_QLDH: async (req, res) => {

        try {
            let id_QLDH = req.body.id_QLDH
            let TinhTrangDonHang = req.body.TinhTrangDonHang
            let TinhTrangThanhToan = req.body.TinhTrangThanhToan


            let updateDH = await HoaDon.findByIdAndUpdate( {_id: id_QLDH}, {
                TinhTrangDonHang, TinhTrangThanhToan
            })

            console.log("chinh sua updateDH: ", updateDH);
            
            // res.status(201).json({ success: true, message: 'Chỉnh sửa sản phẩm thành công' });
            res.redirect('/ql-don-hang'); 

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false,message: 'Internal server error' });
        } 
    },

}