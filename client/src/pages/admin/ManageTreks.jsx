import {
  useGetTreksAdminQuery,
  useGetRegionsAdminQuery,
  useCreateTrekMutation,
  useUpdateTrekMutation,
  useDeleteTrekMutation,
} from '../../api/adminApi.js'
import Loader from '../../components/Loader.jsx'
import Modal from '../../components/Modal.jsx'
import ImageUploader from '../../components/ImageUploader.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

function ManageTreks() {
  const { data, isLoading, error } = useGetTreksAdminQuery()
  const { data: regionsData } = useGetRegionsAdminQuery()
  const [createTrek, { isLoading: creating, error: createError, isSuccess }] =
    useCreateTrekMutation()
  const [updateTrek, { isLoading: updating }] = useUpdateTrekMutation()
  const [deleteTrek] = useDeleteTrekMutation()
  const { pushToast } = useToast()
  const rawTreks = data?.items ?? data?.data?.items ?? data?.data ?? data ?? []
  const treks = Array.isArray(rawTreks) ? rawTreks : []
  const hasTreks = treks.length > 0
  const rawRegions =
    regionsData?.items ??
    regionsData?.data?.items ??
    regionsData?.data ??
    regionsData ??
    []
  const regions = Array.isArray(rawRegions) ? rawRegions : []
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])

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

  const {
    register,
    handleSubmit,
    reset,
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

  useEffect(() => {
    if (createError) {
      pushToast({
        type: 'error',
        message:
          createError?.data?.message ||
          createError?.data?.errors?.[0]?.message ||
          'Unable to add trek.',
      })
    }
  }, [createError, pushToast])

  useEffect(() => {
    if (isSuccess) {
      pushToast({ type: 'success', message: 'Trek added successfully.' })
      setOpen(false)
      reset()
      setCoverImage(null)
      setGalleryImages([])
    }
  }, [isSuccess, pushToast, reset])

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
    payload.append('region', values.region)
    payload.append('location', values.location)
    if (coverImage) payload.append('image', coverImage)
    galleryImages.forEach((file) => payload.append('galleryImages', file))
    try {
      if (editing?._id) {
        await updateTrek({ id: editing._id, payload }).unwrap()
        pushToast({ type: 'success', message: 'Trek updated successfully.' })
        setEditing(null)
        setOpen(false)
      } else {
        await createTrek(payload).unwrap()
      }
    } catch {
      pushToast({ type: 'error', message: 'Please fix highlighted fields.' })
    }
  }

  const openEdit = (trek) => {
    setEditing(trek)
    setOpen(true)
    reset({
      title: trek.name || '',
      location: trek.location || '',
      difficulty: trek.difficulty || 'Moderate',
      durationDays: trek.days || 10,
      pricePerPerson: trek.price || 1800,
      shortDescription: trek.overview || '',
      longDescription: trek.description || '',
      highlights: (trek.highlights || []).join(', '),
      included: (trek.included || []).join(', '),
      excluded: (trek.excluded || []).join(', '),
      maxGroupSize: trek.maxGroupSize || 12,
      availableDates: (trek.availableDates || []).join(', '),
      region: trek.region?._id || trek.region || '',
    })
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Delete this trek?')
    if (!confirmDelete) return
    try {
      await deleteTrek(id).unwrap()
      pushToast({ type: 'success', message: 'Trek deleted.' })
    } catch {
      pushToast({ type: 'error', message: 'Delete failed.' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-3xl">Manage Treks</h1>
          <p className="text-sm text-slate-600">
            Create, edit, and publish trekking itineraries.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
          className="admin-button"
        >
          Add trek
        </button>
      </div>
      {isLoading ? (
        <Loader label="Loading treks..." />
      ) : error && !hasTreks ? (
        <div className="admin-card-soft p-4 text-sm text-blue-700">
          Unable to load treks.
        </div>
      ) : (
        <div className="space-y-3">
          {treks.length === 0 && (
            <p className="text-sm text-slate-600">No treks available.</p>
          )}
          {treks.map((trek) => (
            <div
              key={trek.id || trek._id}
              className="admin-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold text-ink">{trek.name}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {trek.region?.name || trek.region || 'Region'} -{' '}
                  {trek.difficulty || 'Moderate'}
                </p>
              </div>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => openEdit(trek)}
                  className="rounded-full border border-slate-200 px-3 py-1"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(trek._id)}
                  className="rounded-full border border-slate-200 px-3 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal
        open={open}
        title={editing ? 'Edit Trek' : 'Add Trek'}
        onClose={() => setOpen(false)}
        size="sm"
      >
        <form
          onSubmit={handleSubmit(onSubmit, () =>
            pushToast({ type: 'error', message: 'Fix highlighted fields.' }),
          )}
          className="grid gap-4 md:grid-cols-2"
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
            {errors.difficulty && (
              <p className="text-xs text-rose-600">
                {errors.difficulty.message}
              </p>
            )}
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
            <button type="button" onClick={() => setOpen(false)} className="admin-pill">
              Cancel
            </button>
            <button
              type="submit"
              className="admin-button"
              disabled={creating || updating}
            >
              {creating || updating ? 'Saving...' : 'Save trek'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ManageTreks
