import { NextApiRequest, NextApiResponse } from "next"
import { Readable } from 'stream'
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

// converte formato stream para objeto
async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    )
  }

  return Buffer.concat(chunks)
}

// desabilitando entendimento padrão do next para poder receber stream
export const config = {
  api: {
    bodyParser: false
  }
}

// estrutura de dados set(conjuntos)
const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  ''
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST'){
    const buf = await buffer(req)

    // impedindo que a rota webhook seja acessada externamente
    const secret = req.headers['stripe-signature']

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
    } catch(err) {
      return res.status(400).send(`Webhook error ${err.message}`)
    }

    const { type } = event

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':

            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            )

            break;
          case 'checkout.session.completed':
            // tipando o evento especifico para facilitar
            const checkoutSession = event.data.object as Stripe.Checkout.Session

            await saveSubscription(
              checkoutSession.subscription.toString(), // toString pra acertar a tipagem
              checkoutSession.customer.toString(),
              true
            )

            break;

          default:
            throw new Error('Unhandled event.')
        }
      } catch(err) {
        return res.json({error: 'Webhook handler failed.'})
      }
    }

    res.json({received: true})
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed')
  }
}
