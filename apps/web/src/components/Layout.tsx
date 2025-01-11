import React from 'react';
import Box from '@mui/material/Box';
import Header from './header/Header.tsx';
import SideMenu from './menu/SideMenu.tsx';
// import SearchArea from './SearchArea.tsx';

interface LayoutProps {
    children: React.ReactNode;
    toggleMenu: () => void;
    isMenuOpen: boolean;
    onMenuClose: () => void;
    openDashboard: () => void;
    openOrders: () => void;
    openNewCategory: () => void;
    openNewProduct: () => void;
}

export default function Layout({
    children,
    toggleMenu,
    isMenuOpen,
    onMenuClose,
    openDashboard,
    openOrders,
    openNewCategory,
    openNewProduct,
}: LayoutProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header toggleMenu={toggleMenu} />
            <SideMenu
                isOpen={isMenuOpen}
                onClose={onMenuClose}
                openDashboard={openDashboard}
                openOrders={openOrders}
                openNewCategory={openNewCategory}
                openNewProduct={openNewProduct}
            />
            <Box component="main" sx={{ flexGrow: 1, p: '1rem' }}>
                {children}
            </Box>
        </Box>
    );
}
