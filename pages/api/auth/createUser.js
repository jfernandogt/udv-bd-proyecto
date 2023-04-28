import argon2 from 'argon2'

import getConnection from '@/lib/dbconnection'

async function createUser(req, res) {
  const {
    username,
    email,
    password,
    rolId,
    firstname,
    lastname,
    address,
    phoneNumber,
    dpi,
    dateBirth,
  } = await req.body

  try {
    if (!username || !email || !password || !rolId) {
      res.status(500).send({ valid: false, message: 'Please fill all fields' })
      return
    }

    const hashed = await argon2.hash(password)

    const connection = await getConnection()

    const [data] = await connection.execute(
      'INSERT INTO usuarios (nombre_usuario, correo, contrasena, rol_id) VALUES(?, ?, ?, ?)',
      [username, email, hashed, rolId]
    )

    if (rolId === 1) {
      const userId = await data.insertId

      await connection.execute(
        'INSERT INTO clientes (nombre, apellido, dpi, fecha_nacimiento, direccion, telefono, usuario_id) VALUES(?, ?, ?, ?, ?, ?, ?)',
        [firstname, lastname, dpi, dateBirth, address, phoneNumber, userId]
      )
    }

    res.send({ valid: true, message: 'User created' })
  } catch (error) {
    res.status(500).json({ valid: false, message: error.message })
  }
}

export default createUser
