import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { useMeQuery } from '../../api/authApi.js'
import { setCredentials } from '../../app/authSlice.js'
import Loader from '../../components/Loader.jsx'

function MyProfile() {
  const dispatch = useDispatch()
  const { user: authUser } = useSelector((state) => state.auth)
  const { data, isLoading } = useMeQuery()
  const profile = data?.data || data || authUser || {}

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  })

  useEffect(() => {
    reset({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    })
  }, [profile, reset])

  const onSubmit = (values) => {
    dispatch(setCredentials({ user: { ...profile, ...values } }))
  }

  if (isLoading) return <Loader label="Loading profile..." />

  return (
    <div className="container-shell py-12">
      <h1 className="font-display text-3xl text-ink">My Profile</h1>
      <p className="mt-2 text-sm text-slate-600">
        Keep your contact information updated for trip coordination.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-surface mt-8 grid gap-4 p-6 md:grid-cols-2"
      >
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Full name
          </label>
          <input
            type="text"
            {...register('name')}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Phone
          </label>
          <input
            type="text"
            {...register('phone')}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default MyProfile
