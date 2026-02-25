
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export async function POST(req) {
  const { priceId } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/thank-you`,
      cancel_url: `${req.headers.get('origin')}/choose-plan`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: { message: err.message } });
  }
}
