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
    handleGetPayments(req, res)
  } else if (req.method === 'POST') {
    handleInsertPayments(req, res)
  } else if (req.method === 'PUT') {
    handlePutRequest(req, res)
  } else if (req.method === 'DELETE') {
    handleDeleteRequest(req, res)
  } else {
    res.status(405).end()
  }
}

async function handleInsertPayments(req, res) {
  const { creditId, paymentId, amount } = await req.body
  try {
    if (!creditId || !paymentId || !amount) {
      res.status(500).send({ valid: false, message: 'Please fill all fields' })
      return
    }

    const connection = await getConnection()

    const [data] = await connection.execute(
      'INSERT INTO pagos (credito_id, fecha_pago, monto) VALUES(?, ?, ?)',
      [creditId, paymentId, amount]
    )

    res.send({ valid: true, message: 'User created' })
  } catch (error) {
    res.status(500).json({ valid: false, message: error.message })
  }
}

async function handleGetPayments(req, res) {
  const connection = await getConnection()
  try {
    const [pagos] = await connection.execute(`SELECT * FROM pagos`)

    res.send(pagos)
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
      'UPDATE `pagos` SET `saldo` = ?, `fecha_apertura` = ? WHERE `cuentas`.`id` = ?',
      [Number(saldo), fecha_apertura.split('T')[0], id]
    )

    res.send({ response })
  } catch (error) {
    console.log('error', error.message)
    res.status(500).json({ message: error.message })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
