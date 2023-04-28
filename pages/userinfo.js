import { getAuthServerSideProps } from '@/utils/getAuthServerSideProps'
export default function Login(props) {
  return <div>{JSON.stringify(props)}</div>
}
export const getServerSideProps = getAuthServerSideProps
