import { sessionOptions } from '@/lib/session'
import { withIronSessionSsr } from 'iron-session/next'

export const getAuthServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    if (!req.session?.user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      }
    }

    return {
      props: {
        user: req.session.user,
      },
    }
  },
  sessionOptions
)

export const getColaboratorServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    if (!req.session?.user || req.session?.user?.rol !== 2) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      }
    }

    return {
      props: {
        user: req.session.user,
      },
    }
  },
  sessionOptions
)
