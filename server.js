// 1. Gọi thư viện 'express' mà em đã cài đặt để tạo máy chủ web
const express = require('express');
const app = express();

// 2. Định nghĩa cổng chạy máy chủ. 
// Theo kiến trúc Microservices của chúng ta, Product Service sẽ chạy ở cổng 3001
const port = 3001; 
app.use(express.static('public'));
// 3. Tạo một danh sách dữ liệu giả lập (Mock data) về các món nước
const danhSachNuoc = [
    { id: 1, ten: "Cà phê Sữa đá", gia: 29000, hinhAnh: "https://images.unsplash.com/photo-1511920170033-f8396924c348" },
    { id: 2, ten: "Trà đào cam sả", gia: 35000, hinhAnh: "https://images.unsplash.com/photo-1556679343-c7306c1976bc" },
    { id: 3, ten: "Bạc xỉu", gia: 29000, hinhAnh: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085" }
];

// 4. Tạo một API endpoint (Đường dẫn giao tiếp)
// Khi có ai đó truy cập vào đường dẫn '/api/drinks' bằng phương thức GET,
// máy chủ sẽ trả về danhSachNuoc dưới dạng dữ liệu JSON.
app.get('/api/drinks', (req, res) => {
    // res.json() là lệnh yêu cầu Express tự động chuyển đổi mảng dữ liệu thành chuỗi JSON
    res.json(danhSachNuoc);
});

// 5. Khởi động máy chủ và yêu cầu nó lắng nghe các kết nối tới cổng 3001
app.listen(port, () => {
    console.log(`✅ Product Service đang chạy thành công tại: http://localhost:${port}`);
    console.log(`👉 Xem danh sách đồ uống tại: http://localhost:${port}/api/drinks`);
});