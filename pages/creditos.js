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
      field: 'nombre_cliente',
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
      field: 'nombre',
      headerName: 'Tipo de Credito',
      width: 150,
      editable: false,
    },
    {
      field: 'monto',
      headerName: 'Monto',
      type: 'number',
      width: 110,
      editable: isColaborator,
    },
    {
      field: 'plazo',
      headerName: 'Plazo',
      type: 'string',
      width: 110,
      editable: isColaborator,
    },
    {
      field: 'fecha_inicio',
      headerName: 'Fecha de Inicio',
      type: 'date',
      width: 110,
      editable: isColaborator,
    },
    {
      field: 'saldo',
      headerName: 'Saldo',
      type: 'number',
      width: 110,
      editable: isColaborator,
    },
    {
      field: 'descripcion',
      headerName: 'Estado',
      type: 'number',
      width: 110,
      editable: false,
    },
  ]

  const getCredits = async () => {
    const response = await fetch('/api/getCredits')
    let credits = await response.json()
    credits = credits.map((credit) => ({
      ...credit,
      fecha_inicio: new Date(credit.fecha_inicio),
    }))
    setRows(credits)
  }

  useEffect(() => {
    getCredits()
  }, [])

  const handleEditRow = useCallback(async (newValue, oldValue) => {
    await fetch('/api/updateCredit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newValue),
    })
    return { ...newValue, monto: Number(newValue.monto) }
  })

  const handleDeleteRows = async () => {
    await fetch('/api/deleteCredits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedRows }),
    })

    await getCredits()
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 20,
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          style={{
            marginRight: 20,
          }}
        >
          <Link
            style={{
              textDecoration: 'none',
              color: 'white',
            }}
            href="/pagos"
          >
            Ver Pagos
          </Link>
        </Button>
        <div
          style={{
            display: isColaborator ? 'inline-block' : 'none',
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
            Eliminar Crédito
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={{
              marginRight: 20,
            }}
          >
            <Link
              style={{
                textDecoration: 'none',
                color: 'white',
              }}
              href="/crear-creditos"
            >
              Agregar Crédito
            </Link>
          </Button>
        </div>

        <div
          style={{
            display: isColaborator ? 'none' : 'inline-block',
          }}
        >
          <Button variant="contained" color="secondary">
            <Link
              style={{
                textDecoration: 'none',
                color: 'white',
              }}
              href="/crear-pagos"
            >
              Hacer pago
            </Link>
          </Button>
        </div>
      </div>

      <div style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={rows}
          editMode="row"
          columns={columns}
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
