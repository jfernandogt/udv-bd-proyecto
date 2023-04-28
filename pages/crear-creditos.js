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

import { getColaboratorServerSideProps } from '@/utils/getAuthServerSideProps'

export default function CreateUser() {
  const [client, setClient] = useState(1)
  const [creditType, setCreditType] = useState(1)
  const [amount, setAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [iDate, setIDate] = useState('')
  const [status, setStatus] = useState(1)
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
      const response = await fetch('/api/createCredit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client,
          typeId: creditType,
          amount,
          deadline,
          iDate,
          status: status,
          balance,
        }),
      })

      if (!response.ok) {
        const { message } = await response.json()
        throw new Error(message)
      }

      setClient(''),
        setCreditType(''),
        setAmount(''),
        setDeadline(''),
        setIDate(''),
        setStatus(''),
        setBalance('')

      setShowSuccessAlert(true)
      router.push('/creditos')
    } catch (e) {
      setError(e.message)
    }
  }

  const handleClientChange = (event) => {
    console.log('event.target.value', event.target.value)
    setClient(event.target.value)
  }

  const handleCreditTypeChange = (event) => {
    console.log('event.target.value', event.target.value)
    setCreditType(event.target.value)
  }

  const handleAmountChange = (event) => {
    setAmount(event.target.value)
  }

  const handleDeadlineChange = (event) => {
    setDeadline(event.target.value)
  }

  const handleIDateChange = (event) => {
    setIDate(event.target.value)
  }

  const handleStatusChange = (event) => {
    setStatus(event.target.value)
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

          <TextField
            label="Monto"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            margin="normal"
            variant="outlined"
          />

          <TextField
            label="Plazo"
            type="number"
            value={deadline}
            onChange={handleDeadlineChange}
            margin="normal"
            variant="outlined"
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Tipo de Crédito
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={creditType}
              label="Credito"
              onChange={handleCreditTypeChange}
            >
              <MenuItem value={1}>Hipotecario</MenuItem>
              <MenuItem value={2}>Personal</MenuItem>
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

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label2">Estado</InputLabel>
            <Select
              labelId="demo-simple-select-label2"
              id="demo-simple-select2"
              value={status}
              label="estado"
              onChange={handleStatusChange}
            >
              <MenuItem value={1}>Aprobado</MenuItem>
              <MenuItem value={2}>Pendiente</MenuItem>
              <MenuItem value={3}>Rechazado</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Balance"
            type="number"
            value={balance}
            onChange={handleBalanceChange}
            margin="normal"
            variant="outlined"
          />

          <Button variant="contained" type="submit">
            Crear nuevo Crédito
          </Button>
          {showSuccessAlert && (
            <Alert
              severity="success"
              onClose={() => setShowSuccessAlert(false)}
            >
              Crédito creado exitosamente
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

export const getServerSideProps = getColaboratorServerSideProps
