import stripe from 'stripe';
import Booking from '../models/Booking.js';

//  api to handle stripe webhooks
  export const stripeWebhooks = async (request, response) => {
    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        response.staus(400).send(`Webhook Error: ${error.message}`);
       
    }
    // Handle the event
    if(event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentId,
           
        });
        const {bookingId} = session.data[0].metadata;
        // update booking status to paid
        await Booking.findByIdAndUpdate(bookingId, {isPaid: true , paymentMethod: "Stripe"});
        
    }else{
         console.log(`Unhandled event type ${event.type}`);
    }
    response.json({received: true});
  }