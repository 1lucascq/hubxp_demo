import React from 'react';
import ReactDOM from 'react-dom/client';
import { CartProvider } from './context/CartContext.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { CssBaseline } from '@mui/material';
import App from './App.tsx';
import theme from './styles/theme.ts';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <CartProvider>
                    <App />
                </CartProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
