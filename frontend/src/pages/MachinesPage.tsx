import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import ProductList from '../components/Products/ProductList';
import { productsAPI } from '../services/api';

const MachinesPage: React.FC = () => {
  const [machines, setMachines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getMachines();
      if (response.success) {
        setMachines(response.data);
      }
    } catch (error) {
      console.error('Failed to load machines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAndSortedMachines = machines
    .filter(machine => filterType === 'all' || machine.type === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'efficiency':
          return b.efficiencyRating - a.efficiencyRating;
        case 'power':
          return b.specifications.maxPowerOutput - a.specifications.maxPowerOutput;
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
              🚀 Brewing Machines
            </h1>
            <p className="text-cosmic-cyan text-lg md:text-xl max-w-3xl mx-auto">
              Explore our advanced quantum brewing technologies. Each machine is engineered
              to perfectly extract and amplify the supernatural properties of our superpower capsules.
            </p>
          </div>

          {/* Filters and Sorting */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <label className="text-cosmic-cyan text-sm font-bold">Filter by Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-cosmic-space border border-cosmic-cyan rounded px-3 py-2 text-cosmic-cyan focus:outline-none focus:border-cosmic-energy"
              >
                <option value="all">All Types</option>
                <option value="quantum">⚛️ Quantum</option>
                <option value="cosmic">🌌 Cosmic</option>
                <option value="neural">🧠 Neural</option>
                <option value="temporal">⏰ Temporal</option>
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
                <option value="efficiency">Efficiency Rating</option>
                <option value="power">Max Power Output</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-cosmic-cyan text-sm">
              Showing {filteredAndSortedMachines.length} of {machines.length} machines
            </p>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="text-center py-16">
              <div className="text-cosmic-cyan text-4xl mb-4 animate-pulse">🚀</div>
              <p className="text-cosmic-cyan">Loading brewing machines...</p>
            </div>
          ) : filteredAndSortedMachines.length > 0 ? (
            <ProductList
              products={filteredAndSortedMachines}
              type="machine"
              title=""
            />
          ) : (
            <div className="text-center py-16">
              <div className="text-cosmic-cyan text-4xl mb-4">🔍</div>
              <p className="text-cosmic-cyan">No machines found matching your criteria</p>
              <button
                onClick={() => setFilterType('all')}
                className="mt-4 btn-neon px-6 py-2"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Machine Types Info */}
          <div className="mt-16 grid md:grid-cols-2 gap-8 bg-cosmic-space bg-opacity-30 p-8 rounded-cyber">
            <div className="text-center">
              <div className="text-cosmic-energy text-4xl mb-4">⚛️</div>
              <h3 className="text-cosmic-cyan text-xl font-bold mb-2">Quantum Machines</h3>
              <p className="text-cosmic-cyan opacity-75 text-sm">
                Advanced quantum field manipulation for maximum power extraction and stability.
                Perfect for mental enhancement capsules.
              </p>
            </div>
            <div className="text-center">
              <div className="text-cosmic-mystical text-4xl mb-4">🌌</div>
              <h3 className="text-cosmic-cyan text-xl font-bold mb-2">Cosmic Brewers</h3>
              <p className="text-cosmic-cyan opacity-75 text-sm">
                Versatile multi-spectrum brewing technology. Compatible with all capsule types
                for universal power activation.
              </p>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="mt-12 bg-cosmic-space bg-opacity-20 p-6 rounded-cyber">
            <h3 className="text-cosmic-cyan text-xl font-bold mb-4 text-center">
              🔧 Why Our Machines Matter
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="text-cosmic-energy font-bold mb-2">Precision Brewing</h4>
                <p className="text-cosmic-cyan opacity-75">
                  Each machine calibrates temperature, pressure, and quantum fields to the exact
                  specifications required for optimal superpower activation.
                </p>
              </div>
              <div>
                <h4 className="text-cosmic-energy font-bold mb-2">Safety Systems</h4>
                <p className="text-cosmic-cyan opacity-75">
                  Advanced containment fields and stability monitoring ensure safe power extraction
                  without dimensional rifts or temporal anomalies.
                </p>
              </div>
              <div>
                <h4 className="text-cosmic-energy font-bold mb-2">Efficiency Ratings</h4>
                <p className="text-cosmic-cyan opacity-75">
                  Our efficiency ratings indicate power conversion rates, with higher ratings
                  providing stronger effects and longer-lasting abilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MachinesPage;