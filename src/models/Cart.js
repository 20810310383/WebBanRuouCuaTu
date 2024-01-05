const mongoose = require('mongoose');
const SanPham = require("./SanPham")
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const CartSchema = new Schema({

    cart: {
        items: [{
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'SanPham',
                required: true
            },
            qty: {
                type: Number,
                required: true
            }
        }],
        totalPrice: {
            type: Number,
            default: 0  // Set a default value
        },
        totalQuaty: {
            type: Number,
            default: 0  // Set a default value
        },
    },
    MaTKKH: { 
        ref: "TaiKhoan_KH", 
        type: mongoose.SchemaTypes.ObjectId 
    },
    
});

CartSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

// // Cập nhật TotalPrice và TotalQuaty khi các mục được sửa đổi
// CartSchema.pre('save', async function(next) {
//     const cart = this.cart;

//     try {
//         // Điền thông tin chi tiết về sản phẩm trước khi tính tổng Giá
//         await Promise.all(cart.items.map(async item => {
//             const product = await SanPham.findById(item.productId);
//             if (product) {
//                 item.productId = product; // Thay thế ID bằng đối tượng sản phẩm thực tế
//             }
//         }));

//         cart.totalPrice = cart.items.reduce((total, item) => {
//             return total + (item.qty * item.productId.price);
//         }, 0);

//         cart.totalQuaty = cart.items.reduce((total, item) => {
//             return total + item.qty;
//         }, 0);

//         next();
//     } catch (error) {
//         next(error);
//     }
// });

module.exports = mongoose.model('Cart', CartSchema);