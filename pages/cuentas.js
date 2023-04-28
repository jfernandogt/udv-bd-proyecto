import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@mui/material'

import Link from 'next/link'
import { getAuthServerSideProps } from '@/utils/getAuthServerSideProps'

export default function BasicExampleDataGrid({ user }) {
  const [rows, setRows] = useState([])
  const [selectedRows, setSelectedRows] = useState([])

  const isColaborator = user.rol === 2

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'cliente_id',
      headerName: 'Cliente ID',
      width: 150,
      editable: false,
    },
    {
      field: 'nombre',
      headerName: 'Nombres',
      width: 150,
      editable: false,
    },
    {
      field: 'apellido',
      headerName: 'Apellidos',
      width: 150,
      editable: false,
    },
    {
      field: 'descripcion',
      headerName: 'Tipo de Credito',
      width: 150,
      editable: false,
    },
    {
      field: 'saldo',
      headerName: 'Saldo',
      type: 'number',
      width: 110,
      editable: isColaborator,
    },
    {
      field: 'fecha_apertura',
      headerName: 'Fecha Apertura',
      type: 'date',
      width: 200,
      editable: isColaborator,
    },
  ]

  useEffect(() => {
    const getAccounts = async () => {
      const response = await fetch('/api/accounts')
      let accounts = await response.json()
      accounts = accounts.map((a) => ({
        ...a,
        fecha_apertura: new Date(a.fecha_apertura),
      }))
      setRows(accounts)
    }

    getAccounts()
  }, [])

  const handleDeleteRows = async () => {
    await fetch('/api/accounts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedRows }),
    })
    await getAccounts()
  }

  const handleEditRow = useCallback(async (newValue) => {
    await fetch('/api/accounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newValue),
    })
    return { ...newValue, monto: Number(newValue.monto) }
  })

  return (
    <div>
      <div
        style={{
          marginBottom: 20,
          display: isColaborator ? '' : 'none',
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
          Eliminar Cuentas
        </Button>
        <Button variant="contained" color="secondary">
          <Link
            style={{
              textDecoration: 'none',
              color: 'white',
            }}
            href="/crear-cuentas"
          >
            Agregar Cuenta
          </Link>
        </Button>
      </div>
      <div style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          slots={{ toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          processRowUpdate={handleEditRow}
          checkboxSelection={isColaborator}
          onRowSelectionModelChange={setSelectedRows}
          onProcessRowUpdateError={(e) => console.log(e)}
        />
      </div>
    </div>
  )
}

export const getServerSideProps = getAuthServerSideProps
