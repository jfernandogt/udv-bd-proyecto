import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'

import getConnection from '@/lib/dbconnection'

async function updateClient(req, res) {
  const { nombre, apellido, direccion, dpi, fecha_nacimiento, id, telefono } =
    await req.body
  const connection = await getConnection()

  const authUser = req.session.user

  if (!authUser?.isLoggedIn) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  if (
    !nombre ||
    !apellido ||
    !direccion ||
    !dpi ||
    !fecha_nacimiento ||
    !id ||
    !telefono
  ) {
    res.status(400).json({ message: 'Missing body parameter' })
    return
  }

  try {
    const response = await connection.execute(
      'UPDATE `clientes` SET `nombre` = ?, `apellido` = ?, `direccion` = ?, `dpi` = ?, `fecha_nacimiento` = ?, `telefono` = ? WHERE `clientes`.`id` = ?',
      [
        nombre,
        apellido,
        direccion,
        dpi,
        fecha_nacimiento.split('T')[0],
        telefono,
        id,
      ]
    )

    res.send({ response })
  } catch (error) {
    console.log('error', error.message)
    res.status(500).json({ message: error.message })
  }
}

export default withIronSessionApiRoute(updateClient, sessionOptions)
