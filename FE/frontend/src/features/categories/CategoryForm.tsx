import React, { useState, useEffect } from 'react';
import { createCategory, updateCategory, getCategory, Category } from './CategoryService';

interface CategoryFormProps {
  categoryId?: string;
  onSuccess?: () => void;
}

const initialState: Partial<Category> = {
  name: '',
  isActive: true,
};

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryId, onSuccess }) => {
  const [form, setForm] = useState<Partial<Category>>(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryId) {
  getCategory(categoryId).then(res => setForm(res?? {}));
    }
  }, [categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (categoryId) {
        await updateCategory(categoryId, form);
      } else {
        await createCategory(form);
      }
      if (onSuccess) onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 260 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontWeight: 500, marginBottom: 2 }}>Name</label>
        <input
          name="name"
          value={form.name || ''}
          onChange={handleChange}
          required
          style={{
            padding: '8px 10px',
            border: '1.5px solid #2563eb',
            borderRadius: 6,
            fontSize: 16,
            outline: 'none',
            transition: 'border 0.2s',
          }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <label style={{ fontWeight: 500 }}>Active</label>
        <input
          name="isActive"
          type="checkbox"
          checked={form.isActive ?? true}
          onChange={handleChange}
          style={{ width: 18, height: 18 }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: 10,
          padding: '10px 0',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontWeight: 600,
          fontSize: 18,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          transition: 'background 0.2s',
        }}
      >
        {categoryId ? 'Update' : 'Create'} Category
      </button>
    </form>
  );
};

export default CategoryForm;
