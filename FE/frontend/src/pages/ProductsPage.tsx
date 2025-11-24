import React from 'react';
import ProductList from '../features/products/ProductList';
import AdminLayout from '../layouts/AdminLayout';

const ProductsPage = () => (
	<AdminLayout>
		<ProductList />
	</AdminLayout>
);

export default ProductsPage;
