import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ProductsPage from '../pages/ProductsPage';
import CreateProductPage from '../pages/CreateProductPage';
import EditProductPage from '../pages/EditProductPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CategoryPage from '../pages/CategoryPage';
import CreateCategoryPage from '../pages/CreateCategoryPage';
import EditCategoryPage from '../pages/EditCategoryPage';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/create" element={<CreateProductPage />} />
      <Route path="/products/:id/edit" element={<EditProductPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/categories/create" element={<CreateCategoryPage />} />
      <Route path="/categories/:id/edit" element={<EditCategoryPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
