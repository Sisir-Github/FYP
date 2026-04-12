import {
  useGetRegionsAdminQuery,
  useCreateRegionMutation,
} from '../../api/adminApi.js'
import Loader from '../../components/Loader.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import { useEffect, useState } from 'react'

function ManageRegions() {
  const { data, isLoading, error } = useGetRegionsAdminQuery()
  const [createRegion, { isLoading: creating, error: createError, isSuccess }] =
    useCreateRegionMutation()
  const rawRegions =
    data?.items ?? data?.data?.items ?? data?.data ?? data ?? []
  const regions = Array.isArray(rawRegions) ? rawRegions : []
  const hasRegions = regions.length > 0
  const [form, setForm] = useState({ name: '', description: '' })
  const { pushToast } = useToast()

  useEffect(() => {
    if (createError) {
      pushToast({
        type: 'error',
        message:
          createError?.data?.message ||
          createError?.data?.errors?.[0]?.message ||
          'Unable to add region.',
      })
    }
  }, [createError, pushToast])

  useEffect(() => {
    if (isSuccess) {
      pushToast({ type: 'success', message: 'Region created successfully.' })
    }
  }, [isSuccess, pushToast])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) return
    try {
      await createRegion({
        name: form.name.trim(),
        description: form.description.trim(),
      }).unwrap()
      setForm({ name: '', description: '' })
    } catch {
      // Error handled by API state.
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-3xl">Manage Regions</h1>
          <p className="text-sm text-slate-600">
            Curate trekking regions and seasonal availability.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-2 md:grid-cols-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Region name"
            className="admin-input"
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short description"
            className="admin-input md:col-span-2"
          />
          <button
            type="submit"
            className="admin-button md:col-span-3"
            disabled={creating}
          >
            {creating ? 'Adding...' : 'Add region'}
          </button>
        </form>
      </div>
      {isLoading ? (
        <Loader label="Loading regions..." />
      ) : error && !hasRegions ? (
        <div className="admin-card-soft p-4 text-sm text-blue-700">
          Unable to load regions.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {regions.length === 0 && (
            <p className="text-sm text-slate-600">No regions added yet.</p>
          )}
          {regions.map((region) => (
            <div
              key={region.id || region._id}
              className="admin-card p-5"
            >
              <p className="font-semibold text-ink">{region.name}</p>
              <p className="mt-2 text-sm text-slate-600">
                {region.description || 'Add highlights and season notes.'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageRegions
