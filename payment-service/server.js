const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB dùng chung order-db
mongoose.connect('mongodb://order-db:27017/revo_order_db')
    .then(() => console.log('📦 Payment Service đã kết nối MongoDB'))
    .catch(err => console.error('❌ Payment Service kết nối MongoDB lỗi:', err));

const Payment = mongoose.model('Payment', new mongoose.Schema({
    orderId: String,
    amount: Number,
    method: String,
    transactionId: String,
    status: String,
    createdAt: { type: Date, default: Date.now }
}));

// Health check
app.get('/', (req, res) => {
    res.send('✅ Payment Service đang chạy');
});

app.get('/health', (req, res) => {
    res.json({ service: 'payment-service', status: 'ok' });
});

app.get('/api/payments', async (req, res) => {
    const list = await Payment.find();
    res.json(list);
});

// Giả lập thanh toán
app.post('/api/payments', async (req, res) => {
    const { orderId, amount, method } = req.body;

    if (!orderId || !amount || !method) {
        return res.status(400).json({ error: 'orderId, amount và method là bắt buộc' });
    }

    const transactionId = `PAY-${Date.now()}`;
    const payment = new Payment({ orderId, amount, method, transactionId, status: 'paid' });
    const savedPayment = await payment.save();

    res.status(201).json({
        message: 'Thanh toán thành công',
        orderId,
        amount,
        method,
        transactionId,
        status: 'paid',
        payment: savedPayment
    });
});

const port = 3003;
app.listen(port, () => {
    console.log(`✅ Payment Service đang chạy tại cổng ${port}`);
});
