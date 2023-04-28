import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'

import getConnection from '@/lib/dbconnection'

async function getCredits(req, res) {
  const connection = await getConnection()

  const authUser = req.session.user

  const isColaborator = authUser.rol === 2

  if (!authUser?.isLoggedIn) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const clientQuery = isColaborator
      ? ''
      : `WHERE C.cliente_id = ${authUser.clientId}`
    const [creditos] = await connection.execute(`
      SELECT C.*, TC.nombre, TC.plazo_maximo, E.descripcion, CL.nombre as nombre_cliente, CL.apellido
      FROM creditos C
      INNER JOIN tipos_credito TC ON C.tipo_credito_id = TC.id
      INNER JOIN estados_credito E ON C.estado = E.id
      INNER JOIN clientes CL ON CL.id = C.cliente_id
      ${clientQuery}
    `)

    res.send(creditos)
  } catch (error) {
    console.log('error', error.message)
    res.status(500).json({ message: error.message })
  }
}

export default withIronSessionApiRoute(getCredits, sessionOptions)
