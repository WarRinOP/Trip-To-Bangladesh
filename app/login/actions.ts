'use server'

import { createServerClient } from '@/lib/supabase'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

const getRatelimit = () => {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        return new Ratelimit({
            redis: Redis.fromEnv(),
            limiter: Ratelimit.slidingWindow(5, '15 m'),
            analytics: true,
        })
    }
    return null
}

export async function loginAction(formData: FormData) {
    const ip = headers().get('x-forwarded-for') ?? '127.0.0.1'

    const ratelimit = getRatelimit()
    if (ratelimit) {
        const { success } = await ratelimit.limit(`login_${ip}`)
        if (!success) {
            return { error: 'Too many requests. Try again later.' }
        }
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
        return { error: 'Invalid credentials' }
    }

    const supabase = createServerClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: 'Invalid credentials' }
    }

    redirect('/admin')
}
