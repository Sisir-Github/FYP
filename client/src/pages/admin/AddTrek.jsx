import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useCreateTrekMutation,
  useGetRegionsAdminQuery,
} from '../../api/adminApi.js'
import ImageUploader from '../../components/ImageUploader.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  location: z.string().min(2, 'Location is required'),
  difficulty: z.string().min(1, 'Difficulty is required'),
  durationDays: z.coerce.number().min(1, 'Duration is required'),
  pricePerPerson: z.coerce.number().min(1, 'Price is required'),
  shortDescription: z.string().min(10, 'Short description is required'),
  longDescription: z.string().min(20, 'Long description is required'),
  highlights: z.string().optional(),
  included: z.string().optional(),
  excluded: z.string().optional(),
  maxGroupSize: z.coerce.number().min(1, 'Group size is required'),
  availableDates: z.string().optional(),
  region: z.string().min(1, 'Region is required'),
})

function AddTrek() {
  const navigate = useNavigate()
  const { pushToast } = useToast()
  const [coverImage, setCoverImage] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const { data: regionsData } = useGetRegionsAdminQuery()
  const [createTrek, { isLoading: creating }] = useCreateTrekMutation()
  const rawRegions =
    regionsData?.items ??
    regionsData?.data?.items ??
    regionsData?.data ??
    regionsData ??
    []
  const regions = Array.isArray(rawRegions) ? rawRegions : []

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      difficulty: 'Moderate',
      durationDays: 10,
      pricePerPerson: 1800,
      maxGroupSize: 12,
    },
  })

  const onSubmit = async (values) => {
    const payload = new FormData()
    payload.append('name', values.title.trim())
    payload.append('region', values.region)
    payload.append('difficulty', values.difficulty)
    payload.append('days', String(values.durationDays))
    payload.append('price', String(values.pricePerPerson))
    payload.append('maxGroupSize', String(values.maxGroupSize))
    payload.append('overview', values.shortDescription)
    payload.append('description', values.longDescription)
    payload.append('highlights', values.highlights || '')
    payload.append('included', values.included || '')
    payload.append('excluded', values.excluded || '')
    payload.append('availableDates', values.availableDates || '')
    payload.append('location', values.location)
    if (coverImage) payload.append('image', coverImage)
    galleryImages.forEach((file) => payload.append('galleryImages', file))

    try {
      await createTrek(payload).unwrap()
      pushToast({ type: 'success', message: 'Trek added successfully.' })
      navigate('/admin/treks')
    } catch (error) {
      pushToast({
        type: 'error',
        message:
          error?.data?.message ||
          error?.data?.errors?.[0]?.message ||
          'Unable to add trek. Please check required fields.',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Add New Trek</h1>
          <p className="text-sm text-slate-600">
            Create a new trek itinerary and publish it to the catalog.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/treks')}
          className="admin-pill"
        >
          Back to Treks
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, () =>
          pushToast({ type: 'error', message: 'Fix highlighted fields.' }),
        )}
        className="admin-card grid gap-4 p-5 md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Title
          </label>
          <input {...register('title')} className="admin-input w-full" />
          {errors.title && (
            <p className="text-xs text-rose-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Location
          </label>
          <input {...register('location')} className="admin-input w-full" />
          {errors.location && (
            <p className="text-xs text-rose-600">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Region
          </label>
          <select {...register('region')} className="admin-input w-full">
            <option value="">Select region</option>
            {regions.map((region) => (
              <option key={region._id || region.id} value={region._id || region.id}>
                {region.name}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="text-xs text-rose-600">{errors.region.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Difficulty
          </label>
          <select {...register('difficulty')} className="admin-input w-full">
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Challenging">Challenging</option>
            <option value="Extreme">Extreme</option>
          </select>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Duration (days)
          </label>
          <input type="number" {...register('durationDays')} className="admin-input w-full" />
          {errors.durationDays && (
            <p className="text-xs text-rose-600">{errors.durationDays.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Price per person
          </label>
          <input type="number" {...register('pricePerPerson')} className="admin-input w-full" />
          {errors.pricePerPerson && (
            <p className="text-xs text-rose-600">{errors.pricePerPerson.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Short description
          </label>
          <input {...register('shortDescription')} className="admin-input w-full" />
          {errors.shortDescription && (
            <p className="text-xs text-rose-600">{errors.shortDescription.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Long description
          </label>
          <textarea rows="4" {...register('longDescription')} className="admin-input w-full" />
          {errors.longDescription && (
            <p className="text-xs text-rose-600">{errors.longDescription.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Highlights (comma separated)
          </label>
          <input {...register('highlights')} className="admin-input w-full" />
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Included (comma separated)
          </label>
          <input {...register('included')} className="admin-input w-full" />
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Excluded (comma separated)
          </label>
          <input {...register('excluded')} className="admin-input w-full" />
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Max group size
          </label>
          <input type="number" {...register('maxGroupSize')} className="admin-input w-full" />
          {errors.maxGroupSize && (
            <p className="text-xs text-rose-600">{errors.maxGroupSize.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Available dates (comma separated)
          </label>
          <input {...register('availableDates')} className="admin-input w-full" />
        </div>

        <div className="md:col-span-2">
          <ImageUploader label="Cover image" value={coverImage} onChange={setCoverImage} />
        </div>

        <div className="md:col-span-2">
          <ImageUploader
            label="Gallery images"
            multiple
            value={galleryImages}
            onChange={setGalleryImages}
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-2">
          <button type="button" onClick={() => navigate('/admin/treks')} className="admin-pill">
            Cancel
          </button>
          <button type="submit" className="admin-button" disabled={creating}>
            {creating ? 'Saving...' : 'Save trek'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddTrek