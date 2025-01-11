import React, { useState } from 'react';
import Layout from './components/Layout.tsx';
import ProductList from './components/product/ProductList.tsx';
import AppModals from './components/AppModals.tsx';
import { useFetchCategories } from './hooks/useCategories.tsx';
import { useProducts } from './hooks/useProducts.tsx';
import { useFetchOrders } from './hooks/useOrders.tsx';

export default function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
    const [isNewProductOpen, setIsNewProductOpen] = useState(false);

    const { isLoading: isLoadingCategories, error: errorCategories } = useFetchCategories();
    const { data: products, isLoading: isLoadingProducts, error: errorProducts } = useProducts();
    const { data: orders, isLoading: isLoadingOrders, error: errorOrders } = useFetchOrders();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const openDashboard = () => {
        setIsDashboardOpen(true);
        setIsMenuOpen(false);
    };
    const openOrders = () => {
        setIsOrdersOpen(true);
        setIsMenuOpen(false);
    };
    const openNewCategory = () => {
        setIsNewCategoryOpen(true);
        setIsMenuOpen(false);
    };
    const openNewProduct = () => {
        setIsNewProductOpen(true);
        setIsMenuOpen(false);
    };

    if (isLoadingCategories || isLoadingProducts || isLoadingOrders) {
        return <div>Loading...</div>;
    }

    if (errorCategories || errorProducts || errorOrders) {
        return <div>An error occurred while fetching data</div>;
    }

    return (
        <>
            <Layout
                toggleMenu={toggleMenu}
                isMenuOpen={isMenuOpen}
                onMenuClose={() => setIsMenuOpen(false)}
                openDashboard={openDashboard}
                openOrders={openOrders}
                openNewCategory={openNewCategory}
                openNewProduct={openNewProduct}
            >
                <ProductList products={products!} />
            </Layout>

            <AppModals
                isDashboardOpen={isDashboardOpen}
                isOrdersOpen={isOrdersOpen}
                isNewCategoryOpen={isNewCategoryOpen}
                isNewProductOpen={isNewProductOpen}
                setIsDashboardOpen={setIsDashboardOpen}
                setIsOrdersOpen={setIsOrdersOpen}
                setIsNewCategoryOpen={setIsNewCategoryOpen}
                setIsNewProductOpen={setIsNewProductOpen}
                orders={orders!}
            />
        </>
    );
}
