const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://product-db:27017/revo_product_db')
    .then(() => console.log('Product Service da ket noi MongoDB'))
    .catch((err) => console.error('Loi ket noi MongoDB cua Product Service:', err));

const Drink = mongoose.model('Drink', new mongoose.Schema({
    ten: String,
    gia: Number,
    image: String
}));

const canonicalProducts = {
    'Cà phê sữa đá': {
        ten: 'Phin Sữa Đá',
        gia: 29000,
        image: 'https://www.highlandscoffee.com.vn/vnt_upload/product/01_2026/thumbs/270_crop_PHIN_SUA_DA.jpg'
    },
    'Phin Sữa Đá': {
        ten: 'Phin Sữa Đá',
        gia: 29000,
        image: 'https://www.highlandscoffee.com.vn/vnt_upload/product/01_2026/thumbs/270_crop_PHIN_SUA_DA.jpg'
    },
    'Trà đào cam sả': {
        ten: 'Trà Thanh Đào',
        gia: 35000,
        image: 'https://www.highlandscoffee.com.vn/vnt_upload/product/HLCPOSTOFFICE_DRAFT/PNG_FINAL/3_MENU_NGUYEN_BAN/thumbs/270_crop_Tra_Thanh_Dao.jpg'
    },
    'Trà Thanh Đào': {
        ten: 'Trà Thanh Đào',
        gia: 35000,
        image: 'https://www.highlandscoffee.com.vn/vnt_upload/product/HLCPOSTOFFICE_DRAFT/PNG_FINAL/3_MENU_NGUYEN_BAN/thumbs/270_crop_Tra_Thanh_Dao.jpg'
    },
    'Bạc xỉu': {
        ten: 'Bạc Xỉu Đá',
        gia: 30000,
        image: 'https://www.highlandscoffee.com.vn/vnt_upload/product/01_2026/thumbs/270_crop_BAC_SIU_1.jpg'
    },
    'Bạc Xỉu Đá': {
        ten: 'Bạc Xỉu Đá',
        gia: 30000,
        image: 'https://www.highlandscoffee.com.vn/vnt_upload/product/01_2026/thumbs/270_crop_BAC_SIU_1.jpg'
    }
};

function mapDrink(drink) {
    const matched = canonicalProducts[drink.ten];
    if (!matched) {
        return {
            ...drink.toObject(),
            image: drink.image || '/images/default-drink.svg'
        };
    }

    return {
        ...drink.toObject(),
        ten: matched.ten,
        gia: matched.gia,
        image: matched.image
    };
}

async function seedData() {
    const count = await Drink.countDocuments();
    if (count === 0) {
        await Drink.create([
            { ten: 'Cà phê sữa đá', gia: 29000, image: canonicalProducts['Cà phê sữa đá'].image },
            { ten: 'Trà đào cam sả', gia: 35000, image: canonicalProducts['Trà đào cam sả'].image },
            { ten: 'Bạc xỉu', gia: 30000, image: canonicalProducts['Bạc xỉu'].image }
        ]);
        console.log('Da tao du lieu mau cho Product Service');
    }
}

seedData().catch((err) => console.error('Loi seed du lieu product:', err));

app.get('/api/drinks', async (req, res) => {
    const drinks = await Drink.find();
    res.json(drinks.map(mapDrink));
});

app.get('/health', (req, res) => {
    res.json({ service: 'product-service', status: 'ok' });
});

app.listen(3001, () => {
    console.log('Product Service dang chay tai cong 3001');
});
