/**
 * Generate email HTML templates for various notifications
 */
const emailTemplates = {
  /**
   * Email verification template
   */
  verifyEmailOTP: (name, otp) => `
    <div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif;background:#f8fafc;padding:40px 20px;">
      <div style="background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="color:#1e3a5f;font-size:24px;margin:0;">⛰️ Everest Encounter Treks</h1>
        </div>
        <h2 style="color:#334155;font-size:20px;">Verify Your Email</h2>
        <p style="color:#64748b;font-size:15px;line-height:1.6;">
          Hello <strong>${name}</strong>,<br/>
          Thank you for registering with Everest Encounter Treks! Please use the following One-Time Password (OTP) to verify your email address.
        </p>
        <div style="text-align:center;margin:30px 0;">
          <div style="background:#f1f5f9;letter-spacing:4px;color:#1e3a5f;padding:16px 32px;border-radius:8px;font-weight:700;font-size:24px;display:inline-block;border:1px dashed #cbd5e1;">
            ${otp}
          </div>
        </div>
        <p style="color:#94a3b8;font-size:13px;">This OTP will expire in 10 minutes. If you didn't create an account, please ignore this email.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:30px 0;" />
        <p style="color:#94a3b8;font-size:12px;text-align:center;">© ${new Date().getFullYear()} Everest Encounter Treks and Expedition Pvt. Ltd.</p>
      </div>
    </div>
  `,

  /**
   * Password reset template
   */
  resetPassword: (name, resetUrl) => `
    <div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif;background:#f8fafc;padding:40px 20px;">
      <div style="background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="color:#1e3a5f;font-size:24px;margin:0;">⛰️ Everest Encounter Treks</h1>
        </div>
        <h2 style="color:#334155;font-size:20px;">Reset Your Password</h2>
        <p style="color:#64748b;font-size:15px;line-height:1.6;">
          Hello <strong>${name}</strong>,<br/>
          You requested a password reset. Click the button below to create a new password.
        </p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${resetUrl}" style="background:#e8612d;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color:#94a3b8;font-size:13px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:30px 0;" />
        <p style="color:#94a3b8;font-size:12px;text-align:center;">© ${new Date().getFullYear()} Everest Encounter Treks and Expedition Pvt. Ltd.</p>
      </div>
    </div>
  `,

  /**
   * Booking confirmation template
   */
  bookingConfirmation: (name, booking) => `
    <div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif;background:#f8fafc;padding:40px 20px;">
      <div style="background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="color:#1e3a5f;font-size:24px;margin:0;">⛰️ Everest Encounter Treks</h1>
        </div>
        <h2 style="color:#334155;font-size:20px;">Booking Confirmed! 🎉</h2>
        <p style="color:#64748b;font-size:15px;line-height:1.6;">
          Hello <strong>${name}</strong>,<br/>
          Your booking has been received successfully.
        </p>
        <div style="background:#f1f5f9;border-radius:8px;padding:20px;margin:20px 0;">
          <p style="margin:5px 0;color:#334155;"><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
          <p style="margin:5px 0;color:#334155;"><strong>Trek:</strong> ${booking.trekName}</p>
          <p style="margin:5px 0;color:#334155;"><strong>Travel Date:</strong> ${booking.travelDate}</p>
          <p style="margin:5px 0;color:#334155;"><strong>Group Size:</strong> ${booking.groupSize}</p>
          <p style="margin:5px 0;color:#334155;"><strong>Total Amount:</strong> Rs. ${booking.totalAmount}</p>
        </div>
        <p style="color:#64748b;font-size:14px;">We will review your booking and get back to you shortly.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:30px 0;" />
        <p style="color:#94a3b8;font-size:12px;text-align:center;">© ${new Date().getFullYear()} Everest Encounter Treks and Expedition Pvt. Ltd.</p>
      </div>
    </div>
  `,
};

module.exports = emailTemplates;
