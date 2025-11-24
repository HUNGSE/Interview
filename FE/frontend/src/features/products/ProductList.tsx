import React, { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getProducts, deleteProduct, getProduct } from './ProductService';
import { Product } from "../../types/product";

import ProductForm from './ProductForm';
import ProductDetail from './ProductDetail';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 20;
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setFiltered(
        products.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      );
      setPage(1);
    }, 350);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [products, search]);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedProducts = filtered.slice((page - 1) * pageSize, page * pageSize);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailProductId, setDetailProductId] = useState<string | null>(null);
  const handleDetail = (id: string) => {
    setDetailProductId(id);
    setDetailOpen(true);
  };
  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts()
      .then(res => setProducts(res.items))
      .catch(e => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        toast.success('Product deleted');
      } catch (e) {
        toast.error('Delete failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (id: string) => {
    setEditProductId(id);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditProductId(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditProductId(null);
    setLoading(true);
    getProducts()
      .then(res => {
        setProducts(res.items);
        toast.success('Saved successfully');
      })
      .catch(() => toast.error('Failed to reload products'))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="mgmt-card" style={{ margin: '0 auto', padding: 8 }}>
        <div className="mgmt-header">
          <div className="mgmt-header-title">
            <span className="mgmt-header-icon">📦</span>
            <h2>Product Management</h2>
          </div>
          <button className="mgmt-create-btn" onClick={handleCreate}>Create Product</button>
        </div>
        <div className="mgmt-toolbar" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <input
            className="mgmt-search"
            placeholder="Search product name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
          />
          <button
            className="mgmt-search-btn"
            onClick={e => { e.preventDefault(); }}
          >Search</button>
        </div>
        <div className="mgmt-table-wrapper" style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center' }}>
              <span className="spinner" style={{ width: 32, height: 32, border: '4px solid #eee', borderTop: '4px solid #007bff', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : error ? (
            <div style={{ color: 'red', padding: 32, textAlign: 'center' }}>{error}</div>
          ) : filtered.length === 0 ? (
            <div style={{ color: '#888', padding: 32, textAlign: 'center' }}>No products found.</div>
          ) : (
            <table className="mgmt-table responsive-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Base Price</th>
                  <th>Active</th>
                  <th>Image</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedProducts.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>{p.basePrice}</td>
                    <td>{p.isActive ? 'Yes' : 'No'}</td>
                    <td>
                      {p.imageUrls && p.imageUrls.length > 0 ? (
                        <img
                          src={p.imageUrls[0]}
                          alt={p.name}
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 4
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <span style={{ color: '#aaa' }}>No image</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button onClick={() => handleDetail(p.id)}>Detail</button>
                      <button onClick={() => handleEdit(p.id)}>Edit</button>
                      <button onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {}
        <style>{`
          @media (max-width: 800px) {
            .responsive-table th, .responsive-table td { padding: 8px 4px; font-size: 13px; }
            .mgmt-header, .mgmt-toolbar { flex-direction: column; align-items: flex-start; }
            .mgmt-header-title h2 { font-size: 18px; }
            .mgmt-create-btn { margin-top: 8px; }
          }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 8 }}>
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
          <span style={{ alignSelf: 'center' }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
        </div>
      </div>
      {modalOpen && (
        <div className="modal-backdrop" style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            minWidth: 340,
            maxWidth: 600,
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            padding: 0
          }}>
            <div style={{
              position: 'sticky',
              top: 0,
              background: '#fff',
              zIndex: 2,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: '28px 28px 0 28px',
              minHeight: 60,
              display: 'flex',
              alignItems: 'center',
              fontWeight: 700,
              fontSize: 28
            }}>
              <span style={{ flex: 1 }}>{editProductId ? 'Edit Product' : 'Create Product'}</span>
              <button
                onClick={handleModalClose}
                title="Close"
                style={{
                  marginLeft: 12,
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: '#f3f4f6',
                  border: 'none',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#222',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  transition: 'background 0.2s',
                  zIndex: 10
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#e5e7eb')}
                onMouseOut={e => (e.currentTarget.style.background = '#f3f4f6')}
              >
                ×
              </button>
            </div>
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0 28px 28px 28px',
              minHeight: 0
            }}>
              <ProductForm productId={editProductId ?? undefined} onSuccess={handleModalClose} hideTitle />
            </div>
          </div>
        </div>
      )}

      {detailOpen && detailProductId && (
        <div className="modal-backdrop" style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            minWidth: 340,
            maxWidth: 600,
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            padding: 0
          }}>
            <div style={{
              position: 'sticky',
              top: 0,
              background: '#fff',
              zIndex: 2,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: '28px 28px 0 28px',
              minHeight: 60,
              display: 'flex',
              alignItems: 'center',
              fontWeight: 700,
              fontSize: 28
            }}>
              <span style={{ flex: 1 }}>Product Detail</span>
              <button
                onClick={() => { setDetailOpen(false); setDetailProductId(null); }}
                title="Close"
                style={{
                  marginLeft: 12,
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: '#f3f4f6',
                  border: 'none',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#222',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  transition: 'background 0.2s',
                  zIndex: 10
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#e5e7eb')}
                onMouseOut={e => (e.currentTarget.style.background = '#f3f4f6')}
              >
                ×
              </button>
            </div>
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0 28px 28px 28px',
              minHeight: 0
            }}>
              {}
              <React.Suspense fallback={<div>Loading...</div>}>
                {detailProductId && (
                  <ProductDetail productId={detailProductId} />
                )}
              </React.Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductList;
