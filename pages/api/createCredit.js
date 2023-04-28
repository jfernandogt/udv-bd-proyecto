import getConnection from '@/lib/dbconnection'

async function createCredit(req, res) {
  const { clientId, typeId, amount, deadline, iDate, status, balance } =
    await req.body

  try {
    if (
      !clientId ||
      !typeId ||
      !amount ||
      !deadline ||
      !iDate ||
      !status ||
      !balance
    ) {
      res.status(500).send({ valid: false, message: 'Please fill all fields' })
      return
    }

    const connection = await getConnection()

    await connection.execute(
      'INSERT INTO creditos (cliente_id, tipo_credito_id, monto, plazo, fecha_inicio, estado, saldo) VALUES(?, ?, ?, ?, ?, ?, ?)',
      [clientId, typeId, amount, deadline, iDate, status, balance]
    )

    res.send({ valid: true, message: 'User created' })
  } catch (error) {
    res.status(500).json({ valid: false, message: error.message })
  }
}

export default createCredit
