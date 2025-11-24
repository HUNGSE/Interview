import React, { useEffect, useState } from 'react';
import { getCategories, Category } from './CategoryService';

interface CategorySelectProps {
  value?: string;
  onChange?: (categoryId: string) => void;
  disabled?: boolean;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange, disabled }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(res => setCategories(res));
  }, []);

  return (
    <select value={value} onChange={e => onChange && onChange(e.target.value)} disabled={disabled}>
      <option value="">Select category</option>
      {categories.map(c => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </select>
  );
};

export default CategorySelect;
