import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../../services/blogService';
import { HiOutlineCalendar, HiOutlineUser, HiChevronRight } from 'react-icons/hi';
import { format } from 'date-fns';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await blogService.getAllBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-primary-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Travel Blog</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Discover stories, guides, and tips from our trekking adventures in the Himalayas and beyond.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        {blogs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No blog posts yet</h2>
            <p className="text-gray-500">Check back soon for new stories!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <Link to={`/blogs/${blog.slug}`} className="block relative h-60 overflow-hidden">
                  <img
                    src={blog.image.url}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                      Travel Story
                    </span>
                  </div>
                </Link>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <HiOutlineCalendar className="w-4 h-4" />
                      {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiOutlineUser className="w-4 h-4" />
                      {blog.author?.name}
                    </span>
                  </div>

                  <Link to={`/blogs/${blog.slug}`}>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {blog.description.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                  </p>

                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="inline-flex items-center gap-2 text-primary-600 font-bold text-sm hover:gap-3 transition-all underline decoration-primary-200 underline-offset-4 decoration-2 hover:decoration-primary-600"
                  >
                    Read More
                    <HiChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
