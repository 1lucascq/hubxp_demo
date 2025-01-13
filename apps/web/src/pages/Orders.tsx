import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Order } from '../types/index.ts';

interface OrdersProps {
    orders: Order[];
}

export default function Orders({ orders }: OrdersProps) {
    const columns: GridColDef[] = [
        { field: '_id', headerName: 'Order ID', flex: 1, align: 'center', headerAlign: 'center' },
        { field: 'date', headerName: 'Date', flex: 1, align: 'center', headerAlign: 'center' },
        { field: 'total', headerName: 'Total', flex: 1, align: 'center', headerAlign: 'center' },
    ];

    return (
        <div style={{ height: 'calc(100vh - 200px)', width: '100%' }}>
            <DataGrid
                rows={orders}
                columns={columns}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                isRowSelectable={() => false}
                getRowId={(row) => row._id}
            />
        </div>
    );
}
