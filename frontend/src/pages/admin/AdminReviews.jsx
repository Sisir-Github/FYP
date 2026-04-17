import { useState, useEffect } from 'react';
import { HiOutlineStar, HiOutlineTrash, HiOutlineChatAlt } from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

const AdminReviews = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/reviews');
      setReviews(data.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm(t('Are you sure you want to delete this review?'))) {
      try {
        await api.delete(`/reviews/${id}`);
        toast.success(t('Review deleted successfully'));
        fetchReviews();
      } catch (error) {
        toast.error(t('Failed to delete review'));
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{t('Manage Reviews')}</h1>
        <p className="text-sm text-gray-500">{t('Monitor and moderate customer feedback for all treks.')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reviews.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 text-gray-500">
            {t('No reviews found.')}
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center font-bold text-lg shrink-0">
                    {review.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <h3 className="font-bold text-gray-800">{review.user?.name}</h3>
                       <span className="text-xs text-gray-400">• {new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-accent-500 font-medium mt-0.5">
                      {t('on')} {review.trek?.title}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <HiOutlineStar 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'text-accent-500 fill-accent-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(review._id)}
                  className="p-2 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title={t('Delete Review')}
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 bg-gray-50 p-4 rounded-xl relative">
                <HiOutlineChatAlt className="absolute -top-3 left-6 w-6 h-6 text-gray-100" />
                <h4 className="text-sm font-bold text-gray-800 mb-1">{review.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{review.text}"</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
