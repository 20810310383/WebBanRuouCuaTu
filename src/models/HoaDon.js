const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const HoaDon_Schema = new mongoose.Schema({
  HoTen: { type: String },
  QuocGia: { type: String },
  ThanhPho: { type: String },
  DiaChi_ChiTiet: { type: String },
  SoDienThoai: { type: String },
  Email: { type: String },
  PhiSanPham: { type: Number, default: 0 },
  PhiShip: { type: Number, default: 30000 },
  TongTien: { type: Number, default: 0 },
  GiamGia: { type: Number, default: 0 },
  TongSLDat: { type: Number, default: 0 },
  TinhTrangDonHang: { 
    type: String, 
    enum: ["Chưa giao", "Đã giao", "Đang giao"], 
    default: "Chưa giao" 
  },
  TinhTrangThanhToan: { 
    type: String, 
    enum: ["Đã Thanh Toán", "Chưa Thanh Toán"], 
    default: "Chưa Thanh Toán" 
  },
  NgayLap: { type: Date, default: Date.now(), immutable: true },
  MaKH: { type: mongoose.SchemaTypes.ObjectId, ref: "KhachHang" },
});

HoaDon_Schema.plugin(mongoose_delete);

module.exports = mongoose.model("HoaDon", HoaDon_Schema);
