import React from 'react';
import ProductForm from '../features/products/ProductForm';
import { useParams } from 'react-router-dom';

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  return <ProductForm productId={id} />;
};

export default EditProductPage;
