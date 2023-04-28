import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'

import getConnection from '@/lib/dbconnection'

async function getCredits(req, res) {
  const { ids } = await req.body
  const connection = await getConnection()

  const authUser = req.session.user

  if (!authUser?.isLoggedIn) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    await connection.execute(
      `DELETE FROM creditos WHERE id IN (${ids.join(', ')})`
    )

    res.send({ valid: true })
  } catch (error) {
    console.log('error', error.message)
    res.status(500).json({ message: error.message })
  }
}

export default withIronSessionApiRoute(getCredits, sessionOptions)
