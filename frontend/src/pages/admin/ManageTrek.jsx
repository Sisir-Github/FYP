import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { HiArrowLeft, HiCloudUpload } from 'react-icons/hi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageTrek = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    price: '',
    difficulty: 'Moderate',
    maxAltitude: '',
    startPoint: '',
    endPoint: '',
    bestSeasons: '',
    accommodations: '',
    meals: '',
    included: '',
    excluded: '',
  });

  // Simplified Itinerary State for Phase 3
  const [itinerary, setItinerary] = useState([{ day: 1, title: '', description: '' }]);

  useEffect(() => {
    if (isEditMode) {
      fetchTrek();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchTrek = async () => {
    try {
      const { data } = await api.get(`/treks/${id}`);
      const t = data.data;
      setFormData({
        title: t.title,
        description: t.description,
        duration: t.duration,
        price: t.price,
        difficulty: t.difficulty,
        maxAltitude: t.maxAltitude,
        startPoint: t.startPoint,
        endPoint: t.endPoint,
        // Convert arrays to comma strings for simple editing
        bestSeasons: t.bestSeasons?.join(', ') || '',
        accommodations: t.accommodations?.join(', ') || '',
        meals: t.meals?.join(', ') || '',
        included: t.included?.join(', ') || '',
        excluded: t.excluded?.join(', ') || '',
      });
      if (t.itinerary?.length > 0) setItinerary(t.itinerary);
      if (t.images?.length > 0) setExistingImages(t.images);
    } catch (error) {
      toast.error('Failed to fetch trek details');
      navigate('/admin/treks');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItineraryChange = (index, field, value) => {
    const updated = [...itinerary];
    updated[index][field] = value;
    setItinerary(updated);
  };

  const addItineraryDay = () => {
    setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }]);
  };

  const removeItineraryDay = (index) => {
    const updated = itinerary.filter((_, i) => i !== index);
    // Reassign day numbers
    updated.forEach((day, i) => day.day = i + 1);
    setItinerary(updated);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = new FormData();
      
      // Append basic fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Append JSON strings for complex arrays
      submitData.set('itinerary', JSON.stringify(itinerary));

      // Instruct backend to replace old images if new ones are uploaded
      if (isEditMode && images.length > 0) {
          submitData.append('replaceImages', 'true');
      }

      // Append files
      images.forEach(img => {
        submitData.append('images', img);
      });

      if (isEditMode) {
        await api.put(`/treks/${id}`, submitData, { headers: { 'Content-Type': 'multipart/form-data' }});
        toast.success('Trek updated successfully');
      } else {
        await api.post('/treks', submitData, { headers: { 'Content-Type': 'multipart/form-data' }});
        toast.success('Trek created successfully');
      }
      
      navigate('/admin/treks');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save trek');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/admin/treks" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary-500 hover:border-primary-500 transition-colors">
          <HiArrowLeft />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-800">
            {isEditMode ? 'Edit Trek Package' : 'Create New Trek'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-heading font-bold text-primary-500 mb-6 border-b border-gray-100 pb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">Trek Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="input" required placeholder="e.g. Everest Base Camp Trek" />
            </div>

            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="input" required placeholder="Full description of the trek..."></textarea>
            </div>

            <div>
              <label className="label">Duration (Days)</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="input" required min="1" />
            </div>

            <div>
              <label className="label">Price (USD)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="input" required min="0" />
            </div>

            <div>
              <label className="label">Difficulty</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="input" required>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
                <option value="Strenuous">Strenuous</option>
              </select>
            </div>

            <div>
              <label className="label">Max Altitude (Meters)</label>
              <input type="number" name="maxAltitude" value={formData.maxAltitude} onChange={handleChange} className="input" required min="0" />
            </div>

            <div>
              <label className="label">Starting Point</label>
              <input type="text" name="startPoint" value={formData.startPoint} onChange={handleChange} className="input" required />
            </div>

            <div>
              <label className="label">Ending Point</label>
              <input type="text" name="endPoint" value={formData.endPoint} onChange={handleChange} className="input" required />
            </div>
          </div>
        </div>

        {/* Arrays & Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-heading font-bold text-primary-500 mb-6 border-b border-gray-100 pb-4">Details & Lists (Comma Separated)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Best Seasons</label>
              <input type="text" name="bestSeasons" value={formData.bestSeasons} onChange={handleChange} className="input" required placeholder="Spring, Autumn" />
            </div>
            <div>
              <label className="label">Accommodations</label>
              <input type="text" name="accommodations" value={formData.accommodations} onChange={handleChange} className="input" required placeholder="Teahouse, Hotel" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Meals Included</label>
              <input type="text" name="meals" value={formData.meals} onChange={handleChange} className="input" required placeholder="Breakfast, Lunch, Dinner" />
            </div>
            <div className="md:col-span-2">
              <label className="label">What's Included</label>
              <textarea name="included" value={formData.included} onChange={handleChange} rows="3" className="input" required placeholder="Airport pickup, Guide, Permits..."></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="label">What's Not Included</label>
              <textarea name="excluded" value={formData.excluded} onChange={handleChange} rows="3" className="input" required placeholder="International flights, Personal expenses..."></textarea>
            </div>
          </div>
        </div>

        {/* Itinerary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-heading font-bold text-primary-500">Daily Itinerary</h2>
            <button type="button" onClick={addItineraryDay} className="btn-outline btn-sm">Add Day</button>
          </div>
          
          <div className="space-y-6">
            {itinerary.map((day, ix) => (
              <div key={ix} className="p-5 border border-gray-200 rounded-xl relative bg-gray-50/50">
                {itinerary.length > 1 && (
                  <button type="button" onClick={() => removeItineraryDay(ix)} className="absolute top-4 right-4 text-red-500 text-sm font-medium hover:underline">
                    Remove Day
                  </button>
                )}
                <h4 className="font-bold text-gray-700 mb-4">Day {day.day}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="md:col-span-2">
                      <label className="label text-xs">Day Title</label>
                      <input type="text" value={day.title} onChange={(e) => handleItineraryChange(ix, 'title', e.target.value)} className="input py-2" required placeholder={`e.g. Kathmandu to Lukla`} />
                   </div>
                   <div className="md:col-span-2">
                      <label className="label text-xs">Description</label>
                      <textarea value={day.description} onChange={(e) => handleItineraryChange(ix, 'description', e.target.value)} rows="2" className="input py-2" required placeholder="Activities for the day..."></textarea>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-heading font-bold text-primary-500 mb-6 border-b border-gray-100 pb-4">Images (Max 5)</h2>
          
          {isEditMode && existingImages.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3">Current Images (Uploading new ones will replace these):</p>
              <div className="flex gap-4 overflow-x-auto">
                {existingImages.map((img, i) => (
                  <img key={i} src={img.url} className="w-24 h-24 object-cover rounded-lg border border-gray-200" alt={`old-${i}`} />
                ))}
              </div>
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-accent-500 transition-colors">
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="trek-images" />
            <label htmlFor="trek-images" className="cursor-pointer flex flex-col items-center">
              <HiCloudUpload className="text-5xl text-gray-400 mb-3" />
              <span className="font-heading font-bold text-gray-700">Click to upload images</span>
              <span className="text-xs text-gray-400 mt-1">Select up to 5 image files (JPEG, PNG).</span>
            </label>
          </div>
          
          {images.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm font-medium text-blue-700">{images.length} new files selected for upload.</p>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 border-t border-gray-200 pt-8 pb-10">
          <Link to="/admin/treks" className="btn btn-outline px-8 py-3">Cancel</Link>
          <button type="submit" disabled={submitting} className="btn-primary px-10 py-3 text-lg shadow-xl shadow-primary-500/30">
            {submitting ? <LoadingSpinner size="sm" /> : (isEditMode ? 'Save Changes' : 'Create Trek Package')}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ManageTrek;
