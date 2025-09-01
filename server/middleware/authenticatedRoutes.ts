import { auth } from '../lib/auth'

export default defineEventHandler(async (event) => {
  const path = event.path

  // Bypass authentication for public pages
  if (path === '/auth' || path === '/about' || path === '/privacy' || path === '/terms') {
    return
  }

  // Check authentication for protected routes
  if (!path.startsWith('/api/auth') && !path.startsWith('/runtime')) {
    const session = await auth.api.getSession({
      headers: event.headers,
    })

    if (!session) {
      console.log('Unauthorized access attempt to', path)
      // For API routes, return 401
      if (path.startsWith('/api')) {
        setResponseStatus(event, 401, 'Unauthorized')
        return { error: 'Unauthorized' }
      }
      // For page routes, redirect to auth
      else {
        setResponseStatus(event, 302, 'Found')
        setResponseHeader(event, 'Location', '/auth')
        return { error: 'Redirecting to /auth' }
      }
    }

    // Attach the session to the event context for authenticated users
    event.context.session = session
  }
})
