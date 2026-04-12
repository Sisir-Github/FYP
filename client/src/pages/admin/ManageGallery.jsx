import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '../../components/Modal.jsx'
import Loader from '../../components/Loader.jsx'
import ImageUploader from '../../components/ImageUploader.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import {
  useGetGalleryAdminQuery,
  useCreateGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} from '../../api/adminApi.js'

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  isFeatured: z.boolean().optional(),
})

const defaultValues = {
  title: '',
  category: '',
  description: '',
  image: '',
  isFeatured: false,
}

function ManageGallery() {
  const { data, isLoading } = useGetGalleryAdminQuery()
  const [createItem] = useCreateGalleryItemMutation()
  const [updateItem] = useUpdateGalleryItemMutation()
  const [deleteItem] = useDeleteGalleryItemMutation()
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
      category: item.category || '',
      description: item.description || '',
      image: item.image || '',
      isFeatured: Boolean(item.isFeatured),
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
        await updateItem({
          id: editing._id,
          payload: imageFile ? formData : payload,
        }).unwrap()
        pushToast({ type: 'success', message: 'Gallery item updated.' })
      } else {
        await createItem(imageFile ? formData : payload).unwrap()
        pushToast({ type: 'success', message: 'Gallery item added.' })
      }
      closeModal()
    } catch {
      pushToast({ type: 'error', message: 'Save failed. Check the fields.' })
    }
  }

  const onDelete = async (item) => {
    if (!window.confirm('Delete this gallery item?')) return
    try {
      await deleteItem(item._id).unwrap()
      pushToast({ type: 'success', message: 'Gallery item deleted.' })
    } catch {
      pushToast({ type: 'error', message: 'Delete failed.' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="admin-card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Gallery</h2>
            <p className="text-sm text-slate-500">
              Add real images and categories shown on the public gallery page.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Add Gallery Item
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loader label="Loading gallery..." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item._id} className="admin-card">
              <img
                src={resolveImage(item.image)}
                alt={item.title}
                className="h-40 w-full rounded-2xl object-cover"
              />
              <div className="mt-4 space-y-1">
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
                  {item.category}
                </p>
                {item.description && (
                  <p className="text-xs text-slate-500">{item.description}</p>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="admin-card text-sm text-slate-600">
              No gallery items yet. Add the first item to populate the public
              gallery.
            </div>
          )}
        </div>
      )}

      <Modal
        open={open}
        onClose={closeModal}
        title={editing ? 'Edit Gallery Item' : 'Add Gallery Item'}
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
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Sunrise at Kala Patthar"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Category
            </label>
            <input
              {...register('category')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Everest"
            />
            {errors.category && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.category.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Image URL (optional)
            </label>
            <input
              {...register('image')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
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
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Description (optional)
            </label>
            <textarea
              {...register('description')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              rows={3}
              placeholder="Short story about the photo."
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" {...register('isFeatured')} />
            Feature on homepage
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {editing ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ManageGallery
