import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import ProductList from '../components/Products/ProductList';
import { productsAPI } from '../services/api';

const CapsulesPage: React.FC = () => {
  const [capsules, setCapsules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  useEffect(() => {
    loadCapsules();
  }, []);

  const loadCapsules = async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getCapsules();
      if (response.success) {
        setCapsules(response.data);
      }
    } catch (error) {
      console.error('Failed to load capsules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAndSortedCapsules = capsules
    .filter(capsule => filterType === 'all' || capsule.powerType === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'intensity':
          return b.intensity - a.intensity;
        case 'rarity':
          const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };
          return (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0) - (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-cyber text-5xl md:text-6xl mb-6 animate-glow">
              ⚡ Superpower Capsules
            </h1>
            <p className="text-cosmic-cyan text-lg md:text-xl max-w-3xl mx-auto">
              Discover our complete collection of quantum-enhanced coffee capsules.
              Each blend is scientifically formulated to unlock extraordinary abilities.
            </p>
          </div>

          {/* Filters and Sorting */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <label className="text-cosmic-cyan text-sm font-bold">Filter by Power Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-cosmic-space border border-cosmic-cyan rounded px-3 py-2 text-cosmic-cyan focus:outline-none focus:border-cosmic-energy"
              >
                <option value="all">All Types</option>
                <option value="mental">🧠 Mental</option>
                <option value="physical">💪 Physical</option>
                <option value="mystical">🔮 Mystical</option>
              </select>
            </div>

            <div className="flex gap-4 items-center">
              <label className="text-cosmic-cyan text-sm font-bold">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-cosmic-space border border-cosmic-cyan rounded px-3 py-2 text-cosmic-cyan focus:outline-none focus:border-cosmic-energy"
              >
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="intensity">Intensity</option>
                <option value="rarity">Rarity</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-cosmic-cyan text-sm">
              Showing {filteredAndSortedCapsules.length} of {capsules.length} capsules
            </p>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="text-center py-16">
              <div className="text-cosmic-cyan text-4xl mb-4 animate-pulse">⚡</div>
              <p className="text-cosmic-cyan">Loading superpower capsules...</p>
            </div>
          ) : filteredAndSortedCapsules.length > 0 ? (
            <ProductList
              products={filteredAndSortedCapsules}
              type="capsule"
              title=""
            />
          ) : (
            <div className="text-center py-16">
              <div className="text-cosmic-cyan text-4xl mb-4">🔍</div>
              <p className="text-cosmic-cyan">No capsules found matching your criteria</p>
              <button
                onClick={() => setFilterType('all')}
                className="mt-4 btn-neon px-6 py-2"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Power Type Info */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 bg-cosmic-space bg-opacity-30 p-8 rounded-cyber">
            <div className="text-center">
              <div className="text-cosmic-mental text-4xl mb-4">🧠</div>
              <h3 className="text-cosmic-cyan text-xl font-bold mb-2">Mental Powers</h3>
              <p className="text-cosmic-cyan opacity-75 text-sm">
                Enhance cognitive abilities, unlock telepathy, boost memory, and expand consciousness.
              </p>
            </div>
            <div className="text-center">
              <div className="text-cosmic-physical text-4xl mb-4">💪</div>
              <h3 className="text-cosmic-cyan text-xl font-bold mb-2">Physical Powers</h3>
              <p className="text-cosmic-cyan opacity-75 text-sm">
                Gain superhuman strength, speed, agility, and physical enhancement capabilities.
              </p>
            </div>
            <div className="text-center">
              <div className="text-cosmic-mystical text-4xl mb-4">🔮</div>
              <h3 className="text-cosmic-cyan text-xl font-bold mb-2">Mystical Powers</h3>
              <p className="text-cosmic-cyan opacity-75 text-sm">
                Access otherworldly abilities like invisibility, elemental control, and dimensional travel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CapsulesPage;