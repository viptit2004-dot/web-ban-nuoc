const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://order-db:27017/revo_order_db')
    .then(() => console.log('Payment Service da ket noi MongoDB'))
    .catch((err) => console.error('Loi ket noi MongoDB cua Payment Service:', err));

const Payment = mongoose.model('Payment', new mongoose.Schema({
    orderId: String,
    amount: Number,
    method: String,
    transactionId: String,
    status: String,
    createdAt: { type: Date, default: Date.now }
}));

app.get('/', (req, res) => {
    res.send('Payment Service đang chạy');
});

app.get('/health', (req, res) => {
    res.json({ service: 'payment-service', status: 'ok' });
});

app.get('/api/payments', async (req, res) => {
    const list = await Payment.find();
    res.json(list);
});

app.post('/api/payments', async (req, res) => {
    const { orderId, amount, method } = req.body;

    if (!orderId || !amount || !method) {
        return res.status(400).json({ error: 'orderId, amount và method là bắt buộc.' });
    }

    const transactionId = `PAY-${Date.now()}`;
    const payment = new Payment({ orderId, amount, method, transactionId, status: 'paid' });
    const savedPayment = await payment.save();

    res.status(201).json({
        message: 'Thanh toán thành công.',
        orderId,
        amount,
        method,
        transactionId,
        status: 'paid',
        payment: savedPayment
    });
});

app.listen(3003, () => {
    console.log('Payment Service dang chay tai cong 3003');
});
