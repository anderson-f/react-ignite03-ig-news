import { NextApiRequest, NextApiResponse } from "next"
import { query as q } from 'faunadb'
import { getSession } from 'next-auth/client'
import { fauna } from "../../services/fauna"
import { stripe } from "../../services/stripe"

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    // Preciso criar um customer pro usuário logado dentro do painel do Stripe
    // Preciso pegar o usuário logado, e como não estou no frontned não posso usar useSession
    // req.cookies só pega o token
    const session = await getSession({ req })

    // Buscar user no FaunaDB para salvar id de usuário do Stripe no FaunaDB
    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    )

    let customerId = user.data.stripe_customer_id

    if(!customerId) {

      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata
      })

      // insrindo o id do stripe no registro do fauna
      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data : {
              stripe_customer_id: stripeCustomer.id
            }
          }
        )
      )

      customerId = stripeCustomer.id
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId, // id do customer no stripe e não no fauna
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1IycKOBVg5kZNibMGUHrA73M', quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed')
  }
}
