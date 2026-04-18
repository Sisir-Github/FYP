import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogService from '../../services/blogService';
import { HiOutlineCalendar, HiOutlineUser, HiChevronLeft, HiShare } from 'react-icons/hi';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const BlogDetail = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await blogService.getBlogBySlug(slug);
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('Blog post not found')}</h2>
        <Link to="/blogs" className="text-primary-600 font-semibold hover:underline">
          {t('Back to Blogs')}
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-white min-h-screen pb-20">
      {/* Blog Header Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <img
          src={blog.image.url}
          alt={blog.title}
          className="w-full h-full object-cover shadow-inner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-10 left-0 w-full">
          <div className="max-w-4xl mx-auto px-4">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors"
            >
              <HiChevronLeft className="w-5 h-5" />
              {t('Back to Stories')}
            </Link>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-500 border-2 border-white/20 flex items-center justify-center text-sm font-bold">
                  {blog.author?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-white/60">{t('Written by')}</p>
                  <p className="text-sm font-semibold">{blog.author?.name}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/20 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <HiOutlineCalendar className="w-5 h-5 text-accent-400" />
                <div>
                  <p className="text-xs text-white/60">{t('Published on')}</p>
                  <p className="text-sm font-semibold">{format(new Date(blog.createdAt), 'MMMM dd, yyyy')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
          <div className="flex gap-2">
            <span className="bg-accent-100 text-accent-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Everest Adventures
            </span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors text-sm font-semibold"
          >
            <HiShare className="w-5 h-5" />
            {t('Share Story')}
          </button>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          {blog.description.split('\n').map((para, i) => (
            para.trim() && <p key={i}>{para}</p>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-20 p-8 bg-gray-50 rounded-3xl border border-gray-100 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{t('Interested in this experience?')}</h3>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            {t('Our expert guides can take you on the same paths described in this story. Check out our trekking packages to start your own adventure.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-center">
            <Link
              to="/treks"
              className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors"
            >
              {t('Explore Treks')}
            </Link>
            <Link
              to="/contact"
              className="bg-white text-primary-600 px-8 py-3 rounded-xl font-bold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
            >
              {t('Contact Us')}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogDetail;
