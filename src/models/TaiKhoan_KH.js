const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');

const TaiKhoan_KH_Schema = new mongoose.Schema({
    TenDangNhap: { type: String, minLength: 5, maxLength: 20, required: true, unique: true },
    MatKhau: { type: String, required: true },
    HoTen: { type: String, required: true },
    DiaChi: { type: String, require: true },
    SDT: { type: String },
    Email: { type: String },
    NgayTao: { type: Date, default: Date.now(), immutable: true },
    // MaKH: { type: mongoose.SchemaTypes.ObjectId, ref: "KhachHang" },
    // "XacThuc": { type: Boolean, default: false }
})

TaiKhoan_KH_Schema.plugin(mongoose_delete, { TaiKhoan_KH_Schema: 'all' });

module.exports = mongoose.model("TaiKhoan_KH", TaiKhoan_KH_Schema); 