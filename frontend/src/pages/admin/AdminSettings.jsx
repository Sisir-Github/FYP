import { useState } from 'react';
import { 
  HiOutlineCog, 
  HiOutlineGlobeAlt, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineLocationMarker,
  HiOutlineShare,
  HiOutlineSave
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const AdminSettings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'Everest Encounter Treks',
    siteEmail: 'info@everestencounter.com',
    sitePhone: '+977-1-4XXXXXX',
    address: 'Thamel, Kathmandu, Nepal',
    facebook: 'https://facebook.com/everestencounter',
    instagram: 'https://instagram.com/everestencounter',
    currencyMode: 'automatic',
    maintenanceMode: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success(t('Settings updated successfully'));
    }, 1000);
  };

  const tabs = [
    { id: 'general', name: t('General'), icon: HiOutlineGlobeAlt },
    { id: 'contact', name: t('Contact Info'), icon: HiOutlineMail },
    { id: 'social', name: t('Social Links'), icon: HiOutlineShare },
    { id: 'advanced', name: t('Advanced'), icon: HiOutlineCog },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('Site Settings')}</h1>
          <p className="text-sm text-gray-500">{t('Configure global website parameters and contact details.')}</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          <HiOutlineSave className="w-5 h-5" /> {saving ? t('Saving...') : t('Save Changes')}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/20' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('Site Title')}</label>
                <input 
                  type="text" 
                  name="siteName" 
                  value={settings.siteName} 
                  onChange={handleChange} 
                  className="input" 
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{t('Maintenance Mode')}</h4>
                  <p className="text-xs text-gray-500">{t('Take the site offline for updates.')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="maintenanceMode" 
                    checked={settings.maintenanceMode} 
                    onChange={handleChange} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <HiOutlineMail className="text-gray-400" /> {t('Support Email')}
                  </label>
                  <input type="email" name="siteEmail" value={settings.siteEmail} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <HiOutlinePhone className="text-gray-400" /> {t('Contact Phone')}
                  </label>
                  <input type="text" name="sitePhone" value={settings.sitePhone} onChange={handleChange} className="input" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <HiOutlineLocationMarker className="text-gray-400" /> {t('Office Address')}
                </label>
                <textarea name="address" value={settings.address} onChange={handleChange} className="input min-h-[100px]" />
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6 animate-fade-in">
               <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <HiOutlineShare className="text-gray-400" /> Facebook URL
                </label>
                <input type="text" name="facebook" value={settings.facebook} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <HiOutlineShare className="text-gray-400" /> Instagram URL
                </label>
                <input type="text" name="instagram" value={settings.instagram} onChange={handleChange} className="input" />
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
             <div className="space-y-6 animate-fade-in">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('Currency Exchange Logic')}</label>
                  <select name="currencyMode" value={settings.currencyMode} onChange={handleChange} className="input">
                    <option value="automatic">{t('Automatic (via External API)')}</option>
                    <option value="manual">{t('Manual (Fixed Rates)')}</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-2">{t('Automatic mode updates rates every 24 hours.')}</p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
