import {
  Container,
  TextField,
  Button,
  Alert,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { getAuthServerSideProps } from '@/utils/getAuthServerSideProps'

export default function CreatePayment() {
  const [creditId, setCreditId] = useState(1)
  const [paymentId, setPaymentId] = useState('')
  const [amount, setAmount] = useState('')
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [error, setError] = useState('')
  const [credits, setCredits] = useState([])
  const router = useRouter()

  const getCredits = async () => {
    const response = await fetch('/api/getCredits')
    const credits = await response.json()
    setCredits(credits)
  }

  useEffect(() => {
    getCredits()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creditId: creditId,
          paymentId,
          amount,
        }),
      })

      if (!response.ok) {
        const { message } = await response.json()
        throw new Error(message)
      }
      setCreditId('')
      setPaymentId('')
      setAmount('')

      setShowSuccessAlert(true)
      router.push('/pagos')
    } catch (e) {
      setError(e.message)
    }
  }

  const handleCreditIdChange = (event) => {
    console.log('event.target.value', event.target.value)
    setCreditId(event.target.value)
  }

  const handlePaymentIdChange = (event) => {
    console.log('event.target.value', event.target.value)
    setPaymentId(event.target.value)
  }

  const handleAmountChange = (event) => {
    setAmount(event.target.value)
  }

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FormControl>
            <InputLabel id="client-select-label">Crédito ID</InputLabel>
            <Select
              labelId="client-select-label"
              id="client-select"
              value={creditId}
              label="Cliente"
              onChange={handleCreditIdChange}
            >
              {credits.map((credit) => (
                <MenuItem key={credit.id} value={credit.id}>
                  {credit.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Fecha de pago"
            type="date"
            value={paymentId}
            onChange={handlePaymentIdChange}
            margin="normal"
            variant="outlined"
          />

          <TextField
            label="Monto"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            margin="normal"
            variant="outlined"
          />

          <Button variant="contained" type="submit">
            Hacer pago
          </Button>
          {showSuccessAlert && (
            <Alert
              severity="success"
              onClose={() => setShowSuccessAlert(false)}
            >
              Pago realizado de forma exitosa
            </Alert>
          )}

          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}
        </div>
      </form>
    </Container>
  )
}

export const getServerSideProps = getAuthServerSideProps
