import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiOutlineClock, HiOutlineLocationMarker, HiOutlineStar, HiCheck, HiX, HiLightningBolt } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/CurrencyContext';

const TrekDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
  const { formatPrice, currency, getConvertedValue, conversionRateUsed } = useCurrency();
  
  const [trek, setTrek] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Booking State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    participants: 1,
    paymentMethod: 'Khalti',
    specialRequirements: ''
  });

  // Review State
  const [reviewFormData, setReviewFormData] = useState({ rating: 5, title: '', text: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchTrekAndReviews = async () => {
      try {
        const { data: trekData } = await api.get(`/treks/slug/${slug}`);
        setTrek(trekData.data);
        
        // Fetch reviews
        const { data: reviewData } = await api.get(`/treks/${trekData.data._id}/reviews`);
        setReviews(reviewData.data);

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load trek details');
      } finally {
        setLoading(false);
      }
    };
    fetchTrekAndReviews();
  }, [slug]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to book a trek');
      navigate('/login');
      return;
    }

    if (!user?.isVerified) {
      toast.error('Please verify your email address to make a booking.');
      return;
    }

    if (!bookingData.startDate) {
      toast.error('Please select a start date');
      return;
    }

    setBookingLoading(true);
    try {
      const { data } = await api.post('/bookings', {
        trekId: trek._id,
        displayCurrency: currency,
        displayAmount: getConvertedValue(trek.price * bookingData.participants),
        conversionRateUsed,
        ...bookingData
      });

      if (bookingData.paymentMethod === 'Khalti' && data.data.payment?.payment_url) {
        window.location.href = data.data.payment.payment_url;
      } else {
        toast.success(data.message);
        navigate('/my-bookings');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to submit a review');

    setSubmittingReview(true);
    try {
      const { data } = await api.post(`/treks/${trek._id}/reviews`, reviewFormData);
      toast.success('Review added successfully');
      setReviews([data.data, ...reviews]);
      setReviewFormData({ rating: 5, title: '', text: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  
  if (error) {
    return (
      <div className="pt-32 pb-20 container-custom">
        <div className="bg-red-50 text-red-600 p-8 rounded-xl border border-red-100 text-center max-w-2xl mx-auto">
          <span className="text-4xl block mb-4">⚠️</span>
          <h2 className="text-2xl font-bold mb-2">Trek Not Found</h2>
          <p>{error}</p>
          <Link to="/treks" className="btn-primary mt-6 inline-block">Back to Treks</Link>
        </div>
      </div>
    );
  }

  if (!trek) return null;

  return (
    <>
      <section className="relative h-[60vh] min-h-[500px] flex items-end pb-16">
        <div className="absolute inset-0">
          <img 
            src={trek.images?.[0]?.url || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa'} 
            alt={trek.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 container-custom text-white">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge bg-accent-500 text-white border-none">{trek.difficulty}</span>
            <span className="badge bg-white/20 backdrop-blur-md text-white border-white/20">
              <HiOutlineClock className="w-4 h-4 mr-1" /> {trek.duration} Days
            </span>
            <span className="badge bg-white/20 backdrop-blur-md text-white border-white/20">
              <HiOutlineLocationMarker className="w-4 h-4 mr-1" /> Max {trek.maxAltitude}m
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4">
            {trek.title}
          </h1>
          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-1 text-yellow-400">
              <HiOutlineStar className="w-5 h-5 fill-current" />
              <span className="text-white">{trek.averageRating ? `${trek.averageRating} / 5` : 'No reviews yet'}</span>
            </div>
            <div className="text-accent-400 text-xl font-bold">
              {formatPrice(trek.price)} <span className="text-sm text-gray-300 font-normal">/ {t('person')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8 sticky top-24 z-30">
                <div className="flex overflow-x-auto hide-scrollbar">
                  {['overview', 'itinerary', 'includes', 'gallery', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 px-6 text-sm font-heading font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                        activeTab === tab 
                          ? 'bg-primary-900 text-white' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-primary-500'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 mb-8 min-h-[400px]">
                
                {activeTab === 'overview' && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-heading font-bold text-primary-500 mb-6">{t('About This Trek')}</h2>
                    <div className="prose prose-lg text-gray-600 max-w-none mb-10 whitespace-pre-line">
                      {trek.description}
                    </div>

                    <h3 className="text-xl font-heading font-bold text-primary-500 mb-6 mt-10 border-t pt-10 border-gray-100">At a Glance</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center">
                        <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">Start Point</p>
                        <p className="font-heading font-semibold text-gray-800">{trek.startPoint}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center">
                        <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">End Point</p>
                        <p className="font-heading font-semibold text-gray-800">{trek.endPoint}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center">
                        <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">Best Seasons</p>
                        <p className="font-heading font-semibold text-gray-800">{trek.bestSeasons?.join(', ')}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center">
                        <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">Accommodations</p>
                        <p className="font-heading font-semibold text-gray-800">{trek.accommodations?.join(', ')}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center">
                        <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">Meals</p>
                        <p className="font-heading font-semibold text-gray-800">{trek.meals?.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-heading font-bold text-primary-500 mb-8">Daily Itinerary</h2>
                    
                    {(!trek.itinerary || trek.itinerary.length === 0) ? (
                      <p className="text-gray-500 italic">Detailed itinerary coming soon.</p>
                    ) : (
                      <div className="space-y-6">
                        {trek.itinerary.map((day) => (
                          <div key={day._id || day.day} className="flex gap-6">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full bg-accent-100 text-accent-500 flex items-center justify-center font-bold font-heading shrink-0 z-10 border-4 border-white shadow-sm">
                                {day.day}
                              </div>
                              <div className="w-0.5 bg-gray-200 h-full -mt-2"></div>
                            </div>
                            <div className="pb-8 pt-1 flex-1">
                              <h3 className="text-lg font-heading font-bold text-gray-800 mb-2">{day.title}</h3>
                              <p className="text-gray-600 mb-3 text-sm leading-relaxed">{day.description}</p>
                              <div className="flex flex-wrap gap-3 mt-4">
                                {day.accommodation && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                    🏨 {day.accommodation}
                                  </span>
                                )}
                                {day.meals && day.meals.length > 0 && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                    🍽️ {day.meals.join(', ')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'includes' && (
                  <div className="animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-10">
                      <div>
                        <h2 className="text-2xl font-heading font-bold text-primary-500 mb-6 flex items-center gap-2">
                          <HiCheck className="text-green-500" /> {t("What's Included")}
                        </h2>
                        <ul className="space-y-4">
                          {trek.included?.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <HiCheck className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                              <span className="text-gray-600 leading-relaxed text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h2 className="text-2xl font-heading font-bold text-primary-500 mb-6 flex items-center gap-2">
                          <HiX className="text-red-500" /> Not Included
                        </h2>
                        <ul className="space-y-4">
                          {trek.excluded?.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <HiX className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />
                              <span className="text-gray-600 leading-relaxed text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-heading font-bold text-primary-500 mb-6">Photo Gallery</h2>
                    {(!trek.images || trek.images.length === 0) ? (
                      <p className="text-gray-500 italic">No images available for this trek.</p>
                     ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {trek.images.map((img, i) => (
                          <div key={img.public_id || i} className="aspect-square rounded-xl overflow-hidden cursor-pointer group">
                            <img 
                              src={img.url} 
                              alt={`Gallery ${i+1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="animate-fade-in">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                      <div>
                        <h2 className="text-2xl font-heading font-bold text-primary-500">Traveler Reviews</h2>
                        <p className="text-sm text-gray-500 mt-1">
                          {trek.averageRating ? `Average Rating: ${trek.averageRating} / 5 (${reviews.length} reviews)` : 'No reviews yet'}
                        </p>
                      </div>
                    </div>

                    {/* Review Form */}
                    {isAuthenticated && (
                      <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                        <h4 className="font-heading font-bold text-gray-800 mb-4">Write a Review</h4>
                        <form onSubmit={submitReview}>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <label className="label text-xs">Rating</label>
                              <select className="input py-2" value={reviewFormData.rating} onChange={(e) => setReviewFormData({...reviewFormData, rating: e.target.value})}>
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Very Good</option>
                                <option value="3">3 - Average</option>
                                <option value="2">2 - Poor</option>
                                <option value="1">1 - Terrible</option>
                              </select>
                            </div>
                            <div className="md:col-span-3">
                              <label className="label text-xs">Title</label>
                              <input type="text" className="input py-2" placeholder="Sum up your experience" required value={reviewFormData.title} onChange={(e) => setReviewFormData({...reviewFormData, title: e.target.value})} />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="label text-xs">Review Details</label>
                            <textarea rows="3" className="input py-2 resize-none" placeholder="Share the details of your trek..." required value={reviewFormData.text} onChange={(e) => setReviewFormData({...reviewFormData, text: e.target.value})}></textarea>
                          </div>
                          <button type="submit" disabled={submittingReview} className="btn-primary text-sm px-6 py-2">
                            {submittingReview ? <LoadingSpinner size="sm"/> : 'Submit Review'}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
                         <span className="text-4xl block mb-3">⭐</span>
                         <h3 className="text-lg font-bold text-gray-800">Be the first to review</h3>
                         <p className="text-sm text-gray-500">Share your experience with other travelers.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map(review => (
                          <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                  {review.user?.avatar?.url ? (
                                    <img src={review.user.avatar.url} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">👤</div>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800 text-sm">{review.user?.name}</h4>
                                  <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <HiOutlineStar key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                                ))}
                              </div>
                            </div>
                            <h5 className="font-bold text-gray-800 mb-1">{review.title}</h5>
                            <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Right Column - Booking Widget */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24 z-20">
                <div className="text-center pb-6 border-b border-gray-100 mb-6">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('Starting From')}</p>
                  <p className="text-4xl font-heading font-bold text-primary-500">
                    {formatPrice(trek.price)} <span className="text-sm font-normal text-gray-400">/ {t('person')}</span>
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                   <div className="flex items-center gap-3 text-gray-600">
                      <HiLightningBolt className="w-5 h-5 text-accent-500" />
                      <span className="text-sm font-medium">Instant Confirmation available</span>
                   </div>
                   <div className="flex items-center gap-3 text-gray-600">
                      <HiOutlineClock className="w-5 h-5 text-accent-500" />
                      <span className="text-sm font-medium">{trek.duration} Days duration</span>
                   </div>
                </div>

                {showBookingModal ? (
                  <div className="animate-fade-in space-y-4 border-t pt-4">
                    <h4 className="font-heading font-bold text-gray-800 text-center mb-4">Complete Your Booking</h4>
                    <form onSubmit={handleBooking}>
                      <div className="mb-4">
                        <label className="label text-xs">Start Date</label>
                        <input type="date" required min={new Date().toISOString().split('T')[0]} className="input" value={bookingData.startDate} onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})} />
                      </div>
                      <div className="mb-4">
                        <label className="label text-xs">Participants</label>
                        <input type="number" required min="1" max="25" className="input" value={bookingData.participants} onChange={(e) => setBookingData({...bookingData, participants: parseInt(e.target.value)})} />
                      </div>
                      <div className="mb-4">
                        <label className="label text-xs">Payment Method</label>
                        <select className="input" value={bookingData.paymentMethod} onChange={(e) => setBookingData({...bookingData, paymentMethod: e.target.value})}>
                          <option value="Khalti">Khalti ePayment</option>
                          <option value="Bank Transfer">Bank Transfer (Manual)</option>
                          <option value="Cash">Cash on Arrival</option>
                        </select>
                      </div>
                      <div className="mb-6">
                        <label className="label text-xs">Special Req. (Optional)</label>
                        <textarea rows="2" className="input resize-none" value={bookingData.specialRequirements} onChange={(e) => setBookingData({...bookingData, specialRequirements: e.target.value})} placeholder="Dietary needs?"></textarea>
                      </div>
                      <div className="flex justify-between font-bold text-gray-800 mb-4 border-t pt-2">
                        <span>{t('Total')}:</span>
                        <span>{formatPrice(trek.price * bookingData.participants)}</span>
                      </div>
                      <button type="submit" disabled={bookingLoading} className="btn-primary w-full py-3 mb-2 flex justify-center items-center gap-2">
                        {bookingLoading ? <LoadingSpinner size="sm" /> : bookingData.paymentMethod === 'Khalti' ? 'Pay with Khalti' : 'Confirm Booking'}
                      </button>
                      <button type="button" onClick={() => setShowBookingModal(false)} className="w-full text-center text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                    </form>
                  </div>
                ) : (
                  <>
                    {isAuthenticated && !user?.isVerified ? (
                      <button 
                        onClick={() => navigate('/verify-email')}
                        className="w-full py-4 text-lg bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold transition-colors"
                      >
                        {t('Verify Email to Book')}
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          if (!isAuthenticated) {
                            toast.error(t('Please log in to book this trek'));
                            navigate('/login');
                            return;
                          }
                          setShowBookingModal(true);
                        }}
                        className="btn-primary w-full py-4 text-lg"
                      >
                        {t('Book This Trek')}
                      </button>
                    )}
                    <p className="text-center text-xs text-gray-400 mt-4">
                      No hidden fees. Book with confidence.
                    </p>
                  </>
                )}

                {/* Need Help */}
                <div className="mt-8 bg-gray-50 p-5 rounded-lg border border-gray-100 text-center">
                  <h4 className="font-heading font-bold text-gray-800 mb-2">Need Help?</h4>
                  <p className="text-sm text-gray-500 mb-4">Contact our travel experts for personalized advice.</p>
                  <Link to="/contact" className="text-accent-500 font-medium hover:underline text-sm">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default TrekDetails;
