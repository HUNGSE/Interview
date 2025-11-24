import React from 'react';
import CategoryForm from '../features/categories/CategoryForm';
import { useParams } from 'react-router-dom';

const EditCategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  return <CategoryForm categoryId={id || ''} />;
};

export default EditCategoryPage;
