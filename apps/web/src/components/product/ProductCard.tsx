import React, { useState } from 'react';
import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
    Modal,
    Box,
    styled,
} from '@mui/material';
import { Product } from '../../types/index.ts';
import EditProductForm from './EditProductForm.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { AddShoppingCart } from '@mui/icons-material';

interface ProductCardProps {
    product: Product;
}

const StyledCard = styled(Card)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	transition: 'transform 0.2s ease-in-out',
	'&:hover': {
		transform: 'scale(1.02)',
	},
}));

const StyledCardActionArea = styled(CardActionArea)({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
});

const StyledCardMedia = styled(CardMedia)<{
    component: string;
    image: string;
    alt: string;
}>(() => ({
    height: 200,
    objectFit: 'contain',
    objectPosition: 'center',
    backgroundColor: '#f5f5f5',
}));

export default function ProductCard({ product }: ProductCardProps) {
    const [open, setOpen] = useState(false);
    const { addToCart, cart } = useCart();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const isInCart = cart.some((item) => item._id === product._id);

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <>
            <StyledCard>
                <StyledCardActionArea>
                    <StyledCardMedia component="img" image={product.imageUrl} alt={product.name} />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {product.description}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                            ${product.price.toFixed(2)}
                        </Typography>
                    </CardContent>
                </StyledCardActionArea>
                <CardActions sx={{ mt: 'auto', justifyContent: 'space-between' }}>
                    <Button
                        size="small"
                        color="primary"
                        onClick={handleAddToCart}
                        disabled={isInCart}
                        startIcon={<AddShoppingCart />}
                        className="cta"
                    >
                        {isInCart ? 'In Cart' : 'Add to Cart'}
                    </Button>
                    <Button size="small" color="primary" onClick={handleOpen}>
                        Edit
                    </Button>
                </CardActions>
            </StyledCard>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <EditProductForm
                        onClose={handleClose}
                        initialData={{
                            _id: product._id,
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            imageUrl: product.imageUrl,
                            categories: product.categories,
                        }}
                    />
                </Box>
            </Modal>
        </>
    );
}
