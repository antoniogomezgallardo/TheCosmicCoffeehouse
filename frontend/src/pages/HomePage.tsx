import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ProductList from '../components/Products/ProductList';
import { productsAPI } from '../services/api';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getFeatured();
      if (response.success) {
        setFeaturedProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to load featured products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-cyber text-5xl md:text-7xl mb-6 animate-glow">
              Welcome to The Cosmic Coffeehouse
            </h1>
            <p className="text-cosmic-cyan text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Unlock your potential with our quantum-enhanced superpower coffee capsules
              and futuristic brewing machines from across the galaxy.
            </p>
            <div className="space-x-4">
              <Link to="/capsules" className="btn-plasma px-8 py-4 text-lg">
                Explore Capsules
              </Link>
              <Link to="/machines" className="btn-neon px-8 py-4 text-lg">
                Browse Machines
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="text-center">
                <div className="text-cosmic-cyan text-4xl mb-4 animate-pulse">⚡</div>
                <p className="text-cosmic-cyan">Loading featured products...</p>
              </div>
            ) : featuredProducts ? (
              <div className="space-y-16">
                {/* Featured Capsules */}
                {featuredProducts.capsules && featuredProducts.capsules.length > 0 && (
                  <ProductList
                    products={featuredProducts.capsules}
                    type="capsule"
                    title="✨ Featured Superpower Capsules"
                  />
                )}

                {/* Featured Machines */}
                {featuredProducts.machines && featuredProducts.machines.length > 0 && (
                  <ProductList
                    products={featuredProducts.machines}
                    type="machine"
                    title="🚀 Featured Brewing Machines"
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-cosmic-cyan text-4xl mb-4">🌌</div>
                <p className="text-cosmic-cyan">No featured products available</p>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4 bg-cosmic-space bg-opacity-30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-cyber text-3xl mb-6">Why Choose Cosmic Coffee?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="text-cosmic-mental text-4xl">🧠</div>
                <h3 className="text-cosmic-cyan text-xl font-bold">Mental Enhancement</h3>
                <p className="text-cosmic-cyan opacity-75">
                  Boost your cognitive abilities with our scientifically-formulated mental power capsules.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-cosmic-physical text-4xl">💪</div>
                <h3 className="text-cosmic-cyan text-xl font-bold">Physical Augmentation</h3>
                <p className="text-cosmic-cyan opacity-75">
                  Unlock superhuman strength, speed, and agility with our physical enhancement blends.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-cosmic-mystical text-4xl">🔮</div>
                <h3 className="text-cosmic-cyan text-xl font-bold">Mystical Powers</h3>
                <p className="text-cosmic-cyan opacity-75">
                  Experience otherworldly abilities like invisibility and dimensional shifting.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;