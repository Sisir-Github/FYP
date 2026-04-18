import { useState, useEffect } from 'react';
import { HiOutlineTrash, HiOutlineEye, HiOutlineReply } from 'react-icons/hi';
import contactService from '../../services/contactService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

const AdminContacts = () => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchContacts = async () => {
    try {
      const { data } = await contactService.getContacts();
      setContacts(data);
    } catch (error) {
      toast.error('Failed to fetch contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleView = async (id) => {
    try {
      const { data } = await contactService.getContact(id);
      setSelectedContact(data);
      setIsModalOpen(true);
      // Refresh list to update status if it was "new"
      fetchContacts();
    } catch (error) {
      toast.error('Failed to fetch message details');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await contactService.deleteContact(id);
        toast.success('Message deleted successfully');
        fetchContacts();
      } catch (error) {
        toast.error('Failed to delete message');
      }
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await contactService.updateStatus(id, status);
      toast.success(`Message marked as ${status}`);
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">{t('Contact Messages')}</h1>
        <p className="text-sm text-gray-500">{t('View and manage inquiries from the Contact Us form')}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">{t('Date')}</th>
                <th className="px-6 py-4 font-semibold">{t('Name')}</th>
                <th className="px-6 py-4 font-semibold">{t('Email')}</th>
                <th className="px-6 py-4 font-semibold">{t('Subject')}</th>
                <th className="px-6 py-4 font-semibold text-center">{t('Status')}</th>
                <th className="px-6 py-4 font-semibold text-center">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                    No contact messages found.
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{contact.name}</td>
                    <td className="px-6 py-4">{contact.email}</td>
                    <td className="px-6 py-4 truncate max-w-[200px]">{contact.subject}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                          contact.status === 'new'
                            ? 'bg-red-100 text-red-700'
                            : contact.status === 'replied'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {t(contact.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleView(contact._id)}
                          className="text-primary-500 hover:text-primary-700"
                          title="View"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold">{selectedContact.subject}</h2>
                <p className="text-sm text-gray-500">
                  From: {selectedContact.name} ({selectedContact.email})
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                  selectedContact.status === 'new'
                    ? 'bg-red-100 text-red-700'
                    : selectedContact.status === 'replied'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {selectedContact.status}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-6 max-h-[40vh] overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedContact.message}</p>
            </div>

            <div className="flex flex-wrap gap-3 pt-6 border-t">
              <button
                onClick={() => (window.location.href = `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`)}
                className="btn-primary flex items-center gap-2"
              >
                <HiOutlineReply /> Reply via Email
              </button>
              
              {selectedContact.status !== 'replied' && (
                <button
                  onClick={() => updateStatus(selectedContact._id, 'replied')}
                  className="btn bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  Mark as Replied
                </button>
              )}
              
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
