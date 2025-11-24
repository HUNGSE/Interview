import React, { useEffect, useState } from "react";
import { getProduct } from "./ProductService";
import { Product } from "../../types/product";

interface ProductDetailProps {
  productId: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(productId).then((res) => {
      setProduct(res);
      setLoading(false);
    });
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>

      <div style={{ marginBottom: 10 }}>
        <strong>Name:</strong> {product.name}
      </div>

      <div style={{ marginBottom: 10 }}>
        <strong>Description:</strong> {product.description}
      </div>

      <div style={{ marginBottom: 10 }}>
        <strong>SKU:</strong> {product.sku}
      </div>

      <div style={{ marginBottom: 10 }}>
        <strong>Base Price:</strong> ${product.basePrice}
      </div>

      <div style={{ marginBottom: 10 }}>
        <strong>Active:</strong> {product.isActive ? "Yes" : "No"}
      </div>

      <div style={{ marginBottom: 10 }}>
        <strong>Created At:</strong>{" "}
        {new Date(product.createdAt).toLocaleString()}
      </div>

      <div style={{ marginBottom: 10 }}>
        <strong>Updated At:</strong>{" "}
        {new Date(product.updatedAt).toLocaleString()}
      </div>

      {}
      <div style={{ marginTop: 20 }}>
        <strong>Variants:</strong>
        <ul>
          {product.variants && product.variants.length > 0 ? (
            product.variants.map((v) => (
              <li key={v.id}>
                <div>Color: {v.color || "N/A"}</div>
                <div>Size: {v.size || "N/A"}</div>
                <div>Additional Price: {v.additionalPrice}</div>
                <div>Stock Quantity: {v.stockQuantity}</div>
              </li>
            ))
          ) : (
            <li>No variants</li>
          )}
        </ul>
      </div>

      {}
      <div style={{ marginTop: 20 }}>
        <strong>Images:</strong>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 10,
            flexWrap: "wrap"
          }}
        >
          {product.imageUrls && product.imageUrls.length > 0 ? (
            product.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="product"
                width={120}
                height={120}
                style={{
                  objectFit: "cover",
                  borderRadius: 6,
                  border: index === 0 ? "3px solid green" : "1px solid #ccc"
                }}
              />
            ))
          ) : (
            <span>No images</span>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProductDetail;
