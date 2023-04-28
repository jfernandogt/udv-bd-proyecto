import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'

import getConnection from '@/lib/dbconnection'

async function getClients(req, res) {
  const { ids } = await req.body
  const connection = await getConnection()

  const authUser = req.session.user

  if (!authUser?.isLoggedIn) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const [clientes] = await connection.execute(
      `SELECT usuario_id FROM clientes WHERE id IN (${ids.join(', ')})`
    )

    await connection.execute(
      `DELETE FROM clientes WHERE id IN (${ids.join(', ')})`
    )

    await connection.execute(
      `DELETE FROM usuarios WHERE id IN (${clientes
        .map((cliente) => cliente.usuario_id)
        .join(', ')})`
    )

    res.send({ valid: true })
  } catch (error) {
    console.log('error', error.message)
    res.status(500).json({ message: error.message })
  }
}

export default withIronSessionApiRoute(getClients, sessionOptions)
