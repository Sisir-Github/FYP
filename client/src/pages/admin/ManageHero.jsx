import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '../../components/Modal.jsx'
import Loader from '../../components/Loader.jsx'
import ImageUploader from '../../components/ImageUploader.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import {
  useGetHeroSlidesAdminQuery,
  useCreateHeroSlideMutation,
  useUpdateHeroSlideMutation,
  useDeleteHeroSlideMutation,
} from '../../api/adminApi.js'

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  sortOrder: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
})

const defaultValues = {
  title: '',
  subtitle: '',
  description: '',
  image: '',
  ctaLabel: '',
  ctaHref: '',
  sortOrder: 0,
  isActive: true,
}

function ManageHero() {
  const { data, isLoading } = useGetHeroSlidesAdminQuery()
  const [createSlide] = useCreateHeroSlideMutation()
  const [updateSlide] = useUpdateHeroSlideMutation()
  const [deleteSlide] = useDeleteHeroSlideMutation()
  const { pushToast } = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const resolveImage = (src) =>
    src?.startsWith('/uploads') ? `${apiBase}${src}` : src

  const items = useMemo(() => data?.items || data?.data?.items || data || [], [data])

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues })

  const imagePreview = watch('image')

  const openCreate = () => {
    setEditing(null)
    setImageFile(null)
    reset(defaultValues)
    setOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setImageFile(null)
    reset({
      title: item.title || '',
      subtitle: item.subtitle || '',
      description: item.description || '',
      image: item.image || '',
      ctaLabel: item.ctaLabel || '',
      ctaHref: item.ctaHref || '',
      sortOrder: item.sortOrder ?? 0,
      isActive: Boolean(item.isActive),
    })
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
    setEditing(null)
  }

  const onSubmit = async (values) => {
    try {
      const imageValue = values.image?.trim() || ''
      const isImageValid =
        !imageValue ||
        imageValue.startsWith('/uploads/') ||
        imageValue.startsWith('http')

      if (!isImageValid) {
        setError('image', { message: 'Image must be a valid URL' })
        pushToast({ type: 'error', message: 'Fix highlighted fields.' })
        return
      }

      if (!imageFile && !imageValue) {
        setError('image', { message: 'Image is required' })
        pushToast({ type: 'error', message: 'Image is required.' })
        return
      }

      const payload = {
        ...values,
        image: imageValue || undefined,
      }

      const formData = new FormData()
      if (imageFile) {
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            formData.append(key, String(value))
          }
        })
        formData.append('imageFile', imageFile)
      }

      if (editing?._id) {
        await updateSlide({
          id: editing._id,
          payload: imageFile ? formData : payload,
        }).unwrap()
        pushToast({ type: 'success', message: 'Slide updated.' })
      } else {
        await createSlide(imageFile ? formData : payload).unwrap()
        pushToast({ type: 'success', message: 'Slide added.' })
      }
      closeModal()
    } catch {
      pushToast({ type: 'error', message: 'Save failed. Check the fields.' })
    }
  }

  const onDelete = async (item) => {
    if (!window.confirm('Delete this slide?')) return
    try {
      await deleteSlide(item._id).unwrap()
      pushToast({ type: 'success', message: 'Slide deleted.' })
    } catch {
      pushToast({ type: 'error', message: 'Delete failed.' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="admin-card p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl">Hero Carousel</h1>
            <p className="text-sm text-slate-600">
              Manage the homepage carousel slides, captions, and CTA links.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="admin-button"
          >
            Add Slide
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loader label="Loading slides..." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item._id} className="admin-card p-4">
              <img
                src={resolveImage(item.image)}
                alt={item.title}
                className="h-40 w-full rounded-2xl object-cover"
              />
              <div className="mt-4 space-y-1">
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="text-xs text-slate-500">
                  {item.subtitle || 'No subtitle'}
                </p>
                <p className="text-xs text-slate-400">
                  Order: {item.sortOrder ?? 0} ·{' '}
                  {item.isActive ? 'Active' : 'Hidden'}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="admin-button-secondary"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="admin-card text-sm text-slate-600">
              No slides yet. Add a slide to populate the home carousel.
            </div>
          )}
        </div>
      )}

      <Modal
        open={open}
        onClose={closeModal}
        title={editing ? 'Edit Slide' : 'Add Slide'}
        size="sm"
      >
        <form
          onSubmit={handleSubmit(onSubmit, () =>
            pushToast({ type: 'error', message: 'Fix highlighted fields.' }),
          )}
          className="space-y-4"
        >
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Title
            </label>
            <input
              {...register('title')}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Annapurna Base Camp"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Subtitle
            </label>
            <input
              {...register('subtitle')}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Snow amphitheater and warm Gurung villages."
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Short supporting description for the hero caption."
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Image URL (optional)
            </label>
            <input
              {...register('image')}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="https://images.unsplash.com/..."
            />
            {errors.image && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.image.message}
              </p>
            )}
          </div>
          <ImageUploader
            label="Or upload image"
            value={imageFile}
            onChange={setImageFile}
          />
          {imagePreview && !imageFile && (
            <img
              src={resolveImage(imagePreview)}
              alt="Preview"
              className="h-32 w-full rounded-2xl object-cover"
            />
          )}
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                CTA Label
              </label>
              <input
                {...register('ctaLabel')}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Explore trek"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                CTA Link
              </label>
              <input
                {...register('ctaHref')}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="/treks"
              />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Sort Order
              </label>
              <input
                type="number"
                {...register('sortOrder')}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" {...register('isActive')} />
              Active
            </label>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="admin-button-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="admin-button flex-1">
              {editing ? 'Save Changes' : 'Add Slide'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ManageHero
