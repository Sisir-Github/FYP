import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../api/authApi.js";
import { clearCredentials } from "../app/authSlice.js";
import { useGetMyChatUnreadCountQuery } from "../api/chatApi.js";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useCurrency } from "../contexts/CurrencyContext.jsx";

const navLinkClass =
  "text-sm uppercase tracking-[0.2em] font-semibold transition hover:text-blue-700";

function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const { data: unreadData } = useGetMyChatUnreadCountQuery(undefined, {
    skip: !isAuthenticated || user?.role === 'ADMIN',
    pollingInterval: 5000,
  });
  const dispatch = useDispatch();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const unreadChat = Number(unreadData?.unread || 0);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Ignore API errors and clear local state anyway.
    } finally {
      dispatch(clearCredentials());
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-blue-100/70 bg-white/90 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="flex flex-col">
          <span className="font-display text-xl text-ink">
            Everest Encounter
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-blue-700">
            Treks & Expeditions
          </span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          <NavLink to="/" className={navLinkClass}>
            {t("navHome")}
          </NavLink>
          <NavLink to="/treks" className={navLinkClass}>
            {t("navTreks")}
          </NavLink>
          <NavLink to="/guide" className={navLinkClass}>
            {t("navGuide")}
          </NavLink>
          <NavLink to="/gallery" className={navLinkClass}>
            {t("navGallery")}
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="hidden rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 md:block"
          >
            <option value="en">English</option>
            <option value="uk">English (UK)</option>
            <option value="hi">Hindi</option>
            <option value="ne">Nepali</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="ur">Urdu</option>
          </select>
          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="hidden rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 md:block"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="NPR">NPR</option>
          </select>
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-600 md:block">
                {t("navWelcome")}, {user?.name || t("authWelcomeTraveler")}
              </span>
              
              {user?.role === 'ADMIN' ? (
                <NavLink
                  to="/admin"
                  className="rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  Dashboard
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/user/bookings"
                    className="rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    My Bookings
                  </NavLink>
                  <NavLink
                    to="/user/profile"
                    className="rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/user/chat"
                    className="relative rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    Chat
                    {unreadChat > 0 && (
                      <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                        {unreadChat > 99 ? '99+' : unreadChat}
                      </span>
                    )}
                  </NavLink>
                </>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-700"
              >
                {t("navLogout")}
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded-full border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-700 hover:text-white"
              >
                {t("navSignIn")}
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-600"
              >
                {t("navRegister")}
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
