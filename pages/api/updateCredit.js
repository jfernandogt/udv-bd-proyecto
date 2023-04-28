import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'

import getConnection from '@/lib/dbconnection'

async function updateCredit(req, res) {
  const { monto, plazo, saldo, id } = await req.body
  const { ids } = await req.body
  const connection = await getConnection()

  const authUser = req.session.user

  if (!authUser?.isLoggedIn) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  if (!monto || !plazo || !saldo || !id) {
    res.status(400).json({ message: 'Missing body parameter' })
    return
  }

  try {
    const response = await connection.execute(
      'UPDATE `creditos` SET `monto` = ?, `plazo` = ?, `saldo` = ? WHERE `creditos`.`id` = ?',
      [monto, plazo, saldo, id]
    )

    res.send({ response })
  } catch (error) {
    console.log('error', error.message)
    res.status(500).json({ message: error.message })
  }
}

export default withIronSessionApiRoute(updateCredit, sessionOptions)
