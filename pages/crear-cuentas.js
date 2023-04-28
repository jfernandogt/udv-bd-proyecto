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

export default function CreateAccount() {
  const [client, setClient] = useState(1)
  const [accountType, setAccountType] = useState(1)
  const [deadline, setDeadline] = useState('')
  const [iDate, setIDate] = useState('')
  const [balance, setBalance] = useState('')
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [error, setError] = useState('')
  const [clients, setClients] = useState([])
  const router = useRouter()

  const getClients = async () => {
    const response = await fetch('/api/clients')
    const clients = await response.json()
    setClients(clients)
  }

  useEffect(() => {
    getClients()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client,
          typeId: accountType,
          iDate,
          balance,
        }),
      })

      if (!response.ok) {
        const { message } = await response.json()
        throw new Error(message)
      }

      setClient('')
      setAccountType('')
      setIDate('')
      setBalance('')

      setShowSuccessAlert(true)
      router.push('/cuentas')
    } catch (e) {
      setError(e.message)
    }
  }

  const handleClientChange = (event) => {
    console.log('event.target.value', event.target.value)
    setClient(event.target.value)
  }

  const handleAccountTypeChange = (event) => {
    console.log('event.target.value', event.target.value)
    setAccountType(event.target.value)
  }

  const handleIDateChange = (event) => {
    setIDate(event.target.value)
  }

  const handleBalanceChange = (event) => {
    setBalance(event.target.value)
  }

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FormControl>
            <InputLabel id="client-select-label">Cliente</InputLabel>
            <Select
              labelId="client-select-label"
              id="client-select"
              value={client}
              label="Cliente"
              onChange={handleClientChange}
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.nombre} {client.apellido}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Tipo de Cuenta
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={accountType}
              label="Credito"
              onChange={handleAccountTypeChange}
            >
              <MenuItem value={1}>Ahorro</MenuItem>
              <MenuItem value={2}>Monetaria</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Fecha de Inicio"
            type="date"
            value={iDate}
            onChange={handleIDateChange}
            margin="normal"
            variant="outlined"
          />

          <TextField
            label="Balance"
            type="number"
            value={balance}
            onChange={handleBalanceChange}
            margin="normal"
            variant="outlined"
          />

          <Button variant="contained" type="submit">
            Crear nueva Cuenta
          </Button>
          {showSuccessAlert && (
            <Alert
              severity="success"
              onClose={() => setShowSuccessAlert(false)}
            >
              Cuenta creada exitosamente
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
