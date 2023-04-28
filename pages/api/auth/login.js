import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'
import argon2 from 'argon2'

import getConnection from '@/lib/dbconnection'

async function loginRoute(req, res) {
  const { username, password } = await req.body

  const connection = await getConnection()

  try {
    const [[userData] = rows] = await connection.execute(
      'SELECT * FROM `usuarios` WHERE `nombre_usuario` = ?',
      [username]
    )

    const valid = await argon2.verify(userData.contrasena, password)

    if (!userData?.contrasena || !valid) {
      res.send({ valid: false, message: 'Invalid credentials' })

      return
    }

    console.log('userData', userData)

    const [[clientData] = rows] = await connection.execute(
      'SELECT * FROM `clientes` WHERE `usuario_id` = ?',
      [userData.id]
    )

    const user = {
      isLoggedIn: valid,
      username,
      email: userData.correo,
      rol: userData.rol_id,
      nombre: clientData.nombre,
      apellido: clientData.apellido,
      dpi: clientData.dpi,
      clientId: clientData.id,
    }

    req.session.user = user

    await req.session.save()

    res.send(user)
  } catch (error) {
    console.log('error', error.message)
    res.status(500).json({ message: error.message })
  }
}

// export default loginRoute

export default withIronSessionApiRoute(loginRoute, sessionOptions)
