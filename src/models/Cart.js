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
        PhiShip: { type: Number, default: 30000 },
        GiamGia: { type: Number, default: 0 },
    },
    MaTKKH: { 
        ref: "TaiKhoan_KH", 
        type: mongoose.SchemaTypes.ObjectId 
    },
    
});

// CartSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('Cart', CartSchema);