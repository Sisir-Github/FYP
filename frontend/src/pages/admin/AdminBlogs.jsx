import { useState, useEffect } from 'react';
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiEye, 
  HiOutlinePhotograph, 
  HiX,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi';
import blogService from '../../services/blogService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublished: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchBlogs = async () => {
    try {
      const { data } = await blogService.getAllBlogs();
      setBlogs(data);
    } catch (error) {
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', isPublished: true });
    setImageFile(null);
    setImagePreview('');
    setIsEditing(false);
    setCurrentBlog(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (blog) => {
    setIsEditing(true);
    setCurrentBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      isPublished: blog.isPublished
    });
    setImagePreview(blog.image.url);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('isPublished', formData.isPublished);
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (isEditing) {
        await blogService.updateBlog(currentBlog._id, data);
        toast.success('Blog updated successfully');
      } else {
        if (!imageFile) {
          toast.error('Please upload an image');
          setFormLoading(false);
          return;
        }
        await blogService.createBlog(data);
        toast.success('Blog created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.deleteBlog(id);
        toast.success('Blog deleted');
        fetchBlogs();
      } catch (error) {
        toast.error('Failed to delete blog');
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
          <p className="text-sm text-gray-500">Create and manage your travel stories</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 active:scale-95"
        >
          <HiPlus className="w-5 h-5" />
          Add New Blog
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Blog Title</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-400">Loading blogs...</td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-400">No blogs found. Start by creating one!</td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                        <img src={blog.image.url} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800 line-clamp-1">{blog.title}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Created {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-[10px] flex items-center justify-center font-bold">
                          {blog.author?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-600 font-medium">{blog.author?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        blog.isPublished 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={`/blogs/${blog.slug}`} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                          <HiEye className="w-5 h-5" />
                        </a>
                        <button onClick={() => openEditModal(blog)} className="p-2 text-gray-400 hover:text-accent-600 transition-colors">
                          <HiPencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(blog._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <HiTrash className="w-5 h-5" />
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5 h-[60vh] overflow-y-auto px-2 custom-scrollbar">
                {/* Image Upload Area */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Blog Header Photo</label>
                  <div 
                    onClick={() => document.getElementById('imageInput').click()}
                    className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                      imagePreview ? 'border-primary-300 bg-primary-50/30' : 'border-gray-200 bg-gray-50 hover:border-primary-400 group'
                    }`}
                  >
                    <input 
                      id="imageInput"
                      type="file" 
                      className="hidden" 
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    {imagePreview ? (
                      <div className="relative h-48 w-full">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                          <span className="text-white text-sm font-bold">Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8">
                        <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 transition-colors">
                          <HiOutlinePhotograph className="w-6 h-6 text-gray-500 group-hover:text-primary-600" />
                        </div>
                        <p className="text-sm font-bold text-gray-800">Click to upload photo</p>
                        <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, WEBP (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Blog Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter an engaging title..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Blog Description / Content</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="10"
                    placeholder="Tell your story..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isPublished"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="w-5 h-5 accent-primary-600 rounded cursor-pointer"
                  />
                  <label htmlFor="isPublished" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                    Publish this post immediately
                  </label>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3.5 border-2 border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-colors active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className={`flex-[2] py-3.5 bg-primary-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center ${
                    formLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700'
                  }`}
                >
                  {formLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : null}
                  {isEditing ? 'Save Changes' : 'Create Blog Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
