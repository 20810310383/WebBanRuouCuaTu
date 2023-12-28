const SanPham = require("../models/SanPham")
const LoaiSP = require("../models/LoaiSP")
const TheLoaiTrongNgoaiNuoc = require("../models/TheLoaiTrongNgoaiNuoc")
const Cart = require("../models/Cart")
require('rootpath')();

const aqp = require('api-query-params')

// --------------------------------------

module.exports = {

    homeSearch: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/search-sp?page=${req.query.page}`)
        }
        res.redirect(`/search-sp`)
    },

    trangSanPham: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.taikhoan
        let loggedIn = sessions.loggedIn
        let ten = sessions.ten
        
        console.log(sessions);
        console.log(taikhoan);
        console.log(loggedIn);
        console.log(ten);

        let loaiSP = await LoaiSP.find({}).exec();
        console.log("cac loai sp: ", loaiSP);

        let page = 1
        const limit = 9
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }
        
        let skip = (page - 1) * limit
        let tenSPSearch = req.query.searchSP
        console.log("ten loai sp can tim req.query.searchSP:",tenSPSearch);        

        // Thực hiện tìm kiếm sản phẩm gần đúng        
        const timKiemSP = await SanPham.find({ TenSP: { $regex: new RegExp(tenSPSearch, 'i') } }).skip(skip).limit(limit).exec();

        if (!timKiemSP) {
            // Nếu không tìm thấy sản phẩm
            return res.status(404).send("Không tìm thấy sản phẩm.");
        }

        // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
        let numPage = parseInt((await SanPham.find({ TenSP: { $regex: new RegExp(tenSPSearch, 'i') } })).length) / limit

        
        // kiểm tra xem phần thập phân của numPage có bằng 0 hay không
        // Nếu bằng 0, nghĩa là numPage là một số nguyên, không cần phải thêm một trang nữa
        // Ngược lại, nếu có phần thập phân, nó thêm một trang nữa để đảm bảo rằng tất cả các sản phẩm được hiển thị.
        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1
        console.log("tổng số trang cần hiển thị: ", numPage);

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

        // đoạn này chưa làm xong
        // menu trong nuoc va ngoai nuoc
        let menuCha = await TheLoaiTrongNgoaiNuoc.find({}).exec();
        
        let id_trongNgoaiNuoc = req.params.id_trongNgoaiNuoc

        if (menuCha.TenTheLoaiTrongNgoaiNuoc === "Trong Nước") {

        }
        let menuCon = [];
        if (id_trongNgoaiNuoc) {
            menuCon = await LoaiSP.find({ IdTheLoaiTrongNgoaiNuoc: id_trongNgoaiNuoc }).exec();
        }
        // --------------------------------------------------------------------------------------------

        res.render("layouts/allSanPham.ejs", {
            soTrang: numPage, 
            curPage: page, 
            allSP: timKiemSP, 
            formatCurrency: formatCurrency, 
            rootPath: '/', 
            getRelativeImagePath: getRelativeImagePath,
            menuCha: menuCha,
            menuCon: menuCon,
            loaiSP: loaiSP,
            logIn: loggedIn, 
            taikhoan
        })
    },

    homeSearchLoaiSanPham: (req, res) => { 
        if (req.query.page) {
            const searchSP1 = req.session.tenSPSearch || ''; // Lấy giá trị tenSPSearch từ session (hoặc có thể là từ nơi khác)
            return res.redirect(`/search-sp1?page=${req.query.page}&searchSP1=${searchSP1}`);
        }
        res.redirect(`/search-sp1`)
    },

    trangSearchLoaiSanPham: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.taikhoan
        let loggedIn = sessions.loggedIn
     

        let loaiSP = await LoaiSP.find({}).exec();
        console.log("cac loai sp: ", loaiSP);

        let page = 1
        const limit = 9
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }
        
        let skip = (page - 1) * limit
        // ----------------------------------------
        let tenSPSearch = req.query.searchSP1
        console.log("ten loai sp can tim req.query.searchSP1:",tenSPSearch);

        // Lưu trữ giá trị tìm kiếm trong session hoặc cookie
        req.session.tenSPSearch = tenSPSearch;

        const iDLoaiSP = await LoaiSP.findOne({ TenLoaiSP: tenSPSearch }).exec();
        if (!iDLoaiSP) {
            return res.redirect('/error'); 
          }
        let idloai = iDLoaiSP._id
        console.log("id loai sp==>", idloai);

        let sanpham = await SanPham.find({ IdLoaiSP: idloai }).populate('IdLoaiSP').skip(skip).limit(limit).exec();
        console.log("===>", sanpham);                      

        // // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
        let numPage = parseInt((await SanPham.find({ IdLoaiSP: idloai }).populate('IdLoaiSP')).length) / limit
        
        // // kiểm tra xem phần thập phân của numPage có bằng 0 hay không
        // // Nếu bằng 0, nghĩa là numPage là một số nguyên, không cần phải thêm một trang nữa
        // // Ngược lại, nếu có phần thập phân, nó thêm một trang nữa để đảm bảo rằng tất cả các sản phẩm được hiển thị.
        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1
        console.log("tổng số trang cần hiển thị: ", numPage);

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

        // đoạn này chưa làm xong
        // menu trong nuoc va ngoai nuoc
        let menuCha = await TheLoaiTrongNgoaiNuoc.find({}).exec();
        
        let id_trongNgoaiNuoc = req.params.id_trongNgoaiNuoc

        if (menuCha.TenTheLoaiTrongNgoaiNuoc === "Trong Nước") {

        }
        let menuCon = [];
        if (id_trongNgoaiNuoc) {
            menuCon = await LoaiSP.find({ IdTheLoaiTrongNgoaiNuoc: id_trongNgoaiNuoc }).exec();
        }
        // --------------------------------------------------------------------------------------------


        res.render("layouts/trangSearchLoaiSanPham.ejs", {
            soTrang: numPage, 
            curPage: page, 
            allSP: sanpham, 
            formatCurrency: formatCurrency, 
            rootPath: '/', 
            getRelativeImagePath: getRelativeImagePath,
            menuCha: menuCha,
            menuCon: menuCon,
            loaiSP: loaiSP,
            logIn: loggedIn, 
            taikhoan,
            searchSP1: req.session.tenSPSearch || '',
        })
    },

}