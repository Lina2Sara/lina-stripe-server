const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Mapping der Produktnamen zu den jeweiligen Preis-IDs
const PRICE_MAP = {
  basic: 'price_1RnHJtFbcBwxuX1QyXOW0qXq',
  earlybird: 'price_1RnHIDFbcBwxuX1Q34pn7cWg',
  probe: 'price_1RnHHDFbcBwxuX1QduU14Qba',
};

router.post('/', async (req, res) => {
  const { teacherId, email, plan } = req.body;

  const priceId = PRICE_MAP[plan?.toLowerCase()];
  if (!priceId) {
    return res.status(400).json({ error: 'Ungültiger Tarifname übergeben.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // weiterhin Abo-Modus
      payment_method_types: ['automatic'], // lässt Stripe alle erlaubten Methoden anzeigen
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `https://lina-vocal-muse.lovable.app/payment-success`,
      cancel_url: `https://lina-vocal-muse.lovable.app/payment-cancel`,
      metadata: {
        teacherId,
        plan,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Fehler bei Checkout-Session:', err.message);
    res.status(500).json({ error: 'Fehler bei Stripe' });
  }
});

module.exports = router;

    res.json({ url: session.url });
  } catch (err) {
    console.error('Fehler bei Checkout-Session:', err.message);
    res.status(500).json({ error: 'Fehler bei Stripe' });
  }
});

module.exports = router;

