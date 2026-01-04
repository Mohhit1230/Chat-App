import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    function submitHandler(e) {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        axios.post('/users/register', { email, password })
            .then((res) => {
                localStorage.setItem('token', res.data.token)
                setUser(res.data.user)
                navigate('/')
            })
            .catch((err) => setError(err.response?.data?.message || 'Registration failed'))
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-surface-900">
            {/* Orbs */}
            <div className="absolute w-96 h-96 -top-40 -right-32 rounded-full bg-surface-600/50 blur-[80px] animate-float" />
            <div className="absolute w-72 h-72 -bottom-24 -left-24 rounded-full bg-accent/30 blur-[80px] animate-float" style={{ animationDelay: '4s' }} />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md mx-4 animate-slide-up">
                <div className="bg-white/5 border border-surface-700/50 shadow-xl rounded-2xl p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-accent flex items-center justify-center">
                            <i className="ri-user-add-fill text-xl text-white"></i>
                        </div>
                        <h1 className="text-3xl font-display text-surface-50 mb-2">Join us today!</h1>
                        <p className="text-surface-400 text-sm">Create your account</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 p-3 rounded-lg bg-accent/10 border border-accent/20 animate-scale-in">
                            <p className="text-accent text-sm flex items-center gap-2">
                                <i className="ri-error-warning-line"></i>{error}
                            </p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submitHandler} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-surface-300 mb-1.5">Email</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500">
                                    <i className="ri-mail-line text-sm"></i>
                                </span>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    className="w-full px-4 py-3.5 pl-10 rounded-xl font-medium bg-surface-900 border border-surface-700 text-surface-50 placeholder:text-surface-500 outline-none transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/10 text-sm"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-300 mb-1.5">Password</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500">
                                    <i className="ri-lock-line text-sm"></i>
                                </span>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    className="w-full px-4 py-3.5 pl-10 rounded-xl font-medium bg-surface-900 border border-surface-700 text-surface-50 placeholder:text-surface-500 outline-none transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/10 text-sm"
                                    placeholder="Create password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-6 px-6 py-3 rounded-xl font-semibold text-white bg-accent hover:bg-accent-dark transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(233,77,55,0.25)] hover:shadow-[0_6px_24px_rgba(233,77,55,0.35)] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Creating...</>
                            ) : 'Create account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-surface-700"></div>
                        <span className="text-surface-500 text-xs">or</span>
                        <div className="flex-1 h-px bg-surface-700"></div>
                    </div>

                    {/* Social */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="px-6 py-2.5 rounded-xl font-semibold bg-transparent border border-surface-600 text-surface-300 hover:bg-surface-800 hover:border-surface-500 hover:text-surface-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                            <i className="ri-google-fill"></i>Google
                        </button>
                        <button className="px-6 py-2.5 rounded-xl font-semibold bg-transparent border border-surface-600 text-surface-300 hover:bg-surface-800 hover:border-surface-500 hover:text-surface-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                            <i className="ri-github-fill"></i>GitHub
                        </button>
                    </div>

                    <p className="text-center text-surface-400 mt-6 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-accent hover:text-accent-light font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register