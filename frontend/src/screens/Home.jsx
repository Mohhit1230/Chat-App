import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const { user } = useContext(UserContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [projects, setProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)

    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        setIsCreating(true)
        axios.post('/projects/create', { name: projectName })
            .then(() => { setIsModalOpen(false); setProjectName(''); fetchProjects() })
            .catch(console.log)
            .finally(() => setIsCreating(false))
    }

    function fetchProjects() {
        axios.get('/projects/all')
            .then((res) => { setProjects(res.data.projects); setIsLoading(false) })
            .catch(() => setIsLoading(false))
    }

    function handleLogout() {
        localStorage.removeItem('token')
        navigate('/login')
    }

    useEffect(() => { fetchProjects() }, [])

    return (
        <div className="min-h-screen w-full bg-surface-900">
            {/* Nav */}
            <nav className="bg-surface-900/95 backdrop-blur-lg border-b border-surface-700/50 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                                <i className="ri-chat-smile-2-fill text-white text-sm"></i>
                            </div>
                            <span className="text-xl font-display text-surface-50">ChatApp</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800">
                                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-accent">{user?.email?.[0]?.toUpperCase()}</span>
                                </div>
                                <span className="text-xs text-surface-300">{user?.email?.split('@')[0]}</span>
                            </div>
                            <button onClick={handleLogout} className="px-4 py-2 rounded-lg font-medium text-surface-400 hover:bg-accent/10 hover:text-accent transition-all duration-200 text-sm">
                                <i className="ri-logout-box-r-line"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-display text-surface-50">Your Projects</h1>
                    <p className="text-surface-400 text-sm">Manage your workspaces</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* New Project */}

                    {/* Loading */}
                    {isLoading && [...Array(3)].map((_, i) => (
                        <div key={i} className="relative rounded-2xl bg-surface-800 border border-surface-700 p-5 min-h-[140px] animate-pulse">
                            <div className="w-9 h-9 rounded-lg bg-surface-700 mb-3"></div>
                            <div className="h-4 w-3/4 bg-surface-700 rounded mb-2"></div>
                            <div className="h-3 w-1/2 bg-surface-700/50 rounded"></div>
                        </div>
                    ))}

                    {/* Projects */}
                    {!isLoading && projects.map((project) => (
                        <div
                            key={project._id}
                            onClick={() => navigate(`/project/${project._id}`, { state: { project } })}
                            className="relative rounded-2xl bg-surface-800 border border-surface-700 shadow-lg transition-all duration-300 hover:border-accent/25 hover:shadow-xl hover:-translate-y-1 p-5 min-h-[140px] cursor-pointer group"
                        >
                            <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center mb-3 group-hover:bg-accent/25 transition-colors">
                                <i className="ri-folder-3-fill text-accent"></i>
                            </div>
                            <h3 className="font-semibold text-surface-100 text-sm mb-1">{project.name}</h3>
                            <p className="text-xs text-surface-400">{project.users?.length || 1} member{project.users?.length !== 1 ? 's' : ''}</p>
                        </div>
                    ))}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group p-5 min-h-[140px] flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-surface-600 hover:border-accent/40 bg-transparent transition-all duration-300"
                    >
                        <div className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                            <i className="ri-add-line text-xl text-surface-400 group-hover:text-accent"></i>
                        </div>
                        <span className="text-sm font-medium text-surface-300 group-hover:text-surface-100">New Project</span>
                    </button>

                </div>

                {/* Empty */}
                {!isLoading && projects.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-800 flex items-center justify-center">
                            <i className="ri-folder-open-line text-2xl text-surface-500"></i>
                        </div>
                        <p className="text-surface-400 text-sm mb-4">No projects yet</p>
                        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 rounded-xl font-semibold text-white bg-accent hover:bg-accent-dark transition-all duration-300 text-sm">
                            Create Project
                        </button>
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-surface-950/90 backdrop-blur-sm animate-scale-in" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-surface-800 border border-surface-700 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-display text-surface-50">New Project</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-7 h-7 rounded-lg bg-surface-700 hover:bg-surface-600 flex items-center justify-center transition-colors">
                                <i className="ri-close-line text-surface-300 text-sm"></i>
                            </button>
                        </div>
                        <form onSubmit={createProject}>
                            <input
                                onChange={(e) => setProjectName(e.target.value)}
                                value={projectName}
                                type="text"
                                className="w-full px-4 py-3.5 rounded-xl font-medium bg-surface-900 border border-surface-700 text-surface-50 placeholder:text-surface-500 outline-none transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/10 text-sm mb-4"
                                placeholder="Project name"
                                required
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button type="button" className="flex-1 px-6 py-2.5 rounded-xl font-semibold bg-transparent border border-surface-600 text-surface-300 hover:bg-surface-800 hover:text-surface-50 transition-all duration-300 text-sm" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-6 py-2.5 rounded-xl font-semibold text-white bg-accent hover:bg-accent-dark transition-all duration-300 text-sm" disabled={isCreating}>
                                    {isCreating ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home