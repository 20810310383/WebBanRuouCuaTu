const SanPham = require("../models/SanPham")
const Cart = require("../models/Cart")
const mongoose = require('mongoose');
require('rootpath')();

const aqp = require('api-query-params')

// --------------------------------------

module.exports = {   

    // test - đang sai logic
    addToCart1: async (req, res) => {
        const productId = req.query.productId;
        const qtyy = parseInt(req.body.quantity);
        const qty = !isNaN(qtyy) && qtyy > 0 ? qtyy : 1;
    
        // Lấy thông tin đăng nhập của khách hàng từ request
        const customerAccountId = req.user ? req.user._id : null;
    
        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await SanPham.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
    
        let cart = await Cart.findOne({ MaTKKH: customerAccountId });
    
        if (cart) {
            // Giỏ hàng tồn tại cho người dùng
            let itemIndex = cart.cart.items.findIndex(p => p.productId.toString() === productId);
            console.log(">>itemIndex:", itemIndex);
    
            if (itemIndex > -1) {
                // Sản phẩm có trong giỏ hàng, cập nhật số lượng
                let productItem = cart.cart.items[itemIndex];
                productItem.qty += qty;
                cart.cart.items[itemIndex] = productItem;
            } else {
                // Sản phẩm không tồn tại trong giỏ hàng, thêm mặt hàng mới
                cart.cart.items.push({ productId, qty });
            }
    
             // Cập nhật tổng số lượng và tổng tiền
             cart.cart.totalQuaty += qty;
             cart.cart.totalPrice += product.GiaBan * qty;
    
            cart = await cart.save();
            return res.status(201).send(cart);
        } else {
            // Không có giỏ hàng cho người dùng, tạo giỏ hàng mới
            const newCart = await Cart.create({
                cart: {
                    items: [{ productId, qty }],
                    totalPrice: qty * product.GiaBan,
                    totalQuaty: qty,
                },
                MaTKKH: customerAccountId,
            });
    
            return res.status(201).send(newCart);
        }
    },
    

    addToCart: async (req, res) => {
        try {
            const productId = req.query.productId;
            const qtyy = parseInt(req.body.quantity);
            const qty = !isNaN(qtyy) && qtyy > 0 ? qtyy : 1;
    
            // Lấy thông tin đăng nhập của khách hàng từ request
            const customerAccountId = req.user ? req.user._id : null;
    
            // Kiểm tra xem sản phẩm có tồn tại không
            const product = await SanPham.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
            }
    
            // Kiểm tra xem giỏ hàng đã tồn tại chưa, nếu chưa thì tạo mới
            let cart;
            let cartt = await Cart.find({}).populate('MaTKKH').exec();
            console.log(">>> cartt:", cartt);

            // Nếu đăng nhập, sử dụng MaTKKH để liên kết với người dùng
            if (customerAccountId) {
                cart = await Cart.findOne({ MaTKKH: customerAccountId });
                if (!cart) {
                    cart = new Cart({
                        cart: {
                            items: [],
                            totalPrice: 0,
                            totalQuaty: 0,
                        },
                        MaTKKH: customerAccountId,
                    });
                }
            } else {
                // Nếu không đăng nhập, kiểm tra xem có giỏ hàng trong session hay không
                if (req.session.cartId) {
                    // Nếu có giỏ hàng, lấy giỏ hàng từ cơ sở dữ liệu
                    cart = await Cart.findById(req.session.cartId);
                }
    
                // Nếu không có giỏ hàng trong session hoặc database, tạo giỏ hàng mới
                if (!cart) {
                    cart = new Cart({
                        cart: {
                            items: [],
                            totalPrice: 0,
                            totalQuaty: 0,
                        },
                        MaTKKH: null,
                    });
                }

            }

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const existingItem = cart.cart.items.find((item) => item.productId.equals(productId));
    
            if (existingItem) {
                // Nếu đã có sản phẩm trong giỏ hàng, cập nhật số lượng
                existingItem.qty += qty;
            } else {
                // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
                cart.cart.items.push({
                    productId: product._id,
                    qty: qty,
                });
            }
    
            // Cập nhật tổng số lượng và tổng tiền
            cart.cart.totalQuaty += qty;
            cart.cart.totalPrice += product.GiaBan * qty;
    
            // Lưu cartId vào session nếu user không đăng nhập
            if (!customerAccountId) {
                req.session.cartId = cart._id;
            }

            // Lưu giỏ hàng vào cơ sở dữ liệu hoặc session
            await cart.save();
    
    
            return res.status(200).json({ message: 'Đã thêm sản phẩm vào giỏ hàng' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },     

    // Lấy thông tin giỏ hàng (tổng số lượng và tổng tiền)
    getCartInfo: async (req, res) => {
        try {
            const customerAccountId = req.session.userId;
            console.log(">> check customerAccountId:", customerAccountId);
            const cart = await Cart.findOne({MaTKKH: customerAccountId});
            if (!cart) {
                return res.status(200).json({ totalQuaty: 0, totalPrice: 0 });
            }
        
            return res.status(200).json({
                totalQuaty: cart.cart.totalQuaty,
                totalPrice: cart.cart.totalPrice,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },

    getCTCart: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.taikhoan
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
       
        const customerAccountId = req.session.userId;
        let detailCart = await Cart.findOne({MaTKKH: customerAccountId}).exec();

        let productDetailsArray = []
        let cartItemss = detailCart.cart 

        for (let i = 0; i < cartItemss.items.length; i++) {
            console.log(`detailCart.items[${i}]._id:`, cartItemss.items[i]._id);
        }

        if (detailCart) {
            const cartItems = detailCart.cart.items;
            
            console.log("cartItemss.totalPrice",cartItemss.totalPrice);

            for (const item of cartItems) {

                console.log(`item._id: ${item._id}`);   // xem id can xoa

                try {
                    const productDetails = await SanPham.findById(item.productId).exec();

                    if (productDetails) {
                        const tensp = productDetails.TenSP;
                        const qty = item.qty;
                        const giaBan = productDetails.GiaBan;

                        const totalPriceForItem = qty * giaBan;

                        console.log(`tensp: ${tensp}, \n Qty: ${qty}, \n GiaBan: ${giaBan}, \n tong gia: ${totalPriceForItem}`);

                        // Đẩy chi tiết sản phẩm vào mảng
                        productDetailsArray.push({
                            productDetails, 
                            qty,
                            totalPriceForItem,
                            _id: item._id
                        });
                    } else {
                        console.log("Không tìm thấy chi tiết sản phẩm cho mặt hàng:", item.productId);
                    }
                } catch (error) {
                    console.error("Lỗi khi truy xuất chi tiết sản phẩm:", error);
                }
            }
        } else {
            console.log("Giỏ hàng trống");
        }      

        res.render("layouts/chiTietCart.ejs", {
            formatCurrency: formatCurrency, 
            rootPath: '/', 
            getRelativeImagePath: getRelativeImagePath,
            logIn: loggedIn, 
            taikhoan, 
            productDetails: productDetailsArray,
            cartItemss: cartItemss,
        })
    },   

    removeACTCart: async (req, res) => {
        try {
            let idRemove = req.body.idARemove;
    
            const removedProduct = await Cart.findOneAndUpdate(
                { 'cart.items._id': idRemove },
                { $pull: { 'cart.items': { _id: idRemove } } },
                { new: true } // Trả lại tài liệu đã cập nhật
            );
    
            // Kiểm tra xem sản phẩm đã được tìm thấy và xóa chưa
            if (removedProduct && removedProduct.cart && removedProduct.cart.items) {
                let totalPrice = 0;
                let totalQuaty = 0;
                // Tính tổng giá và tổng số lượng cập nhật dựa trên các mặt hàng còn lại
                for (const item of removedProduct.cart.items) {
                    try {
                        let productDetails = await SanPham.findById(item.productId).exec();
                        if (productDetails) {
                            const giaBan = Number(productDetails.GiaBan);
                            console.log("giaBan --->>>>", giaBan);
                            const itemTotal = item.qty * (isNaN(giaBan) ? 0 : giaBan);
                            console.log("itemTotal --->>>>", itemTotal);
    
                            totalPrice += itemTotal;
                            totalQuaty += item.qty;
                        }
                    } catch (error) {
                        console.error("Lỗi tính toán itemTotal:", error);
                    }
                }
    
                // Cập nhật tổng giá và tổng số lượng trong Giỏ hàng
                await Cart.findByIdAndUpdate(
                    {_id: removedProduct._id},
                    { $set: { 'cart.totalPrice': totalPrice, 'cart.totalQuaty': totalQuaty } }
                    // {totalPrice: totalPrice, totalQuaty: totalQuaty}
                );
    
                res.redirect('/detail-cart');
            } else {
                res.status(404).send("Không tìm thấy sản phẩm để xóa.");
            }
    
        } catch (error) {
            console.error('Lỗi xóa sản phẩm:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },         
}
