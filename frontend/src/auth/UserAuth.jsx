import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'

const UserAuth = ({ children }) => {
    const { user, loading } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        // Only check auth after loading is complete
        if (!loading) {
            const token = localStorage.getItem('token')

            if (!token || !user) {
                navigate('/login')
            }
        }
    }, [loading, user, navigate])

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-900">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin"></div>
                    <span className="text-surface-400 text-sm">Loading...</span>
                </div>
            </div>
        )
    }

    // Don't render children if not authenticated
    if (!user) {
        return null
    }

    return <>{children}</>
}

export default UserAuth