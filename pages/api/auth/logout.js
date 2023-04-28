import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'

function logoutRoute(req, res, session) {
  req.session.destroy()
  res.send({ ok: true })
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions)
