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
import { useState } from 'react'
import { useRouter } from 'next/router'

import { getAuthServerSideProps } from '@/utils/getAuthServerSideProps'

export default function CreateUser() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [dateBirth, setDateBirth] = useState('')
  const [address, setAddress] = useState('')
  const [dpi, setDpi] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [rol, setRol] = useState(1)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [error, setError] = useState('')
  const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(true)
  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch('/api/auth/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          rolId: rol,
          firstname,
          lastname,
          dateBirth,
          address,
          dpi,
          phoneNumber,
        }),
      })

      if (!response.ok) {
        const { message } = await response.json()
        throw new Error(message)
      }

      setUsername('')
      setPassword('')
      setEmail('')
      setFirstname('')
      setLastname('')
      setAddress('')
      setDateBirth('')
      setPhoneNumber('')
      setDpi('')
      setShowSuccessAlert(true)
      router.push('/clientes')
    } catch (e) {
      setError(e.message)
    }
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleFirstnameChange = (event) => {
    setFirstname(event.target.value)
  }

  const handleLastnameChange = (event) => {
    setLastname(event.target.value)
  }

  const handleAddressChange = (event) => {
    setAddress(event.target.value)
  }

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value)
  }

  const handleDpiChange = (event) => {
    setDpi(event.target.value)
  }

  const handleDateBirthChange = (event) => {
    setDateBirth(event.target.value)
  }

  const handleRolChange = (event) => {
    setRol(event.target.value)
    if (event.target.value == 1) {
      setShowPersonalInfoForm(true)
    } else {
      setShowPersonalInfoForm(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Nombre de usuario"
            value={username}
            onChange={handleUsernameChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={handleEmailChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
            variant="outlined"
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Rol</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={rol}
              label="Rol"
              onChange={handleRolChange}
            >
              <MenuItem value={1}>Cliente</MenuItem>
              <MenuItem value={2}>Colaborador</MenuItem>
            </Select>
          </FormControl>
          {showPersonalInfoForm && (
            <>
              <TextField
                label="Nombre"
                value={firstname}
                onChange={handleFirstnameChange}
                margin="normal"
                variant="outlined"
              />

              <TextField
                label="Apellido"
                value={lastname}
                onChange={handleLastnameChange}
                margin="normal"
                variant="outlined"
              />

              <TextField
                label="Fecha de nacimiento"
                value={dateBirth}
                type="date"
                onChange={handleDateBirthChange}
                margin="normal"
                variant="outlined"
              />

              <TextField
                label="DPI"
                value={dpi}
                onChange={handleDpiChange}
                margin="normal"
                variant="outlined"
              />

              <TextField
                label="Direccion"
                value={address}
                onChange={handleAddressChange}
                margin="normal"
                variant="outlined"
              />

              <TextField
                label="Teléfono"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                margin="normal"
                variant="outlined"
              />
            </>
          )}

          <Button variant="contained" type="submit">
            Crear nuevo usuario
          </Button>
          {showSuccessAlert && (
            <Alert
              severity="success"
              onClose={() => setShowSuccessAlert(false)}
            >
              Usuario creado exitosamente
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
