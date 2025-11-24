import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct, getProduct } from './ProductService';
import CategorySelect from '../categories/CategorySelect';

interface ProductFormProps {
  productId?: string;
  onSuccess?: () => void;
  readOnly?: boolean;
  hideTitle?: boolean;
}

const initialState = {
  name: "",
  description: "",
  sku: "",
  basePrice: 0,
  categoryId: "",
  isActive: true,
  variants: [],
  imageUrls: [""],
  rowVersion: ""
};

const ProductForm: React.FC<ProductFormProps> = ({ productId, onSuccess, readOnly, hideTitle }) => {
  const [form, setForm] = useState<any>(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      getProduct(productId).then(prod => {
        setForm({
          ...prod,
          variants: prod.variants,   
          imageUrls: prod.imageUrls,
          rowVersion: prod.rowVersion    
        });
      });
    }
  }, [productId]);

  // FIELD CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setForm((prev: any) => ({ ...prev, [name]: val }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setForm((prev: any) => ({ ...prev, categoryId }));
  };
  const handleVariantChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev: any) => {
      const variants = [...prev.variants];
      variants[idx] = { ...variants[idx], [name]: value };
      return { ...prev, variants };
    });
  };

  const addVariant = () => {
    setForm((prev: any) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { id: undefined, color: "", size: "", additionalPrice: 0, stockQuantity: 0 }
      ]
    }));
  };

  const removeVariant = (idx: number) => {
    setForm((prev: any) => ({
      ...prev,
      variants: prev.variants.filter((_: any, i: number) => i !== idx)
    }));
  };

  const handleImageUrlChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setForm((prev: any) => {
      const imgs = [...prev.imageUrls];
      imgs[idx] = value;
      return { ...prev, imageUrls: imgs };
    });
  };

  const addImageUrl = () => {
    setForm((prev: any) => ({ ...prev, imageUrls: [...prev.imageUrls, ""] }));
  };

  const removeImageUrl = (idx: number) => {
    setForm((prev: any) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_: any, i: number) => i !== idx)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      description: form.description,
      sku: form.sku,
      basePrice: Number(form.basePrice),
      categoryId: form.categoryId,
      rowVersion: form.rowVersion,
      isActive: form.isActive,                  
      variants: form.variants.map((v: any) => ({
        id: v.id,                                  
        color: v.color,
        size: v.size,
        additionalPrice: Number(v.additionalPrice),
        stockQuantity: Number(v.stockQuantity)
      })),
      imageUrls: form.imageUrls.filter((x: string) => x.trim() !== "")
    };

    try {
      if (productId) {
        const updated = await updateProduct(productId, payload);
        if (updated?.rowVersion) {
          setForm((prev: any) => ({
            ...prev,
            rowVersion: updated.rowVersion
          }));
        }

      } else {
        await createProduct(payload);
      }

      if (onSuccess) onSuccess();

    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">

      {!hideTitle &&
        <h2 className="form-title">
          {productId ? (readOnly ? "Product Detail" : "Edit Product") : "Create Product"}
        </h2>
      }

      {}
      <div className="form-row">
        <div className="form-group">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} disabled={readOnly} required />
        </div>
        <div className="form-group">
          <label>SKU</label>
          <input name="sku" value={form.sku} onChange={handleChange} disabled={readOnly} required />
        </div>
      </div>

      {}
      <div className="form-row">
        <div className="form-group">
          <label>Base Price</label>
          <input name="basePrice" type="number" min={0} value={form.basePrice} onChange={handleChange} disabled={readOnly} />
        </div>

        <div className="form-group">
          <label>Category</label>
          <CategorySelect value={form.categoryId} onChange={handleCategoryChange} disabled={readOnly} />
        </div>
      </div>

      {}
      <div className="form-group">
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} disabled={readOnly} />
      </div>

      {}
      <div className="form-section">
        <label className="section-title">Variants</label>

        {form.variants.map((v: any, idx: number) => (
          <div className="variant-row" key={idx}>
            <input placeholder="Color" name="color" value={v.color} onChange={(e) => handleVariantChange(idx, e)} disabled={readOnly} />
            <input placeholder="Size" name="size" value={v.size} onChange={(e) => handleVariantChange(idx, e)} disabled={readOnly} />
            <input type="number" placeholder="Additional Price" name="additionalPrice" value={v.additionalPrice} onChange={(e) => handleVariantChange(idx, e)} disabled={readOnly} />
            <input type="number" placeholder="Stock Qty" name="stockQuantity" value={v.stockQuantity} onChange={(e) => handleVariantChange(idx, e)} disabled={readOnly} />
            {!readOnly && <button type="button" className="danger" onClick={() => removeVariant(idx)}>Remove</button>}
          </div>
        ))}

        {!readOnly && <button type="button" className="add-btn" onClick={addVariant}>+ Add Variant</button>}
      </div>

      {}
      <div className="form-section">
        <label className="section-title">Image URLs</label>

        {form.imageUrls.map((url: string, idx: number) => (
          <div className="variant-row" key={idx}>
            <input placeholder="Image URL" value={url} onChange={(e) => handleImageUrlChange(idx, e)} disabled={readOnly} />
            {!readOnly && <button type="button" className="danger" onClick={() => removeImageUrl(idx)}>Remove</button>}
          </div>
        ))}

        {!readOnly && <button type="button" className="add-btn" onClick={addImageUrl}>+ Add Image</button>}
      </div>

      {!readOnly &&
        <button className="submit-btn" type="submit" disabled={loading}>
          {productId ? "Update Product" : "Create Product"}
        </button>
      }

    </form>
  );
};

export default ProductForm;
