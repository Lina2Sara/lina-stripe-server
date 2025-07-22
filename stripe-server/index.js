const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/create-checkout-session', require('./create-checkout-session'));
app.use('/stripe-webhook', require('./stripe-webhook'));

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
