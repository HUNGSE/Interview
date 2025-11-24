import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCategories, deleteCategory, updateCategory, Category } from "./CategoryService";
import CategoryForm from "./CategoryForm";

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);

  const pageSize = 5;
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setLoading(true);
    getCategories()
      .then((res) => setCategories(res))
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  };


  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      const s = search.toLowerCase();
      setFiltered(categories.filter((c) => c.name.toLowerCase().includes(s)));
      setPage(1);
    }, 300);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search, categories]);

  // Paging
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedCategories = filtered.slice((page - 1) * pageSize, page * pageSize);
  const handleEdit = (id: string, name: string) => {
    setEditId(id);
    setEditName(name);
  };

  const handleEditSave = async (id: string) => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      await updateCategory(id, { name: editName });
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: editName } : c))
      );
      toast.success("Updated successfully");
    } catch {
      toast.error("Update failed");
    }

    setEditId(null);
    setEditName("");
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditName("");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <div className="mgmt-card" style={{ padding: 8 }}>
        {}
        <div
          className="mgmt-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div className="mgmt-header-title" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ background: "#f3f4f6", borderRadius: 8, padding: 8 }}>
              <img
                src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4c1.png"
                alt="Category"
                style={{ width: 36, height: 36 }}
              />
            </span>
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: 32, color: "#26324B" }}>
              Category Management
            </h2>
          </div>

          <button
            className="mgmt-create-btn"
            style={{
              background: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 32px",
              fontSize: 18,
              cursor: "pointer",
            }}
            onClick={() => setModalOpen(true)}
          >
            Create Category
          </button>
        </div>

        {}
        <div style={{ marginBottom: 16, maxWidth: 300 }}>
          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />
        </div>

        {}
        <div className="mgmt-table-wrapper" style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: 32, textAlign: "center" }}>
              <span
                className="spinner"
                style={{
                  width: 32,
                  height: 32,
                  border: "4px solid #eee",
                  borderTop: "4px solid #007bff",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 1s linear infinite",
                }}
              />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "#888" }}>No categories found.</div>
          ) : (
            <>
              <table className="mgmt-table responsive-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Active</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {pagedCategories.map((c) => (
                    <tr key={c.id}>
                      <td>
                        {editId === c.id ? (
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            autoFocus
                          />
                        ) : (
                          c.name
                        )}
                      </td>

                      <td>{c.isActive ? "Yes" : "No"}</td>

                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        {editId === c.id ? (
                          <>
                            <button onClick={() => handleEditSave(c.id)} style={{ marginRight: 8 }}>
                              Save
                            </button>
                            <button onClick={handleEditCancel}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(c.id, c.name)} style={{ marginRight: 8 }}>
                              Edit
                            </button>
                            <button onClick={() => handleDelete(c.id)}>Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, gap: 8 }}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Previous
                </button>
                <span style={{ alignSelf: "center" }}>
                  Page {page} / {totalPages}
                </span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {}
        <style>{`
          @media (max-width: 800px) {
            .responsive-table th, .responsive-table td {
              padding: 8px 4px;
              font-size: 13px;
            }
            .mgmt-header { flex-direction: column; align-items: flex-start; }
            .mgmt-header-title h2 { font-size: 20px; }
            .mgmt-create-btn { margin-top: 8px; }
          }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>

        <ToastContainer position="top-right" autoClose={2000} />
      </div>

      {}
      {modalOpen && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.18)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 24,
              minWidth: 320,
              maxWidth: 400,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#f3f4f6",
                border: "none",
                fontSize: 26,
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <CategoryForm
              onSuccess={() => {
                setModalOpen(false);
                loadCategories();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryList;
