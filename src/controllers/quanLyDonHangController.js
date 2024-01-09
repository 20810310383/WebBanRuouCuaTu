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

        let showHDChuaGiao = await HoaDon.find({TinhTrangDonHang: "Chưa giao hàng"}).populate("cart.items.productId")

        // Chuyển đổi ngày giờ tạo tài khoản admin sang múi giờ Việt Nam
        const showHDChuaGiaoWithVietnamTime = showHDChuaGiao.map(item => ({
            ...item._doc,
            NgayLap: convertToVietnamTime(item.NgayLap)
        }));

        console.log(">> check showHD: ", showHDChuaGiao);
        // for (let i = 0; i < showHD.length; i++) {
        //     let hoaDon = showHD[i];
        //     if (hoaDon.cart && hoaDon.cart.items) {
        //         let ttSPDaDat = hoaDon.cart.items;
        //         console.log(">> check showHD: ", ttSPDaDat);
        //     } else {
        //         console.log(">> Không có dữ liệu về sản phẩm đã đặt cho đơn hàng thứ", i + 1);
        //     }
        // }


        res.render("User_Admin/QL_DonHang/quanLyDonHang.ejs", {
            logIn: loggedIn, 
            taikhoan,
            rootPath: '/', 
            formatCurrency: formatCurrency,
            getRelativeImagePath: getRelativeImagePath,
            showHDChuaGiao: showHDChuaGiaoWithVietnamTime,
        })
    },

}