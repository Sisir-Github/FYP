import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HiOutlineFilter, HiSearch, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TrekListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    difficulty: searchParams.get('difficulty') || '',
    minDuration: '',
    maxDuration: '',
  });
  
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTreks();
    // eslint-disable-next-line
  }, [searchParams]);

  const fetchTreks = async () => {
    setLoading(true);
    try {
      let queryStr = `?${searchParams.toString()}`;
      const { data } = await api.get(`/treks${queryStr}`);
      setTreks(data.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch treks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    
    if (filters.keyword) newParams.append('keyword', filters.keyword);
    if (filters.difficulty) newParams.append('difficulty', filters.difficulty);
    if (filters.minDuration) newParams.append('duration[gte]', filters.minDuration);
    if (filters.maxDuration) newParams.append('duration[lte]', filters.maxDuration);
    
    setSearchParams(newParams);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({ keyword: '', difficulty: '', minDuration: '', maxDuration: '' });
    setSearchParams(new URLSearchParams());
  };

  return (
    <>
      <div className="bg-primary-900 pt-32 pb-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Explore Trek Packages
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            From the bustling trails of Everest to the remote wilderness of Manaslu, find your next adventure.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-end">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center gap-2"
            >
              <HiOutlineFilter /> Filters
            </button>
          </div>

          {/* Sidebar / Filters */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="card p-6 sticky top-24">
              <h3 className="font-heading font-bold text-lg text-primary-500 mb-6 flex items-center gap-2">
                <HiOutlineFilter className="text-accent-500" /> Filter Treks
              </h3>

              <form onSubmit={applyFilters} className="space-y-5">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="keyword"
                      value={filters.keyword}
                      onChange={handleFilterChange}
                      className="input pl-10"
                      placeholder="Search title/desc..."
                    />
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    name="difficulty"
                    value={filters.difficulty}
                    onChange={handleFilterChange}
                    className="input"
                  >
                    <option value="">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Strenuous">Strenuous</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="minDuration"
                      value={filters.minDuration}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="input px-3"
                      min="1"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      name="maxDuration"
                      value={filters.maxDuration}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="input px-3"
                      min="1"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="submit" className="btn-primary flex-1">Apply</button>
                  <button type="button" onClick={resetFilters} className="btn bg-gray-100 text-gray-600 hover:bg-gray-200">Reset</button>
                </div>
              </form>
            </div>
          </div>

          {/* Trek Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center">
                {error}
              </div>
            ) : treks.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <span className="text-4xl block mb-4">🏔️</span>
                <h3 className="text-xl font-heading font-bold text-gray-700">No treks found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
                <button onClick={resetFilters} className="btn-primary mt-6">Clear All Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {treks.map((trek) => (
                  <div key={trek._id} className="card overflow-hidden group flex flex-col">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={trek.images?.[0]?.url || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80'}
                        alt={trek.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/90 backdrop-blur-sm text-primary-500 font-bold px-3 py-1 rounded-full text-sm">
                          ${trek.price}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        <span className={`badge ${
                          trek.difficulty === 'Strenuous' ? 'bg-red-500 text-white' :
                          trek.difficulty === 'Challenging' ? 'bg-orange-500 text-white' :
                          trek.difficulty === 'Moderate' ? 'bg-blue-500 text-white' :
                          'bg-green-500 text-white'
                        }`}>
                          {trek.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-heading font-bold text-primary-500 mb-2 line-clamp-1 group-hover:text-accent-500 transition-colors">
                        {trek.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <HiOutlineClock className="text-accent-500 w-4 h-4" />
                          <span>{trek.duration} Days</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HiOutlineLocationMarker className="text-accent-500 w-4 h-4" />
                          <span>Max {trek.maxAltitude}m</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-1">
                        {trek.description}
                      </p>

                      <Link to={`/treks/${trek.slug}`} className="btn-outline w-full text-center group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500 mt-auto">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TrekListing;
