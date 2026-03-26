const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3000; // Cổng của API Gateway là 3000

// Mở cửa cho Front-end gọi vào
app.use(cors());

app.get('/', (req, res) => {
    res.redirect('http://localhost:3001');
});

// LƯU Ý: Không dùng app.use(express.json()) ở đây để tránh làm hỏng dữ liệu khi proxy (chuyển tiếp)

// 1. Định tuyến Dịch vụ Sản phẩm
app.use('/api/drinks', createProxyMiddleware({
    target: 'http://product-service:3001/api/drinks',
    changeOrigin: true
}));

// 2. Định tuyến Dịch vụ Đơn hàng
app.use('/api/orders', createProxyMiddleware({
    target: 'http://order-service:3002/api/orders',
    changeOrigin: true
}));

// 3. Định tuyến Dịch vụ Thanh toán
app.use('/api/payments', createProxyMiddleware({
    target: 'http://payment-service:3003/api/payments',
    changeOrigin: true
}));

// Khởi động Gateway
app.listen(port, () => {
    console.log(`🚀 API Gateway đang chạy tại: http://localhost:${port}`);
});
