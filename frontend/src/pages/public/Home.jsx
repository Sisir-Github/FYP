import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineGlobe,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlineStar,
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/CurrencyContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Home = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const [featuredTreks, setFeaturedTreks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/treks?isFeatured=true&limit=3');
        setFeaturedTreks(data.data.data);
      } catch (error) {
        console.error('Failed to fetch featured treks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/70 via-primary-900/50 to-primary-900/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-custom text-center text-white">
          <p className="text-accent-400 font-medium tracking-widest uppercase text-sm mb-4 animate-fade-in">
            {t("Nepal's Trusted Trekking Partner")}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6 animate-fade-in-up">
            {t('Discover the')} <br />
            <span className="text-accent-400">{t('Himalayas')}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in-up">
            {t('Expert-led treks and expeditions through the world\'s most breathtaking mountain landscapes.')} {t('Your adventure of a lifetime starts here.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <Link to="/treks" className="btn-primary btn-lg">
              {t('Explore Treks')}
            </Link>
            <Link to="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-900 btn-lg">
              {t('Contact Us')}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-4 -mt-1">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-2xl shadow-xl p-8 -mt-20 relative z-20">
            {[
              { value: '500+', label: t('Happy Trekkers') },
              { value: '50+', label: t('Trek Packages') },
              { value: '15+', label: t('Years Experience') },
              { value: '100%', label: t('Safety Record') },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-heading font-bold text-accent-500">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="text-accent-500 font-semibold text-sm uppercase tracking-wider mb-2">
              {t('Why Choose Us')}
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-500">
              {t('Your Journey, Our Expertise')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: HiOutlineGlobe,
                title: t('Expert Local Guides'),
                desc: t('Our experienced Sherpa guides know every trail, peak, and village in the Himalayas.'),
              },
              {
                icon: HiOutlineShieldCheck,
                title: t('Safety First'),
                desc: t('Comprehensive safety protocols, first-aid trained staff, and emergency evacuation plans.'),
              },
              {
                icon: HiOutlineUserGroup,
                title: t('Small Groups'),
                desc: t('Intimate group sizes for a personalized experience and minimal environmental impact.'),
              },
              {
                icon: HiOutlineStar,
                title: t('Premium Service'),
                desc: t('Quality equipment, comfortable lodging, and nutritious meals throughout your trek.'),
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="card p-8 text-center group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-accent-50 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-accent-500 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-accent-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-primary-500 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Treks Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="text-accent-500 font-semibold text-sm uppercase tracking-wider mb-2">
              {t('Top Destinations')}
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-500">
              {t('Featured Trek Packages')}
            </h2>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : featuredTreks.length === 0 ? (
            <div className="text-center py-10 text-gray-500 italic">No featured treks at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTreks.map((trek) => (
                <Link
                  key={trek._id}
                  to={`/treks/${trek.slug}`}
                  className="card overflow-hidden group cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={trek.images?.[0]?.url || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80'}
                      alt={trek.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-card-gradient" />
                    <div className="absolute bottom-4 left-4">
                      <span className="badge bg-accent-500 text-white">{trek.difficulty}</span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-primary-500 font-bold text-sm px-3 py-1 rounded-full">
                        {formatPrice(trek.price)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-heading font-semibold text-primary-500 group-hover:text-accent-500 transition-colors">
                      {trek.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">📅 {trek.duration} {t('Days')}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/treks" className="btn-primary btn-lg">
              {t('View All Packages')}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-primary-900/80" />
        </div>
        <div className="relative z-10 container-custom text-center text-white">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {t('Ready For Your Next Adventure?')}
          </h2>
          <p className="text-lg text-white/70 max-w-xl mx-auto mb-8">
            {t('Join hundreds of trekkers who have trusted us with their Himalayan dreams.')}
            {t('Book your trek today and start your journey to the top of the world.')}
          </p>
          <Link to="/treks" className="btn-primary btn-lg">
            {t('Start Planning')}
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
