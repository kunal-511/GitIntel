import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find the verification token
    const verificationToken = await db.emailVerificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      await db.emailVerificationToken.delete({
        where: { id: verificationToken.id }
      })
      
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      )
    }

    // Check if token has already been used
    if (verificationToken.used) {
      return NextResponse.json(
        { error: 'Verification token has already been used' },
        { status: 400 }
      )
    }

    // Find the user
    const user = await db.user.findUnique({
      where: { email: verificationToken.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user email verification status
    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() }
    })

    // Mark token as used
    await db.emailVerificationToken.update({
      where: { id: verificationToken.id },
      data: { used: true }
    })

    return NextResponse.json({
      message: 'Email verified successfully! You can now sign in.',
    })

  } catch (error) {
    console.error('Email verification error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect('/auth/signin?error=missing-token')
  }

  try {
    // Find the verification token
    const verificationToken = await db.emailVerificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      return NextResponse.redirect('/auth/signin?error=invalid-token')
    }

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      await db.emailVerificationToken.delete({
        where: { id: verificationToken.id }
      })
      
      return NextResponse.redirect('/auth/signin?error=expired-token')
    }

    // Check if token has already been used
    if (verificationToken.used) {
      return NextResponse.redirect('/auth/signin?error=token-used')
    }

    // Find the user
    const user = await db.user.findUnique({
      where: { email: verificationToken.email }
    })

    if (!user) {
      return NextResponse.redirect('/auth/signin?error=user-not-found')
    }

    // Update user email verification status
    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() }
    })

    // Mark token as used
    await db.emailVerificationToken.update({
      where: { id: verificationToken.id },
      data: { used: true }
    })

    return NextResponse.redirect('/auth/signin?verified=true')

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect('/auth/signin?error=verification-failed')
  }
} 