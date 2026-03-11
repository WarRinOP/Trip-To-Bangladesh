'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { loginAction } from './actions'

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormDataType = z.infer<typeof loginSchema>

export default function LoginPage() {
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormDataType>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: FormDataType) => {
        setServerError(null)
        const formData = new FormData()
        formData.append('email', data.email)
        formData.append('password', data.password)

        const response = await loginAction(formData)

        if (response?.error) {
            setServerError(response.error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary px-4">
            <div className="max-w-md w-full bg-background-secondary p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-serif text-accent-gold mb-6 text-center">Admin Login</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-text-muted mb-1 text-sm">Email</label>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full bg-background-primary border border-gray-700 rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent-gold"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-text-muted mb-1 text-sm">Password</label>
                        <input
                            {...register('password')}
                            type="password"
                            className="w-full bg-background-primary border border-gray-700 rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent-gold"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {serverError && (
                        <div className="text-red-500 text-sm text-center">{serverError}</div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-accent-gold text-background-primary py-2 px-4 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isSubmitting ? 'Logging in...' : 'Log in'}
                    </button>
                </form>
            </div>
        </div>
    )
}
