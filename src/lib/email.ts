import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`
  
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: 'Verify your GitIntel account',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; font-size: 28px; margin: 0;">GitIntel</h1>
            <p style="color: #6b7280; font-size: 16px; margin: 10px 0 0 0;">Analyze competition in open source GitHub projects</p>
          </div>
          
          <div style="background: #f9fafb; border-radius: 8px; padding: 30px; text-align: center;">
            <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0;">Verify Your Email Address</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
              Thanks for signing up! Please click the button below to verify your email address and complete your account setup.
            </p>
            
            <a href="${verificationUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
              Verify Email Address
            </a>
            
            <p style="color: #6b7280; font-size: 14px; margin: 30px 0 0 0;">
              If the button doesn't work, copy and paste this link into your browser:
              <br>
              <a href="${verificationUrl}" style="color: #3b82f6; word-break: break-all;">${verificationUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              This verification link will expire in 24 hours.
            </p>
          </div>
        </div>
      `,
    })
    
    return { success: true }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: 'Failed to send verification email' }
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`
  
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: 'Reset your GitIntel password',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; font-size: 28px; margin: 0;">GitIntel</h1>
            <p style="color: #6b7280; font-size: 16px; margin: 10px 0 0 0;">Analyze competition in open source GitHub projects</p>
          </div>
          
          <div style="background: #f9fafb; border-radius: 8px; padding: 30px; text-align: center;">
            <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0;">Reset Your Password</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
              You requested to reset your password. Click the button below to create a new password.
            </p>
            
            <a href="${resetUrl}" 
               style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
              Reset Password
            </a>
            
            <p style="color: #6b7280; font-size: 14px; margin: 30px 0 0 0;">
              If the button doesn't work, copy and paste this link into your browser:
              <br>
              <a href="${resetUrl}" style="color: #ef4444; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              This reset link will expire in 1 hour. If you didn't request this, please ignore this email.
            </p>
          </div>
        </div>
      `,
    })
    
    return { success: true }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: 'Failed to send password reset email' }
  }
} 