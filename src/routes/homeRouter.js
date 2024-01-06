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


// qlsp
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


// them sp vao gio hang
router.post("/addtocart", addToCart)
// Lấy thông tin giỏ hàng (tổng số lượng và tổng tiền)
router.get('/cart-info', getCartInfo)
// get form chi tiet cart
router.get('/detail-cart', getCTCart)
// xóa 1 san pham trong chi tiet cart
router.post('/delete-detail-cart', removeACTCart)


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


// -----------  checkout 
// hien thi form checkout
router.get("/viewcheckout", hienThiFormCheckOut)
// handle dat hang
router.post("/dat-hang", handleDatHang)

module.exports = router;

