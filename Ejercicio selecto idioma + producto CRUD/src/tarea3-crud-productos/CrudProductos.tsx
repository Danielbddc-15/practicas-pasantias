import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../shared/LanguageContext';
import { useAuth } from '../shared/AuthContext';
import { Product, ProductService } from '../shared/ProductService';
import './CrudProductos.css';

const CrudProductos: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    photo: ''
  });

  const loadProducts = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await ProductService.migrateExistingData(user.id);
      const userProducts = await ProductService.getProducts(user.id);
      setProducts(userProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCreateProduct = async () => {
    if (!user || !formData.name || !formData.description) {
      alert(t('fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      const newProduct = await ProductService.createProduct({
        ...formData,
        userId: user.id
      });
      setProducts(prev => [...prev, newProduct]);
      resetForm();
      alert(t('productAdded'));
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!user || !editingProduct || !formData.name || !formData.description) {
      alert(t('fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      const updatedProduct = await ProductService.updateProduct({
        ...editingProduct,
        ...formData
      });
      setProducts(prev => prev.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      ));
      resetForm();
      alert(t('productUpdated'));
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!user || !window.confirm(t('deleteProduct') + '?')) return;

    setLoading(true);
    try {
      await ProductService.deleteProduct(productId, user.id);
      setProducts(prev => prev.filter(p => p.id !== productId));
      alert(t('productDeleted'));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      photo: product.photo
    });
    setIsFormVisible(true);
  };

  const resetForm = () => {
    setFormData({ name: '', price: 0, description: '', photo: '' });
    setEditingProduct(null);
    setIsFormVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      await handleUpdateProduct();
    } else {
      await handleCreateProduct();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({ ...prev, photo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="crud-container">
        <p>{t('mustBeLoggedIn')}</p>
      </div>
    );
  }

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h2>{t('productManagement')}</h2>
        <button 
          className="add-btn"
          onClick={() => setIsFormVisible(true)}
          disabled={loading}
        >
           {t('addProduct')}
        </button>
      </div>

      {isFormVisible && (
        <div className="form-overlay">
          <div className="product-form">
            <h3>{editingProduct ? t('editProduct') : t('addProduct')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('productName')}:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>{t('productPrice')}:</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>{t('productDescription')}:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>{t('productPhoto')}:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
                {formData.photo && (
                  <img 
                    src={formData.photo} 
                    alt="Preview" 
                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }}
                  />
                )}
              </div>

              <div className="form-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? t('saving') : (editingProduct ? t('updateProduct') : t('addProduct'))}
                </button>
                <button type="button" onClick={resetForm} disabled={loading}>
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-grid">
        {loading && products.length === 0 ? (
          <div className="loading">{t('loading')}...</div>
        ) : products.length === 0 ? (
          <div className="no-products">
            <p>{t('noProducts')}</p>
            <p>{t('addFirstProduct')}</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="product-card">
              {product.photo && (
                <img 
                  src={product.photo} 
                  alt={product.name}
                  className="product-image"
                />
              )}
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-description">{product.description}</p>
                <div className="product-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditProduct(product)}
                    disabled={loading}
                  >
                     {t('edit')}
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={loading}
                  >
                     {t('delete')}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CrudProductos;
