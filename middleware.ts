import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refresh session if it exists - actually updates cookies
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // If accessing /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // 1. Check Authentication
        if (authError || !user) {
            console.log("Middleware: No user found for admin route. Redirecting to login.");
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/login'
            redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
            return NextResponse.redirect(redirectUrl)
        }

        // 2. Check Admin Role
        // fetch profile role
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || profile?.role !== 'admin') {
            console.log("Middleware: User is not admin or profile missing.", {
                profileError,
                role: profile?.role,
                userId: user.id
            });
            // User is authenticated but not admin
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/' // Redirect to home
            return NextResponse.redirect(redirectUrl)
        }
    }

    // If accessing /login Or /register and already authenticated, redirect to /admin or profile
    const authRoutes = ['/login', '/register', '/forgot-password'];
    if (authRoutes.includes(request.nextUrl.pathname) && user) {
        // Check if admin to decide redirect
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = profile?.role === 'admin' ? '/admin' : '/'
        return NextResponse.redirect(redirectUrl)
    }

    // Add cache control headers to prevent caching of protected routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        supabaseResponse.headers.set('Cache-Control', 'no-store, must-revalidate')
        supabaseResponse.headers.set('Pragma', 'no-cache')
    }

    return supabaseResponse
}

export const config = {
    matcher: ['/admin/:path*', '/login', '/register', '/forgot-password'],
}
