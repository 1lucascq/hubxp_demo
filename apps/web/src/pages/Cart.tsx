import React from 'react';
import { Modal, Box, Typography, List, ListItem, IconButton, Button, Divider, styled } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useCart } from '../context/CartContext.tsx';

interface CartModalProps {
    open: boolean;
    onClose: () => void;
}

const StyledBox = styled(Box)`
    position: 'absolute';
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background-color: 'background.paper';
    box-shadow: 24;
    padding: 16px;
    max-height: 90vh;
    overflow: auto;
`;

export default function CartModal({ open, onClose }: CartModalProps) {
    const { cart, totalValue, increaseQuantity, decreaseQuantity, placeOrder, isLoading } = useCart();

    return (
        <Modal open={open} onClose={onClose}>
            <StyledBox>
                <Typography variant="h6" component="h2" gutterBottom>
                    Shopping Cart
                </Typography>
                <List>
                    {cart.map((item) => (
                        <ListItem key={item._id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="body1">{item.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ${item.price.toFixed(2)} x {item.quantity}
                                </Typography>
                            </Box>
                            <Box>
                                <IconButton onClick={() => decreaseQuantity(item._id)}>
                                    <RemoveIcon />
                                </IconButton>
                                <Typography component="span" sx={{ mx: 1 }}>
                                    {item.quantity}
                                </Typography>
                                <IconButton onClick={() => increaseQuantity(item._id)}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Total: ${totalValue.toFixed(2)}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={placeOrder}
                    disabled={cart.length === 0 || isLoading}
                >
                    {isLoading ? 'Placing Order...' : 'Place Order'}
                </Button>
            </StyledBox>
        </Modal>
    );
}
