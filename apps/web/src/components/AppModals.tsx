import React from 'react';
import { Modal, Box } from '@mui/material';
import Dashboard from '../pages/Dashboard.tsx';
import Orders from '../pages/Orders.tsx';
import NewCategoryForm from './category/NewCategoryForm.tsx';
import NewProductForm from './product/NewProductForm.tsx';
import { Order } from '../types/index.ts';

interface AppModalsProps {
    isDashboardOpen: boolean;
    isOrdersOpen: boolean;
    isNewCategoryOpen: boolean;
    isNewProductOpen: boolean;
    setIsDashboardOpen: (open: boolean) => void;
    setIsOrdersOpen: (open: boolean) => void;
    setIsNewCategoryOpen: (open: boolean) => void;
    setIsNewProductOpen: (open: boolean) => void;
    orders: Order[];
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 900,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflow: 'auto',
};

export default function AppModals({
    isDashboardOpen,
    isOrdersOpen,
    isNewCategoryOpen,
    isNewProductOpen,
    setIsDashboardOpen,
    setIsOrdersOpen,
    setIsNewCategoryOpen,
    setIsNewProductOpen,
    orders,
}: AppModalsProps) {
    return (
        <>
            <Modal
                open={isDashboardOpen}
                onClose={() => setIsDashboardOpen(false)}
                aria-labelledby="dashboard-modal"
            >
                <Box sx={modalStyle}>
                    <Dashboard />
                </Box>
            </Modal>

            <Modal open={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} aria-labelledby="orders-modal">
                <Box sx={modalStyle}>
                    <Orders orders={orders} />
                </Box>
            </Modal>

            <Modal
                open={isNewCategoryOpen}
                onClose={() => setIsNewCategoryOpen(false)}
                aria-labelledby="new-category-modal"
            >
                <Box sx={modalStyle}>
                    <NewCategoryForm onClose={() => setIsNewCategoryOpen(false)} />
                </Box>
            </Modal>

            <Modal
                open={isNewProductOpen}
                onClose={() => setIsNewProductOpen(false)}
                aria-labelledby="new-product-modal"
            >
                <Box sx={modalStyle}>
                    <NewProductForm onClose={() => setIsNewProductOpen(false)} />
                </Box>
            </Modal>
        </>
    );
}
