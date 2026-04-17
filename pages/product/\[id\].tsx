import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Product.module.css';
import { getCartFromLocalStorage, saveCartToLocalStorage, addToCart } from '../../lib/cart';

interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
  description: string;
  specifications: {
    weight: string;
    servingSize: string;
    ingredients: string;
    benefits: string[];
  };
}

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products?id=${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    let cart = getCartFromLocalStorage();
    cart = addToCart(cart, {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      emoji: product.emoji
    });
    saveCartToLocalStorage(cart);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return <div className={styles.loading}>Loading product...</div>;
  }

  if (!product) {
    return <div className={styles.error}>Product not found</div>;
  }

  return (
    <>
      <Head>
        <title>{product.name} - PetFood Store</title>
        <meta name="description" content={product.description} />
      </Head>

      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Back to Products</Link>
      </header>

      <main className={styles.main}>
        <div className={styles.productContainer}>
          <div className={styles.imageSection}>
            <div className={styles.productImage}>{product.emoji}</div>
            <p className={styles.category}>{product.category}</p>
          </div>

          <div className={styles.detailsSection}>
            <h1>{product.name}</h1>
            <p className={styles.price}>₪{product.price.toFixed(2)}</p>
            
            <div className={styles.description}>
              <h2>Description</h2>
              <p>{product.description}</p>
            </div>

            <div className={styles.specifications}>
              <h2>Product Specifications</h2>
              <div className={styles.specs}>
                <div>
                  <strong>Weight/Count:</strong>
                  <span>{product.specifications.weight}</span>
                </div>
                <div>
                  <strong>Serving Size:</strong>
                  <span>{product.specifications.servingSize}</span>
                </div>
                <div>
                  <strong>Key Ingredients:</strong>
                  <span>{product.specifications.ingredients}</span>
                </div>
              </div>
            </div>

            <div className={styles.benefits}>
              <h2>Key Benefits</h2>
              <ul>
                {product.specifications.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div className={styles.addToCart}>
              <div className={styles.quantitySelector}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button 
                className={`${styles.addButton} ${added ? styles.added : ''}`}
                onClick={handleAddToCart}
              >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
