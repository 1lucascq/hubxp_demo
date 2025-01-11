import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useCreateCategory } from '../../hooks/useCategories.tsx';

interface NewCategoryFormProps {
    onClose: () => void;
}

export default function NewCategoryForm({ onClose }: NewCategoryFormProps) {
    const [name, setName] = useState('');
    const { mutate: createCategory } = useCreateCategory();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCategory = { name };

        createCategory(newCategory, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <Typography variant="h6">Create New Category</Typography>
            <TextField
                label="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <Button type="submit" variant="contained" color="primary">
                Create Category
            </Button>
        </Box>
    );
}
