import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CategoryIcon from '@mui/icons-material/Category';
import MenuItem from './MenuItem.tsx';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
    openDashboard: () => void;
    openOrders: () => void;
    openNewCategory: () => void;
    openNewProduct: () => void;
}

export default function SideMenu({
    isOpen,
    onClose,
    openDashboard,
    openOrders,
    openNewCategory,
    openNewProduct,
}: SideMenuProps) {
    return (
        <Drawer
            anchor="left"
            open={isOpen}
            onClose={onClose}
            PaperProps={{
                sx: { width: 280 },
            }}
        >
            <List>
                <MenuItem
                    icon={DashboardIcon}
                    text="Dashboard"
                    onClick={() => {
                        onClose();
                        openDashboard();
                    }}
                />
                <MenuItem
                    icon={ShoppingCartIcon}
                    text="Orders"
                    onClick={() => {
                        onClose();
                        openOrders();
                    }}
                />
                <MenuItem
                    icon={CategoryIcon}
                    text="New Category"
                    onClick={() => {
                        onClose();
                        openNewCategory();
                    }}
                />
                <MenuItem
                    icon={AddCircleOutlineIcon}
                    text="New Product"
                    onClick={() => {
                        onClose();
                        openNewProduct();
                    }}
                />
            </List>
        </Drawer>
    );
}
