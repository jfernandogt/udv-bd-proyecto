import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'

import getConnection from '@/lib/dbconnection'

async function handler(req, res) {
  const authUser = req.session.user

  if (!authUser?.isLoggedIn) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  if (req.method === 'GET') {
    handleGetAccounts(req, res, authUser)
  } else if (req.method === 'POST') {
    handleInsertAccount(req, res, authUser)
  } else if (req.method === 'PUT') {
    handlePutRequest(req, res, authUser)
  } else if (req.method === 'DELETE') {
    handleDeleteRequest(req, res, authUser)
  } else {
    res.status(405).end()
  }
}

async function handleInsertAccount(req, res, authUser) {
  const { clientId, typeId, iDate, balance } = await req.body
  try {
    if (!clientId || !typeId || !iDate || !balance) {
      res.status(500).send({ valid: false, message: 'Please fill all fields' })
      return
    }

    const connection = await getConnection()

    const [data] = await connection.execute(
      'INSERT INTO cuentas (cliente_id, tipo, saldo, fecha_apertura) VALUES(?, ?, ?, ? )',
      [clientId, typeId, balance, iDate]
    )

    res.send({ valid: true, message: 'User created' })
  } catch (error) {
    res.status(500).json({ valid: false, message: error.message })
  }
}

async function handleGetAccounts(req, res, authUser) {
  const connection = await getConnection()

  const isColaborator = authUser.rol === 2

  try {
    const clientQuery = isColaborator
      ? ''
      : `WHERE C.cliente_id = ${authUser.clientId}`
    const [cuentas] = await connection.execute(`
      SELECT C.*, TC.descripcion, CL.nombre, CL.apellido
      FROM cuentas C
      INNER JOIN tipos_cuenta TC ON C.tipo = TC.id
      INNER JOIN clientes CL ON CL.id = C.cliente_id
      ${clientQuery}
    `)

    res.send(cuentas)
  } catch (error) {
    console.log('error', error.message)
    res.status(500).json({ message: error.message })
  }
}

async function handleDeleteRequest(req, res) {
  const connection = await getConnection()
  const { ids } = req.body

  try {
    await connection.execute(
      `DELETE FROM cuentas WHERE id IN (${ids.join(', ')})`
    )

    res.send({ valid: true })
  } catch (error) {
    console.log('error', error.message)
    res.status(500).json({ message: error.message })
  }
}

async function handlePutRequest(req, res) {
  const { id, saldo, fecha_apertura } = req.body

  const connection = await getConnection()

  if (!id || !saldo || !fecha_apertura) {
    res.status(400).json({ message: 'Missing body parameter' })
    return
  }

  try {
    const response = await connection.execute(
      'UPDATE `cuentas` SET `saldo` = ?, `fecha_apertura` = ? WHERE `cuentas`.`id` = ?',
      [Number(saldo), fecha_apertura.split('T')[0], id]
    )

    res.send({ response })
  } catch (error) {
    console.log('error', error.message)
    res.status(500).json({ message: error.message })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
