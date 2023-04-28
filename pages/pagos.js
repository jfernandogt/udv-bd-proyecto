import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@mui/material'
import Link from 'next/link'

import { getAuthServerSideProps } from '@/utils/getAuthServerSideProps'

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'credito_id',
    headerName: 'ID Crédito',
    width: 150,
    editable: false,
  },
  {
    field: 'fecha_pago',
    headerName: 'Fecha de pago',
    type: 'date',
    width: 150,
    editable: false,
  },
  {
    field: 'monto',
    headerName: 'Monto',
    type: 'number',
    width: 110,
    editable: false,
  },
]

export default function BasicExampleDataGrid({ user }) {
  const [rows, setRows] = useState([])

  const isColaborator = user.rol === 2

  const getPayments = async () => {
    const response = await fetch('/api/payments')
    let payments = await response.json()
    payments = payments.map((p) => ({
      ...p,
      fecha_pago: new Date(p.fecha_pago),
    }))
    setRows(payments)
  }

  useEffect(() => {
    getPayments()
  }, [])

  return (
    <div>
      <div
        style={{
          marginBottom: 20,
          display: isColaborator ? 'none' : 'block',
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

      <div style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />
      </div>
    </div>
  )
}

export const getServerSideProps = getAuthServerSideProps
