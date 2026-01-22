'use client'

import { useEffect, useState } from 'react'
import { AYTSLogo } from './ayts-logo'

interface MaintenancePageProps {
  message?: string
}

export function MaintenancePage({ message = 'Service is under maintenance' }: MaintenancePageProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // useEffect(() => {
  //   // Set a countdown timer (you can customize this)
  //   const targetTime = new Date()
  //   targetTime.setHours(targetTime.getHours() + 2) // 2 hours from now

  //   const timer = setInterval(() => {
  //     const now = new Date()
  //     const difference = targetTime.getTime() - now.getTime()

  //     if (difference > 0) {
  //       setTimeLeft({
  //         hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
  //         minutes: Math.floor((difference / 1000 / 60) % 60),
  //         seconds: Math.floor((difference / 1000) % 60)
  //       })
  //     } else {
  //       setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
  //     }
  //   }, 1000)

  //   return () => clearInterval(timer)
  // }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <AYTSLogo className="w-10 h-10" />
        </div>

        {/* Maintenance Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Under Maintenance
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          {message}
        </p>

        {/* Estimated Time */}
        {/* <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <p className="text-sm text-gray-500 mb-4">Expected to be back in:</p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 uppercase">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">:</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 uppercase">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">:</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 uppercase">Seconds</div>
            </div>
          </div>
        </div> */}

        {/* What you can do */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">In the meantime, you can:</h2>
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Check back in a few minutes
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Browse our help center
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Contact support if urgent
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-sm text-gray-500">
          <p>Need immediate assistance?</p>
          <p className="font-medium text-gray-700">
            Email: <a href="mailto:support@ayts.com" className="text-blue-600 hover:text-blue-700">support@ayts.com</a>
          </p>
        </div>

        {/* Refresh Button */}
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Page
        </button>
      </div>
    </div>
  )
}
