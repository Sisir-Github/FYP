import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRegisterMutation } from '../api/authApi.js'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../app/authSlice.js'
import { useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext.jsx'

const schema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [registerUser, { isLoading, error }] = useRegisterMutation()
  const { t } = useLanguage()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const errorMessage =
    error?.data?.message ||
    error?.data?.errors?.[0]?.message ||
    error?.data ||
    'Registration failed. Please try again.'

  const onSubmit = async (values) => {
    try {
      const response = await registerUser(values).unwrap()
      const payload =
        response?.user ||
        response?.data?.user ||
        response?.data ||
        response
      dispatch(
        setCredentials({
          user: {
            ...payload,
            name: payload?.name || values.name,
            email: payload?.email || values.email,
            role: payload?.role || 'USER',
          },
        }),
      )
      navigate('/')
    } catch {
      // Error handled via RTK Query error state.
    }
  }

  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-md">
        <div className="card-surface p-8 animate-fade-rise">
          <h1 className="font-display text-3xl text-ink">
            {t('registerTitle')}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {t('registerSubtitle')}
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {t('registerName')}
              </label>
              <input
                type="text"
                {...register('name')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Sherpa Tenzing"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {t('registerEmail')}
              </label>
              <input
                type="email"
                {...register('email')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {t('registerPassword')}
              </label>
              <input
                type="password"
                {...register('password')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="********"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {t('registerConfirm')}
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="********"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {error && (
              <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? t('authCreating') : t('registerButton')}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            {t('authExisting')}{' '}
            <Link to="/login" className="font-semibold text-blue-700">
              {t('authSignInLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
