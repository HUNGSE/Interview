import React from 'react';
import ProductDetail from '../features/products/ProductDetail';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  return <ProductDetail productId={id || ''} />;
};

export default ProductDetailPage;
