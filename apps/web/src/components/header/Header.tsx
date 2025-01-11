import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Badge, Box } from '@mui/material';
import { useCart } from '../../context/CartContext.tsx';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CartModal from '../../pages/Cart.tsx';

interface HeaderProps {
    toggleMenu: () => void;
}

export default function Header({ toggleMenu }: HeaderProps) {
    const { cart, isCartOpen, setIsCartOpen } = useCart();

    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleMenu}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton color="inherit" onClick={() => setIsCartOpen(true)}>
                        <Badge badgeContent={cartItemsCount} color="error">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <CartModal open={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
