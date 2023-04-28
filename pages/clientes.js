import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid'
import { Button } from '@mui/material'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

import { getAuthServerSideProps } from '@/utils/getAuthServerSideProps'
const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'nombre',
    headerName: 'Nombre',
    width: 150,
    editable: true,
  },
  {
    field: 'apellido',
    headerName: 'Apellido',
    width: 150,
    editable: true,
  },
  {
    field: 'dpi',
    headerName: 'DPI',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'fecha_nacimiento',
    headerName: 'Fecha Nacimiento',
    type: 'date',
    width: 150,
    editable: true,
  },
  {
    field: 'direccion',
    headerName: 'Dirección',
    type: 'number',
    width: 200,
    editable: true,
  },
  {
    field: 'telefono',
    headerName: 'Teléfono',
    type: 'number',
    width: 150,
    editable: true,
  },
]

export default function ShowClientes() {
  const apiRef = useGridApiRef()
  const [rows, setRows] = useState([])
  const [selectedRows, setSelectedRows] = useState([])

  const getClients = async () => {
    const response = await fetch('/api/clients')
    let clients = await response.json()

    clients = clients.map((c) => ({
      ...c,
      fecha_nacimiento: new Date(c.fecha_nacimiento),
    }))
    setRows(clients)
  }

  useEffect(() => {
    getClients()
  }, [])

  const handleEditRow = useCallback(async (newValue) => {
    await fetch('/api/updateClient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newValue),
    })

    return { ...newValue }
  })

  const handleDeleteRows = async () => {
    await fetch('/api/deleteClients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedRows }),
    })

    await getClients()
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 20,
        }}
      >
        <Button
          style={{
            marginRight: 20,
          }}
          variant="contained"
          color="error"
          disabled={selectedRows.length === 0}
          onClick={handleDeleteRows}
        >
          Eliminar Usuarios
        </Button>
        <Button variant="contained" color="secondary">
          <Link
            style={{
              textDecoration: 'none',
              color: 'white',
            }}
            href="/crear-usuario"
          >
            Crear Usuario
          </Link>
        </Button>
      </div>

      <div style={{ height: 650, width: '100%' }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          editMode="row"
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          processRowUpdate={handleEditRow}
          checkboxSelection
          onRowSelectionModelChange={setSelectedRows}
        />
      </div>
    </div>
  )
}

export const getServerSideProps = getAuthServerSideProps
