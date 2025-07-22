const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
  const { teacherId, email } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: 'price_abc123', // TODO: Deine Stripe Preis-ID hier
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/payment-success`,
      cancel_url: `${process.env.BASE_URL}/payment-cancel`,
      metadata: {
        teacherId,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Fehler bei Checkout-Session:', err.message);
    res.status(500).json({ error: 'Fehler bei Stripe' });
  }
});

module.exports = router;
