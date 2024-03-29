const express = require('express');
const {
    getHomePage,
    home,    
    

} = require("../controllers/homeController")

const {
    chiTietSP,
    
} = require("../controllers/chiTietSPController")

const {
    homeSearch,
    trangSanPham,
    trangSearchLoaiSanPham,
    homeSearchLoaiSanPham,

    
} = require("../controllers/trangSP_TimKiemController")

const {
    menuTypesProduct,


} = require("../controllers/typesProductController")

const {
    homeLoginKH,
    dangKyKH,
    dangNhapKH,
    getLogoutKH

} = require("../controllers/loginKHController")

const {
    homeLoginAdmin,
    dangKyAdmin,
    dangNhapAdmin,
    getLogoutAdmin

} = require("../controllers/loginAdminController")

const {
    getHomeAdmin,
    getHomeQLSP,
    getHomePhanTrang,
    getSearchQLSP,
    gethomeSearchQLSP,
    removeSP,
    hienThiFormCreateSP,
    postCreateSP,
    hienThiFormUpdateSP,
    postUpdateSP

} = require("../controllers/homeAdminQLSPController")

const {
    addToCart,
    getCartInfo,
    getCTCart,
    removeACTCart,
    getEditSLCart,
    updateSL_Mot_SPTrongCart,
    
} = require("../controllers/addToCartController")

const {
    getHomePhanTrang_TKAdmin,
    getHomeQL_TKAdmin,
    gethomeSearchQL_TKAdmin,
    getSearchQL_TKAdmin,
    remove_TKAdmin,
    hienThiFormCreate_TKAdmin,
    postCreate_TKAdmin,
    hienThiFormUpdate_TKAdmin,
    postUpdate_TKAdmin

} = require("../controllers/homeAdminQLTKAdmin")

const {
    hienThiFormCheckOut,
    handleDatHang

} = require("../controllers/checkOutController")

const {
    getTrangQLDonHang,
    getTrangQLDonHang_ChuaGiao_PhanTrang,
    getEditDH,
    postUpdate_QLDH,
    postDeleteDH,


} = require("../controllers/quanLyDonHangController");

const { 
    getHomeQL_TKKH, 
    getHomePhanTrang_TKKH, 
    getSearchQL_TKKH, 
    gethomeSearchQL_TKKH, 
    remove_TKKH, 
    hienThiFormUpdate_TKKH, 
    postUpdate_TKKH 
} = require('../controllers/homeAdminQLTK_KHController');
const { hienThiFormHistoryOrder, getChiTietHD, huyDonHang, getChiTietHDDaHuy } = require('../controllers/orderHistoryController');

const router = express.Router();
//  -------------------------------------------

// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/", home)
router.get("/home", getHomePage)


// ctiet SP
router.get("/ctsp", chiTietSP)
// search san pham
// form tim kiem san pham
router.get("/search-sp", trangSanPham)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/search-sp", homeSearch)
// tim kiem theo loai sp
router.get("/search-sp1", trangSearchLoaiSanPham)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/search-sp1", homeSearchLoaiSanPham)


// form login/dk KH
router.get("/loginKH", homeLoginKH)
// dang ky tk kh
router.post("/dang-ky", dangKyKH)
// dang nhap tk kh
router.post("/dang-nhap", dangNhapKH)
// dang xuat tk
router.get("/dang-xuat-kh", getLogoutKH)


// form login/dk Admin
router.get("/loginAdmin", homeLoginAdmin)
// dang ky tk kh
router.post("/dang-ky-admin", dangKyAdmin)
// dang nhap tk kh
router.post("/dang-nhap-admin", dangNhapAdmin)
// dang xuat tk
router.get("/dang-xuat-admin", getLogoutAdmin)


// get home admin
router.get("/gethomeAdmin", getHomeAdmin)


// qlsp phia admin
router.get("/home-qlsp", getHomeQLSP)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/home-qlsp", getHomePhanTrang)
// form search qlsp
router.get("/searchQlsp", getSearchQLSP)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/searchQlsp", gethomeSearchQLSP)
// xoa san pham
router.post("/delete-sp", removeSP)
// hien thi form create sp
router.get("/create-sp", hienThiFormCreateSP)
// insert san pham
router.post("/create-sp", postCreateSP)
// hien thi form update sp
router.get("/update-sp", hienThiFormUpdateSP)
// update san pham
router.post("/update-sp", postUpdateSP)



// quan ly tai khoan admin
router.get("/home-qltk-admin", getHomeQL_TKAdmin)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/home-qltk-admin", getHomePhanTrang_TKAdmin)
// form search quan ly tai khoan admin
router.get("/searchQL_TKAdmin", getSearchQL_TKAdmin)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/searchQL_TKAdmin", gethomeSearchQL_TKAdmin)
// xoa tai khoan admin
router.post("/delete-taikhoan-admin", remove_TKAdmin)
// hien thi form create tai khoan admin
router.get("/create-taikhoan-admin", hienThiFormCreate_TKAdmin)
// insert tai khoan admin
router.post("/create-taikhoan-admin", postCreate_TKAdmin)
// hien thi form update tai khoan admin
router.get("/update-taikhoan-admin", hienThiFormUpdate_TKAdmin)
// update tai khoan admin
router.post("/update-taikhoan-admin", postUpdate_TKAdmin)



// ---- quan ly tai khoan khach hang
router.get("/home-qltk-kh", getHomeQL_TKKH)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/home-qltk-kh", getHomePhanTrang_TKKH)
// form search quan ly tai khoan khach hang
router.get("/searchQL_TKKH", getSearchQL_TKKH)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/searchQL_TKKH", gethomeSearchQL_TKKH)
// xoa tai khoan khach hang
router.post("/delete-taikhoan-kh", remove_TKKH)
// hien thi form update tai khoan khach hang
router.get("/update-taikhoan-kh", hienThiFormUpdate_TKKH)
// update tai khoan khach hang
router.post("/update-taikhoan-kh", postUpdate_TKKH)



// quan ly don hang -- admin
router.get("/ql-don-hang", getTrangQLDonHang)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/ql-don-hang", getTrangQLDonHang_ChuaGiao_PhanTrang)
// get form edit don hang
router.get("/update-HoaDon", getEditDH)
// update don hang
router.post("/update-HoaDon", postUpdate_QLDH)
// update don hang da giao hang
router.post("/delete-HoaDon", postDeleteDH)




// them sp vao gio hang
router.post("/addtocart", addToCart)
// Lấy thông tin giỏ hàng (tổng số lượng và tổng tiền)
router.get('/cart-info', getCartInfo)
// get form chi tiet cart
router.get('/detail-cart', getCTCart)
// xóa 1 san pham trong chi tiet cart
router.post('/delete-detail-cart', removeACTCart)
// form edit so luong cart
router.get('/edit-qty-cart', getEditSLCart)
// update so luong cart
router.post('/update-mot-sp-trong-cart', updateSL_Mot_SPTrongCart)


// checkout and dat hang
// hien thi form checkout
router.get("/viewcheckout", hienThiFormCheckOut)
// handle dat hang
router.post("/dat-hang", handleDatHang)


// lich su don dat hang
router.get("/order-history", hienThiFormHistoryOrder)
// chi tiet don hang
router.get("/chi-tiet-dh", getChiTietHD)
// huy don hang
router.get("/huy-don-hang", huyDonHang)
// chi tiet don hang da huy
router.get("/chi-tiet-dh-da-huy", getChiTietHDDaHuy)


module.exports = router;

