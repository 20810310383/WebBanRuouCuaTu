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

    getHomeAdmin: (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn
        let ten = sessions.ten
        
        console.log(sessions);
        console.log(taikhoan);
        console.log(loggedIn);

        res.render("User_Admin/homeAdmin.ejs", {logIn: loggedIn, taikhoan})
    },

    getHomePhanTrang: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/home-qlsp?page=${req.query.page}`)
        }
        res.redirect(`/home-qlsp`)
    },

    getHomeQLSP: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn
        
        console.log(sessions);
        console.log(taikhoan);
        console.log(loggedIn);

        // let idloai_sp = req.body.id_loaisp
        // const tenloaisp = await LoaiSP.findById({ _id: idloai_sp }).exec();
        // let TenLoaiSP = tenloaisp.TenLoaiSP; 
        // console.log("id loai sp:",TenLoaiSP);

        let page = 1
        const limit = 5
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }
        
        let skip = (page - 1) * limit
        const all = await SanPham.find({}).skip(skip).limit(limit).exec()

        // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
        let numPage = parseInt((await SanPham.find({})).length) / limit

        // kiểm tra xem phần thập phân của numPage có bằng 0 hay không
        // Nếu bằng 0, nghĩa là numPage là một số nguyên, không cần phải thêm một trang nữa
        // Ngược lại, nếu có phần thập phân, nó thêm một trang nữa để đảm bảo rằng tất cả các sản phẩm được hiển thị.
        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1

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

        // -----------------  hien thi loai sp  -----------------    
        let sanpham = await SanPham.find({}).skip(skip).limit(limit).populate('IdLoaiSP').exec();
        console.log("TenLoaiSP:", sanpham);

        let hienthi_tenLoaiSP = sanpham.map(item => item.IdLoaiSP.TenLoaiSP);
        console.log("hienthi_tenLoaiSP:", hienthi_tenLoaiSP);

        res.render("User_Admin/homeQLSanPham.ejs", {
            soTrang: numPage, 
            curPage: page, 
            logIn: loggedIn, 
            taikhoan,
            rootPath: '/', 
            formatCurrency: formatCurrency,
            getRelativeImagePath: getRelativeImagePath,
            sanpham: all,
            hienthi_tenLoaiSP
        })
    },

    gethomeSearchQLSP: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/searchQlsp?page=${req.query.page}`)
        }
        res.redirect(`/searchQlsp`)
    },

    getSearchQLSP: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn
        let ten = sessions.ten
        
        let page = 1
        const limit = 3
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }
        
        let skip = (page - 1) * limit
        let tenSPSearch = req.query.searchSP
        const timKiemSP = await SanPham.find({ TenSP: { $regex: new RegExp(tenSPSearch, 'i') } }).skip(skip).limit(limit).exec();

        if (!timKiemSP) {
            // Nếu không tìm thấy sản phẩm
            return res.status(404).send("Không tìm thấy sản phẩm.");
        }

        // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
        let numPage = parseInt((await SanPham.find({ TenSP: { $regex: new RegExp(tenSPSearch, 'i') } })).length) / limit

        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1

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

        // -----------------  hien thi loai sp  -----------------    
        let sanpham = await SanPham.find({}).skip(skip).limit(limit).populate('IdLoaiSP').exec();
        console.log("TenLoaiSP:", sanpham);

        let hienthi_tenLoaiSP = sanpham.map(item => item.IdLoaiSP.TenLoaiSP);
        console.log("hienthi_tenLoaiSP:", hienthi_tenLoaiSP);

        res.render("User_Admin/SearchQLSP.ejs", {
            soTrang: numPage, 
            curPage: page, 
            logIn: loggedIn, 
            taikhoan,
            rootPath: '/', 
            formatCurrency: formatCurrency,
            getRelativeImagePath: getRelativeImagePath,
            sanpham: timKiemSP,
            hienthi_tenLoaiSP
        })
    },

    removeSP: async (req, res) => {
        try {
            let idRemove = req.body.idRemove;
                  
            // const productId = await SanPham.findById(idRemove);
      
            // Sử dụng deleteById để xóa sản phẩm theo id
            const deletedProduct = await SanPham.deleteById(idRemove);

            // Kiểm tra xem sản phẩm đã được xóa thành công hay không
            if (deletedProduct) {
                // res.status(200).json({ message: 'Xóa sản phẩm thành công.' });
                res.redirect('/home-qlsp'); 
            } else {
                res.status(404).send("Không tìm thấy sản phẩm để xóa.");
            }
      
        } catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    hienThiFormCreateSP: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn

        let tenloaisp = await LoaiSP.find({}).exec();
        
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
        res.render("User_Admin/createSP.ejs", {
            logIn: loggedIn, 
            taikhoan,
            rootPath: '/', 
            formatCurrency: formatCurrency,
            getRelativeImagePath: getRelativeImagePath,
            TenSp: tenloaisp
        })
    },

    postCreateSP: async (req, res) => {

        try {            
            let TenSP = req.body.TenSP
            let TenLoaiSP = req.body.IdLoaiSP
            let GiaBan = req.body.GiaBan
            let GiaCu = req.body.GiaCu
            let MoTa = req.body.MoTa
            let Sale_New = req.body.Sale_New
            let SoLuongTon = req.body.SoLuongTon
            let SoLuongBan = req.body.SoLuongBan
            let Image = req.body.Image

            const tenloaisp = await LoaiSP.findOne({ TenLoaiSP: TenLoaiSP }).exec();
            let IdLoaiSP = tenloaisp._id; 
            console.log("id loai sp:",IdLoaiSP);


            let imageUrl = ""
            // kiem tra xem da co file hay chua
            if (!req.files || Object.keys(req.files).length === 0) {
                // khong lam gi
            }
            else {
                let kq = await uploadSingleFile(req.files.Image)
                imageUrl = kq.path
                console.log(">>> check kq: ", kq.path);
            }

            let sanPhamData = {
                TenSP, GiaBan, GiaCu, MoTa, Sale_New, SoLuongTon, SoLuongBan,
                Image: imageUrl,
                IdLoaiSP
            }

            let SP = await createSanPhamService(sanPhamData)
            
            // res.status(201).json({ success: true, message: 'Thêm sản phẩm thành công' });
            res.redirect('/home-qlsp'); 
            // res.send("create thành công")
            // return res.status(200).json({
            //     errCode: 0,
            //     data: SP
            // })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false,message: 'Internal server error' });
        } 
    },

    hienThiFormUpdateSP: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn

        let idUpdateSp = req.query.idUpdateSp
        console.log("idUpdateSp",idUpdateSp);
        let getId = await SanPham.findById({ _id: idUpdateSp}).exec()
        console.log("getId",getId._id);
        let tenloaisp = await LoaiSP.find({}).exec();

        
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
        res.render("User_Admin/updateSP.ejs", {
            logIn: loggedIn, 
            taikhoan,
            rootPath: '/', 
            formatCurrency: formatCurrency,
            getRelativeImagePath: getRelativeImagePath,
            TenSp: tenloaisp,
            getId: getId
        })
    },

    postUpdateSP: async (req, res) => {

        try {
            let id = req.body.idupdatesp
            let TenSP = req.body.TenSP
            let TenLoaiSP = req.body.IdLoaiSP
            let GiaBan = req.body.GiaBan
            let GiaCu = req.body.GiaCu 
            let MoTa = req.body.MoTa
            let Sale_New = req.body.Sale_New
            let SoLuongTon = req.body.SoLuongTon
            let SoLuongBan = req.body.SoLuongBan
            let Image = req.body.Image

            const tenloaisp = await LoaiSP.findOne({ TenLoaiSP: TenLoaiSP }).exec();
            let IdLoaiSP = tenloaisp._id; 
            console.log("id loai sp:",IdLoaiSP);


            let imageUrl = ""
            // kiem tra xem da co file hay chua
            if (!req.files || Object.keys(req.files).length === 0) {
                // khong lam gi
            }
            else {
                let kq = await uploadSingleFile(req.files.Image)
                imageUrl = kq.path
                console.log(">>> check kq: ", kq.path);
            }

            let SP = await SanPham.findByIdAndUpdate( {_id: id}, {
                TenSP, GiaBan, GiaCu, MoTa, Sale_New, SoLuongTon, SoLuongBan,
                Image: imageUrl,
                IdLoaiSP: IdLoaiSP
            })

            console.log("chinh sua sp: ", SP);
            
            // res.status(201).json({ success: true, message: 'Chỉnh sửa sản phẩm thành công' });
            res.redirect('/home-qlsp'); 
            // res.send("create thành công")
            // return res.status(200).json({
            //     errCode: 0,
            //     data: SP
            // })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false,message: 'Internal server error' });
        } 
    },
}