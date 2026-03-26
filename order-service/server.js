const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Thư viện database
const app = express();

app.use(cors());
app.use(express.json());

// 1. KẾT NỐI MONGODB 
mongoose.connect('mongodb://order-db:27017/revo_order_db')
    .then(() => console.log("📦 Đã kết nối MongoDB thành công cho Order Service!"))
    .catch(err => console.error("❌ Lỗi kết nối DB:", err));

// 2. TẠO KHUÔN MẪU DỮ LIỆU (SCHEMA) CHO ĐƠN HÀNG
const Order = mongoose.model('Order', new mongoose.Schema({
    sanPhamId: Number,
    tenSanPham: String,
    giaTien: Number,
    soLuong: Number,
    thoiGian: { type: Date, default: Date.now }
}));

// 3. API NHẬN YÊU CẦU ĐẶT HÀNG VÀ LƯU VÀO DATABASE
app.post('/api/orders', async (req, res) => {
    try {
        const donHangMoi = new Order(req.body);
        const donHangDaLuu = await donHangMoi.save(); // Lệnh lưu thẳng vào ổ cứng MongoDB
        const donHangDaLuu = await donHangMoi.save(); // Lệnh lưu thẳng vào ổ cứng!
        
        console.log("🔔 Đơn hàng đã lưu vào DB:", donHangDaLuu);
        res.status(201).json({
            thongBao: "Đặt hàng thành công và đã lưu vào DB thật!",
            donHang: donHangDaLuu
        });
    } catch (error) {
        res.status(500).json({ loi: "Không thể lưu đơn hàng" });
    }
});

// 4. API XEM LỊCH SỬ ĐẶT HÀNG
app.get('/api/orders', async (req, res) => {
    const danhSach = await Order.find(); // Lệnh móc dữ liệu từ DB ra
    res.json(danhSach);
});
app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ loi: 'Không tìm thấy đơn hàng' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ loi: 'Invalid order ID' });
    }
});

app.delete('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ loi: 'Không tìm thấy đơn hàng để xoá' });
        }
        res.json({ thongBao: 'Xoá đơn hàng thành công', order });
    } catch (error) {
        res.status(400).json({ loi: 'Invalid order ID' });
    }
});

// Route kiểm tra nhanh
app.get('/', (req, res) => {
    res.send('✅ Order Service đang chạy. Hãy gọi /api/orders để lấy danh sách.');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'order-service' });
});
app.listen(3002, () => {
    console.log(`✅ Order Service đang chạy tại cổng 3002`);
});