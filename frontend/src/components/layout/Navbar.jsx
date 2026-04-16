import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiUser, HiLogout, HiViewGrid, HiChevronDown, HiGlobeAlt, HiCash } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/CurrencyContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { name: t('Home'), path: '/' },
    { name: t('Treks'), path: '/treks' },
    { name: t('About'), path: '/about' },
    { name: t('Contact'), path: '/contact' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'np', name: 'नेपाली' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'zh', name: '中文' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' }
  ];

  const currencies = ['NPR', 'USD', 'EUR', 'GBP', 'INR', 'AUD'];

  const hasDarkHero = 
    location.pathname === '/' || 
    location.pathname === '/treks' || 
    location.pathname.startsWith('/treks/') || 
    location.pathname === '/about' || 
    location.pathname === '/contact';

  const isSolid = scrolled || !hasDarkHero;

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-accent-500'
        : isSolid
        ? 'text-gray-700 hover:text-accent-500'
        : 'text-white/90 hover:text-white'
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">⛰️</span>
          <div>
            <h1
              className={`text-lg font-heading font-bold leading-tight ${
                isSolid ? 'text-primary-500' : 'text-white'
              }`}
            >
              Everest Encounter
            </h1>
            <p
              className={`text-[10px] tracking-widest uppercase ${
                isSolid ? 'text-gray-500' : 'text-white/70'
              }`}
            >
              Treks & Expedition
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={linkClass}>
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Controls (Language, Currency, Auth) */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Language Selector */}
          <div className="flex items-center gap-1">
            <HiGlobeAlt className={`w-4 h-4 ${isSolid ? 'text-gray-500' : 'text-white/70'}`} />
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className={`bg-transparent text-xs font-medium focus:outline-none cursor-pointer ${
                isSolid ? 'text-gray-700' : 'text-white'
              }`}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-gray-800">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center gap-1">
            <HiCash className={`w-4 h-4 ${isSolid ? 'text-gray-500' : 'text-white/70'}`} />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`bg-transparent text-xs font-medium focus:outline-none cursor-pointer ${
                isSolid ? 'text-gray-700' : 'text-white'
              }`}
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr} className="text-gray-800">
                  {curr}
                </option>
              ))}
            </select>
          </div>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isSolid ? 'text-gray-700' : 'text-white'
                }`}
              >
                {user.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-accent-500"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="max-w-[100px] truncate">{user.name}</span>
                <HiChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <HiViewGrid className="w-4 h-4" /> {t('Dashboard')}
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <HiUser className="w-4 h-4" /> {t('Profile')}
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-accent-600 hover:bg-accent-50 transition-colors"
                      >
                        <HiViewGrid className="w-4 h-4" /> {t('Admin Panel')}
                      </Link>
                    )}
                    {!user.isVerified && (
                      <Link
                        to="/verify-email"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-600 hover:bg-yellow-50 transition-colors font-bold"
                      >
                        ⚠️ {t('Verify Email')}
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <HiLogout className="w-4 h-4" /> {t('Logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className={`text-sm font-medium transition-colors ${
                  isSolid ? 'text-gray-700 hover:text-accent-500' : 'text-white/90 hover:text-white'
                }`}
              >
                {t('Log In')}
              </Link>
              <Link to="/register" className="btn-primary btn-sm">
                {t('Register')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <HiX className={`w-6 h-6 ${isSolid ? 'text-gray-800' : 'text-white'}`} />
          ) : (
            <HiMenu className={`w-6 h-6 ${isSolid ? 'text-gray-800' : 'text-white'}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
          <div className="container-custom py-4 space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block py-2 text-sm font-medium ${
                    isActive ? 'text-accent-500' : 'text-gray-700'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <hr className="border-gray-100" />
            
            {/* Mobile Selectors */}
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{t('Language')}</label>
                <select
                  value={i18n.language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{t('Currency')}</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="border-gray-100" />
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-sm font-medium text-gray-700"
                >
                  {t('Dashboard')}
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-sm font-medium text-gray-700"
                >
                  {t('Profile')}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-sm font-medium text-accent-600"
                  >
                    {t('Admin Panel')}
                  </Link>
                )}
                {!user.isVerified && (
                  <Link
                    to="/verify-email"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-sm font-bold text-yellow-600"
                  >
                    ⚠️ {t('Verify Email')}
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block py-2 text-sm font-medium text-red-600"
                >
                  {t('Logout')}
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-outline btn-sm flex-1 text-center"
                >
                  {t('Log In')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary btn-sm flex-1 text-center"
                >
                  {t('Register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
