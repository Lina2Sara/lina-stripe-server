const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { buffer } = require('micro');
const { createClient } = require('@supabase/supabase-js');

router.use(express.raw({ type: 'application/json' }));

router.post('/', async (req, res) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const teacherId = session.metadata.teacherId;

    const { error } = await supabase
      .from('teachers')
      .update({ payment_status: 'bezahlt' })
      .eq('id', teacherId);

    if (error) console.error('Supabase-Fehler:', error.message);
  }

  res.status(200).json({ received: true });
});

module.exports = router;
