import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { setCredentials } from '../../app/authSlice.js'
import {
  useSendEmailOtpMutation,
  useVerifyEmailOtpMutation,
} from '../../api/authApi.js'
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from '../../api/userApi.js'
import { useToast } from '../../contexts/ToastContext.jsx'
import Loader from '../../components/Loader.jsx'

function MyProfile() {
  const dispatch = useDispatch()
  const { user: authUser } = useSelector((state) => state.auth)
  const { pushToast } = useToast()

  const { data, isLoading } = useGetProfileQuery()
  const profile = data?.data || data || authUser || {}

  const [updateProfile, { isLoading: savingProfile }] = useUpdateProfileMutation()
  const [changePassword, { isLoading: savingPassword }] = useChangePasswordMutation()
  const [sendEmailOtp, { isLoading: sendingOtp }] = useSendEmailOtpMutation()
  const [verifyEmailOtp, { isLoading: verifyingOtp }] = useVerifyEmailOtpMutation()

  const [profileImageFile, setProfileImageFile] = useState(null)
  const [otp, setOtp] = useState('')
  const [otpCooldown, setOtpCooldown] = useState(0)

  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  })

  useEffect(() => {
    reset({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    })
  }, [profile, reset])

  useEffect(() => {
    if (otpCooldown <= 0) return undefined
    const timer = setInterval(() => {
      setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [otpCooldown])

  const onSubmitProfile = async (values) => {
    const payload = new FormData()
    payload.append('name', values.name || '')
    payload.append('email', values.email || '')
    payload.append('phone', values.phone || '')
    if (profileImageFile) {
      payload.append('profileImage', profileImageFile)
    }

    try {
      const updated = await updateProfile(payload).unwrap()
      dispatch(setCredentials({ user: { ...authUser, ...updated } }))
      pushToast({ type: 'success', message: 'Profile updated successfully.' })
      setProfileImageFile(null)
    } catch (error) {
      pushToast({
        type: 'error',
        message: error?.data?.message || 'Failed to update profile.',
      })
    }
  }

  const onSubmitPassword = async (values) => {
    try {
      await changePassword(values).unwrap()
      resetPasswordForm()
      pushToast({ type: 'success', message: 'Password changed successfully.' })
    } catch (error) {
      pushToast({
        type: 'error',
        message: error?.data?.message || 'Failed to change password.',
      })
    }
  }

  const handleSendOtp = async () => {
    if (otpCooldown > 0) return
    try {
      await sendEmailOtp().unwrap()
      setOtpCooldown(60)
      pushToast({ type: 'success', message: 'OTP sent to your email.' })
    } catch (error) {
      pushToast({
        type: 'error',
        message: error?.data?.message || 'Failed to send OTP.',
      })
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.trim().length !== 6) {
      pushToast({ type: 'warning', message: 'Enter 6-digit OTP code.' })
      return
    }
    try {
      await verifyEmailOtp({ otp: otp.trim() }).unwrap()
      dispatch(
        setCredentials({
          user: {
            ...authUser,
            ...profile,
            isEmailVerified: true,
          },
        }),
      )
      setOtp('')
      pushToast({ type: 'success', message: 'Email verified successfully.' })
    } catch (error) {
      pushToast({
        type: 'error',
        message: error?.data?.message || 'OTP verification failed.',
      })
    }
  }

  if (isLoading) return <Loader label="Loading profile..." />

  return (
    <div className="container-shell py-12">
      <h1 className="font-display text-3xl text-ink">My Profile</h1>
      <p className="mt-2 text-sm text-slate-600">
        Update your profile, change password, and verify your email to unlock bookings.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit(onSubmitProfile)}
          className="card-surface grid gap-4 p-6"
        >
          <h2 className="font-display text-2xl text-ink">Profile Details</h2>

          <div className="flex items-center gap-4">
            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                {(profile?.name?.[0] || 'U').toUpperCase()}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setProfileImageFile(event.target.files?.[0] || null)}
              className="text-sm"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Full name</label>
            <input
              type="text"
              {...register('name')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</label>
            <input
              type="email"
              {...register('email')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Phone</label>
            <input
              type="text"
              {...register('phone')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white"
            disabled={savingProfile}
          >
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <div className="space-y-6">
          <div className="card-surface p-6">
            <h2 className="font-display text-2xl text-ink">Email Verification</h2>
            <p className="mt-2 text-sm text-slate-600">
              Booking is allowed only after email verification.
            </p>
            <div className="mt-4 rounded-xl border border-slate-200 p-3 text-sm">
              Status:{' '}
              <span className={profile?.isEmailVerified ? 'text-emerald-700' : 'text-rose-700'}>
                {profile?.isEmailVerified ? 'Verified' : 'Not Verified'}
              </span>
            </div>
            {!profile?.isEmailVerified && (
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || otpCooldown > 0}
                  className="w-full rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700"
                >
                  {sendingOtp
                    ? 'Sending OTP...'
                    : otpCooldown > 0
                      ? `Resend OTP in ${otpCooldown}s`
                      : 'Send OTP to Email'}
                </button>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    {verifyingOtp ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handlePasswordSubmit(onSubmitPassword)}
            className="card-surface grid gap-4 p-6"
          >
            <h2 className="font-display text-2xl text-ink">Change Password</h2>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Current password</label>
              <input
                type="password"
                {...registerPassword('currentPassword')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">New password</label>
              <input
                type="password"
                {...registerPassword('newPassword')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white"
            >
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
