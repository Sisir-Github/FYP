import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiPlus, HiPencilAlt, HiTrash } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/CurrencyContext';

const AdminTreks = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreks();
  }, []);

  const fetchTreks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/treks');
      setTreks(data.data.data);
    } catch (error) {
      toast.error('Failed to load treks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you certain you want to delete this trek? This action cannot be undone.')) {
      try {
        await api.delete(`/treks/${id}`);
        toast.success('Trek deleted successfully');
        fetchTreks(); // Refresh list
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete trek');
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-800">{t('Manage Treks')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('Add, update or remove trek packages')}</p>
        </div>
        <Link to="/admin/treks/add" className="btn-primary flex items-center gap-2">
          <HiPlus /> {t('Add New Trek')}
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : treks.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No treks created yet. Click "Add New Trek" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4 font-medium rounded-tl-xl">{t('Package Info')}</th>
                  <th className="px-6 py-4 font-medium">{t('Pricing')}</th>
                  <th className="px-6 py-4 font-medium">{t('Duration')}</th>
                  <th className="px-6 py-4 font-medium">{t('Difficulty')}</th>
                  <th className="px-6 py-4 font-medium text-right rounded-tr-xl">{t('Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {treks.map((trek) => (
                  <tr key={trek._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          {trek.images && trek.images[0] ? (
                            <img src={trek.images[0].url} alt={trek.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-heading font-bold text-gray-800 line-clamp-1">{trek.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{trek.startPoint} ➔ {trek.endPoint}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-800">{formatPrice(trek.price)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{trek.duration} Days</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                        {trek.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          to={`/treks/${trek.slug}`} 
                          target="_blank"
                          className="text-gray-400 hover:text-primary-500 transition-colors"
                          title="View Public Page"
                        >
                          👁️
                        </Link>
                        <Link 
                          to={`/admin/treks/edit/${trek._id}`}
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                        >
                          <HiPencilAlt className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(trek._id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTreks;
