import '@/styles/globals.css'

import { CssBaseline, Box, Container } from '@mui/material'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 163px)',
        }}
      >
        <CssBaseline />
        <Container component="main" sx={{ mt: 8, mb: 2 }}>
          <Component {...pageProps} />
        </Container>
      </Box>
      <Footer />
    </>
  )
}
