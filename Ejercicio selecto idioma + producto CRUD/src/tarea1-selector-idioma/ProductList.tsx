import React, { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../shared/LanguageContext';
import { useAuth } from '../shared/AuthContext';
import { Product, ProductService } from '../shared/ProductService';
import './ProductList.css';

const ProductList: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    photo: ''
  });

  // Estados para la cámara
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);

  // Cargar productos del usuario al montar el componente
  React.useEffect(() => {
    const loadProducts = async () => {
      if (user) {
        // Migrar datos existentes si es necesario
        await ProductService.migrateExistingData(user.id);
        // Cargar productos del servicio unificado
        const userProducts = await ProductService.getProducts(user.id);
        setProducts(userProducts);
      }
    };

    loadProducts();
  }, [user]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
      console.error('Error accessing camera:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setFormData(prev => ({ ...prev, photo: photoDataUrl }));
        setPhotoTaken(true);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const handleAddProduct = () => {
    setIsAddingProduct(true);
    setEditingProduct(null);
    setFormData({ name: '', price: 0, description: '', photo: '' });
    setPhotoTaken(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsAddingProduct(true);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      photo: product.photo
    });
    setPhotoTaken(!!product.photo);
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.description || !formData.photo || !user) {
      alert(t('fillAllFields') + ' (' + t('photoRequired') + ')');
      return;
    }

    try {
      if (editingProduct) {
        // Editar producto existente
        const updatedProduct = await ProductService.updateProduct({
          ...formData,
          id: editingProduct.id,
          userId: user.id
        });
        setProducts(prevProducts =>
          prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        );
      } else {
        // Agregar nuevo producto
        const newProduct = await ProductService.createProduct({
          ...formData,
          userId: user.id
        });
        setProducts(prevProducts => [...prevProducts, newProduct]);
      }

      setIsAddingProduct(false);
      setEditingProduct(null);
      setFormData({ name: '', price: 0, description: '', photo: '' });
      setPhotoTaken(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm(t('deleteProduct') + '?') && user) {
      try {
        await ProductService.deleteProduct(productId, user.id);
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleCancel = () => {
    setIsAddingProduct(false);
    setEditingProduct(null);
    setFormData({ name: '', price: 0, description: '', photo: '' });
    setPhotoTaken(false);
    stopCamera();
  };

  if (isAddingProduct || editingProduct) {
    return (
      <div className="product-form-container">
        <h2>{editingProduct ? t('editProduct') : t('addProduct')}</h2>
        
        <div className="product-form">
          <div className="form-row">
            <input
              type="text"
              placeholder={t('name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="number"
              placeholder={t('price')}
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            />
          </div>
          
          <textarea
            placeholder={t('description')}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="photo-section">
            <h3>{t('photo')} *</h3>
            {!photoTaken ? (
              <div className="camera-container">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className={`camera-video ${isStreaming ? 'active' : ''}`}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                
                <div className="camera-controls">
                  {!isStreaming ? (
                    <button onClick={startCamera} className="camera-btn start-btn">
                      📹 {t('takePhoto')}
                    </button>
                  ) : (
                    <>
                      <button onClick={capturePhoto} className="camera-btn capture-btn">
                        📸 {t('takePhoto')}
                      </button>
                      <button onClick={stopCamera} className="camera-btn stop-btn">
                        ❌ {t('cancel')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="photo-preview">
                <img src={formData.photo} alt="Product" />
                <button
                  onClick={() => {
                    setPhotoTaken(false);
                    setFormData({ ...formData, photo: '' });
                  }}
                  className="retake-btn"
                >
                  🔄 {t('retakePhoto')}
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button onClick={handleSaveProduct} className="save-btn">
              {t('save')}
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h2>{t('productList')}</h2>
        <button onClick={handleAddProduct} className="add-product-btn">
          ➕ {t('addProduct')}
        </button>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <p>{t('noProducts')}</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-photo">
                <img src={product.photo} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <p className="product-description">{product.description}</p>
              </div>
              <div className="product-actions">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="edit-btn"
                >
                  ✏️ {t('edit')}
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="delete-btn"
                >
                  🗑️ {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;