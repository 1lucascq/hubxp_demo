import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { Category, Product } from '../../types/index.ts';
import { useQueryClient } from '@tanstack/react-query';

interface ProductFormProps {
    initialData?: Omit<Product, '_id' | 'imageUrl'> & { _id?: string };
    onSubmit: (data: any) => void;
    onDelete?: () => void;
    submitButtonText: string;
}

export default function ProductForm({
    initialData = { name: '', description: '', price: 0, categories: [] },
    onSubmit,
    onDelete,
    submitButtonText,
}: ProductFormProps) {
    const [name, setName] = useState(initialData.name);
    const [description, setDescription] = useState(initialData.description);
    const [price, setPrice] = useState(initialData.price);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initialData.categories.map((category) => category._id),
    );

    const queryClient = useQueryClient();
    const categories = queryClient.getQueryData<Category[]>(['categories']);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name,
            description,
			imageFile,
            price: price,
            categories: selectedCategories,
        });
    };

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
        );
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <Typography variant="h6">
                {submitButtonText}
                {initialData._id && `: ${initialData._id}`}
            </Typography>
            <TextField label="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
                required
            />
            <TextField
                label="Price"
                value={price}
                onChange={(e) => setPrice(+e.target.value)}
                type="number"
                required
            />
            <Button component="label" variant="outlined" sx={{ mt: 2 }}>
                Upload Image
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
            </Button>
            {imageFile && (
                <Typography variant="body2" color="textSecondary">
                    Selected file: {imageFile.name}
                </Typography>
            )}
            <Typography variant="subtitle1">Categories</Typography>
            <FormGroup>
                {categories?.map((category) => (
                    <FormControlLabel
                        key={category._id}
                        control={
                            <Checkbox
                                checked={selectedCategories.includes(category._id)}
                                onChange={() => handleCategoryChange(category._id)}
                            />
                        }
                        label={category.name}
                    />
                ))}
            </FormGroup>
            <Button type="submit" variant="contained" color="primary">
                {submitButtonText}
            </Button>
            {onDelete && (
                <Button variant="contained" color="error" onClick={onDelete}>
                    Delete Product
                </Button>
            )}
        </Box>
    );
}
