export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  photo: string; // Base64 de la imagen
  userId: string;
}

// Servicio unificado de productos
export class ProductService {
  private static baseKey = 'unified_products_';

  static async getProducts(userId: string): Promise<Product[]> {
    // Simular delay de red para mantener la experiencia de API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const products = localStorage.getItem(`${this.baseKey}${userId}`);
    return products ? JSON.parse(products) : [];
  }

  static async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newProduct: Product = {
      ...product,
      id: Date.now() + Math.random() // Asegurar ID único
    };

    const existingProducts = await this.getProducts(product.userId);
    const updatedProducts = [...existingProducts, newProduct];
    localStorage.setItem(`${this.baseKey}${product.userId}`, JSON.stringify(updatedProducts));
    
    return newProduct;
  }

  static async updateProduct(product: Product): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const existingProducts = await this.getProducts(product.userId);
    const updatedProducts = existingProducts.map(p => 
      p.id === product.id ? product : p
    );
    localStorage.setItem(`${this.baseKey}${product.userId}`, JSON.stringify(updatedProducts));
    
    return product;
  }

  static async deleteProduct(productId: number, userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const existingProducts = await this.getProducts(userId);
    const updatedProducts = existingProducts.filter(p => p.id !== productId);
    localStorage.setItem(`${this.baseKey}${userId}`, JSON.stringify(updatedProducts));
  }

  // Migrar datos existentes de los sistemas antiguos
  static async migrateExistingData(userId: string): Promise<void> {
    const newKey = `${this.baseKey}${userId}`;
    
    // Si ya existen datos en el nuevo formato, no hacer nada
    if (localStorage.getItem(newKey)) {
      return;
    }

    // Migrar desde el sistema de la Tarea 1
    const task1Products = localStorage.getItem(`products_${userId}`);
    let migratedProducts: Product[] = [];

    if (task1Products) {
      migratedProducts = JSON.parse(task1Products);
    }

    // Migrar desde el sistema de la Tarea 3
    const task3Products = localStorage.getItem(`crud_products_${userId}`);
    if (task3Products) {
      const task3Data = JSON.parse(task3Products);
      // Evitar duplicados basándose en nombre y precio
      const existingKeys = new Set(migratedProducts.map(p => `${p.name}-${p.price}`));
      
      task3Data.forEach((product: Product) => {
        const key = `${product.name}-${product.price}`;
        if (!existingKeys.has(key)) {
          migratedProducts.push(product);
        }
      });
    }

    // Guardar en el nuevo formato
    if (migratedProducts.length > 0) {
      localStorage.setItem(newKey, JSON.stringify(migratedProducts));
    }

    // Limpiar datos antiguos (opcional, comentado por seguridad)
    // localStorage.removeItem(`products_${userId}`);
    // localStorage.removeItem(`crud_products_${userId}`);
  }
}