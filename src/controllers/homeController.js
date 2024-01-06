const SanPham = require("../models/SanPham")
const Cart = require("../models/Cart")
require('rootpath')();

const aqp = require('api-query-params')

// --------------------------------------

module.exports = {
    home: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/home?page=${req.query.page}`)
        }
        res.redirect(`/home`)
    },

    getHomePage: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.taikhoan
        // let loggedIn = sessions.loggedIn
        let loggedIn = req.session.loggedIn ? true : false;
        
        console.log("sessions: ",sessions);
        console.log("taikhoan: ",taikhoan);
        console.log("loggedIn: ",loggedIn);

        let page = 1
        const limit = 8
        
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

        res.render("home.ejs", {
            soTrang: numPage, 
            curPage: page, 
            allSP: all, 
            logIn: loggedIn, 
            taikhoan, 
            formatCurrency: formatCurrency, 
            rootPath: '/', 
            getRelativeImagePath: getRelativeImagePath,

           
        })
    },

}