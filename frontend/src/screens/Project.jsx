import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js'
import { getWebContainer } from '../config/webcontainer'

function SyntaxHighlightedCode(props) {
    const ref = useRef(null)
    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)
            ref.current.removeAttribute('data-highlighted')
        }
    }, [props.className, props.children])
    return <code {...props} ref={ref} />
}
const Project = () => {
    const { projectId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    const messageBox = useRef(null)

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(new Set())
    const [project, setProject] = useState(location.state?.project || {})
    const [message, setMessage] = useState('')
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [fileTree, setFileTree] = useState({})
    const [currentFile, setCurrentFile] = useState(null)
    const [openFiles, setOpenFiles] = useState([])
    const [webContainer, setWebContainer] = useState(null)
    const [iframeUrl, setIframeUrl] = useState(null)
    const [runProcess, setRunProcess] = useState(null)
    const [isRunning, setIsRunning] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleUserClick = (id) => {
        setSelectedUserId(prev => {
            const newSet = new Set(prev)
            newSet.has(id) ? newSet.delete(id) : newSet.add(id)
            return newSet
        })
    }

    function addCollaborators() {
        axios.put("/projects/add-user", { projectId: projectId, users: Array.from(selectedUserId) })
            .then(() => setIsModalOpen(false)).catch(console.log)
    }

    const send = () => {
        if (!message.trim()) return

        if (message.includes('@ai')) {
            setLoading(true)
        }

        sendMessage('project-message', { message, sender: user })
        const newMessage = { sender: user, message }
        setMessages(prev => {
            const updated = [...prev, newMessage]
            let chatData = {}
            try {
                const stored = localStorage.getItem('chat_data')
                chatData = JSON.parse(stored || '{}')
                if (Array.isArray(chatData)) chatData = {} // Reset if it was an array
            } catch (e) { chatData = {} }

            chatData[project.name] = updated
            localStorage.setItem('chat_data', JSON.stringify(chatData))
            return updated
        })
        setMessage("")
    }

    function WriteAiMessage(msg) {
        const obj = JSON.parse(msg)
        return <Markdown options={{ overrides: { code: SyntaxHighlightedCode } }}>{obj.text}</Markdown>
    }

    useEffect(() => {
        if (!projectId) return

        const socket = initializeSocket(projectId)
        if (!webContainer) getWebContainer().then(setWebContainer)

        receiveMessage('project-message', data => {
            // Safety check: Don't add if we are the sender (local update already handled it)
            if (data.sender.email === user.email) return;

            if (data.sender._id === 'ai') {
                const msg = JSON.parse(data.message)
                webContainer?.mount(msg.fileTree)
                if (msg.fileTree) setFileTree(msg.fileTree)
            }

            setMessages(prev => {
                const updated = [...prev, data]
                let chatData = {}
                try {
                    const stored = localStorage.getItem('chat_data')
                    chatData = JSON.parse(stored || '{}')
                    if (Array.isArray(chatData)) chatData = {}
                } catch (e) { chatData = {} }

                chatData[project.name] = updated
                localStorage.setItem('chat_data', JSON.stringify(chatData))
                return updated
            })

            setLoading(false)
        })

        axios.get(`/projects/get-project/${projectId}`).then(res => {
            setProject(res.data.project)
            setFileTree(res.data.project.fileTree || {})
        })
        axios.get('/users/all').then(res => setUsers(res.data.users)).catch(console.log)

        return () => {
            socket.off('project-message') // Crucial: Remove the listener
            socket.disconnect();
        }
    }, [projectId])

    useEffect(() => {
        if (!projectId) return
        let chatData = {}
        try {
            const stored = localStorage.getItem('chat_data')
            chatData = JSON.parse(stored || '{}')
            if (Array.isArray(chatData)) chatData = {}
        } catch (e) { chatData = {} }

        const savedMessages = chatData[project.name]
        if (savedMessages) {
            setMessages(savedMessages)
        } else {
            setMessages([])
        }
    }, [])

    useEffect(() => {
        if (messageBox.current) messageBox.current.scrollTop = messageBox.current.scrollHeight
    }, [messages])

    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', { projectId: projectId, fileTree: ft }).catch(console.log)
    }

    async function runProject() {
        setIsRunning(true)
        try {
            await webContainer.mount(fileTree)
            const install = await webContainer.spawn("npm", ["install"])
            install.output.pipeTo(new WritableStream({ write: console.log }))
            if (runProcess) runProcess.kill()
            const run = await webContainer.spawn("npm", ["start"])
            run.output.pipeTo(new WritableStream({ write: console.log }))
            setRunProcess(run)
            webContainer.on('server-ready', (_, url) => { setIframeUrl(url); setIsRunning(false) })
        } catch (e) { console.error(e); setIsRunning(false) }
    }

    const getFileIcon = (f) => {
        if (f.endsWith('.js') || f.endsWith('.jsx')) return 'ri-javascript-line text-yellow-400'
        if (f.endsWith('.css')) return 'ri-css3-line text-blue-400'
        if (f.endsWith('.html')) return 'ri-html5-line text-orange-400'
        if (f.endsWith('.json')) return 'ri-braces-line text-yellow-300'
        return 'ri-file-line text-surface-400'
    }

    return (
        <main className='h-screen w-screen flex bg-surface-900 overflow-hidden'>
            {/* Chat */}
            <section className="relative flex flex-col h-screen w-[360px] min-w-[300px] bg-surface-800 border-r border-surface-700">
                <header className='flex justify-between items-center p-3 border-b border-surface-700'>
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate('/')} className="w-7 h-7 rounded-lg bg-surface-700 hover:bg-surface-600 flex items-center justify-center transition-colors">
                            <i className="ri-arrow-left-s-line text-surface-300"></i>
                        </button>
                        <div>
                            <h1 className="font-semibold text-surface-100 text-sm">{project.name}</h1>
                            <p className="text-[10px] text-surface-500">{project.users?.length || 1} members</p>
                        </div>
                    </div>
                    <div className="flex gap-1.5">
                        <button onClick={() => setIsModalOpen(true)} className="w-7 h-7 rounded-lg bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-colors">
                            <i className="ri-user-add-line text-accent text-xs"></i>
                        </button>
                        <button onClick={() => setIsSidePanelOpen(true)} className="w-7 h-7 rounded-lg bg-surface-700 hover:bg-surface-600 flex items-center justify-center transition-colors">
                            <i className="ri-team-line text-surface-300 text-xs"></i>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden relative">
                    <div ref={messageBox} className="absolute inset-0 overflow-y-auto p-3 space-y-2 scrollbar-hide">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <i className="ri-chat-3-line text-2xl text-surface-600 mb-2"></i>
                                <p className="text-xs text-surface-500">No messages yet</p>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender.email === user.email ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl ${msg.sender._id === 'ai' ? 'bg-surface-700 border border-surface-600 rounded-bl-md' :
                                    msg.sender.email === user.email ? 'bg-accent/15 border border-accent/20 rounded-br-md' : 'bg-surface-700 border border-surface-600 rounded-bl-md'
                                    }`}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${msg.sender._id === 'ai' ? 'bg-surface-600' : 'bg-accent/20'}`}>
                                            {msg.sender._id === 'ai' ? <i className="ri-robot-fill text-[9px] text-surface-300"></i> :
                                                <span className="text-[8px] font-bold text-accent">{msg.sender.email?.[0]?.toUpperCase()}</span>}
                                        </div>
                                        <span className="text-[10px] text-surface-500">{msg.sender._id === 'ai' ? 'AI' : msg.sender.email?.split('@')[0]}</span>
                                    </div>
                                    <div className='text-sm text-surface-100'>{msg.sender._id === 'ai' ? WriteAiMessage(msg.message) : msg.message}</div>
                                </div>
                            </div>
                        ))}

                        {loading && messages[messages.length - 1]?.sender.email === user.email && (
                            <div className='flex justify-start'>
                                <div className='max-w-[85%] p-3 rounded-2xl bg-surface-700 border border-surface-600 rounded-bl-md'>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-surface-600">
                                            <i className="ri-robot-fill text-[9px] text-surface-300"></i>
                                        </div>
                                        <span className="text-[10px] text-surface-500">AI</span>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce [animation-delay:0.4s]"></div>
                                        <span className='text-xs text-surface-400 ml-1'>Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-3 border-t border-surface-700">
                    <div className="flex gap-2">
                        <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && send()}
                            className="flex-1 px-4 py-2.5 rounded-xl font-medium bg-surface-900 border border-surface-700 text-surface-50 placeholder:text-surface-500 outline-none transition-all duration-300 focus:border-accent text-sm" placeholder="Message... (@ai for AI)" />
                        <button onClick={send} disabled={!message.trim()} className="px-3 rounded-xl font-semibold text-white bg-accent hover:bg-accent-dark transition-all duration-300 disabled:opacity-40">
                            <i className="ri-send-plane-fill text-sm"></i>
                        </button>
                    </div>
                </div>

                {/* Side Panel */}
                <div className={`absolute inset-0 bg-surface-800 z-20 transition-transform duration-300 ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <header className='flex justify-between items-center p-3 border-b border-surface-700'>
                        <span className='font-semibold text-surface-100 text-sm'>Team</span>
                        <button onClick={() => setIsSidePanelOpen(false)} className="w-7 h-7 rounded-lg bg-surface-700 flex items-center justify-center">
                            <i className="ri-close-line text-surface-300 text-sm"></i>
                        </button>
                    </header>
                    <div className="p-3 space-y-2">
                        {project.users?.map((u, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-surface-700/50">
                                <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-accent">{u.email?.[0]?.toUpperCase()}</span>
                                </div>
                                <span className="text-sm text-surface-200 truncate">{u.email}</span>
                                <div className="ml-auto w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Editor */}
            <section className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="flex items-center justify-between px-3 py-2 bg-surface-800 border-b border-surface-700">
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                        {openFiles.length === 0 && <span className="text-xs text-surface-500">No files open</span>}
                        {openFiles.map((f, i) => (
                            <button key={i} onClick={() => setCurrentFile(f)}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${currentFile === f ? 'bg-surface-700 text-surface-100' : 'text-surface-400 hover:text-surface-200'}`}>
                                <i className={getFileIcon(f)}></i>{f}
                            </button>
                        ))}
                    </div>
                    <button onClick={runProject} disabled={isRunning} className="px-3 py-1.5 rounded-xl font-semibold text-white bg-accent hover:bg-accent-dark transition-all duration-300 text-xs">
                        {isRunning ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1"></span>Running</> : <><i className="ri-play-fill mr-1"></i>Run</>}
                    </button>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Explorer */}
                    <div className="w-48 bg-surface-800 border-r border-surface-700 overflow-y-auto">
                        <div className="p-2.5 border-b border-surface-700">
                            <span className="text-[10px] font-semibold text-surface-500 uppercase">Explorer</span>
                        </div>
                        <div className="py-1">
                            {Object.keys(fileTree).length === 0 ? (
                                <div className="p-4 text-center"><i className="ri-folder-open-line text-xl text-surface-600"></i><p className="text-[10px] text-surface-500 mt-1">No files</p></div>
                            ) : Object.keys(fileTree).map((f, i) => (
                                <button key={i} onClick={() => { setCurrentFile(f); setOpenFiles([...new Set([...openFiles, f])]) }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${currentFile === f ? 'bg-accent/10 text-accent border-l-2 border-accent' : 'text-surface-400 hover:bg-surface-700/50 hover:text-surface-200'}`}>
                                    <i className={getFileIcon(f)}></i><span className="truncate">{f}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Code */}
                    <div className="flex-1 overflow-auto bg-surface-900">
                        {fileTree[currentFile] ? (
                            <pre className="h-full"><code className="block h-full outline-none p-4 font-mono text-sm text-surface-100 leading-relaxed" contentEditable suppressContentEditableWarning
                                onBlur={(e) => { const ft = { ...fileTree, [currentFile]: { file: { contents: e.target.innerText } } }; setFileTree(ft); saveFileTree(ft) }}
                                dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value }}
                                style={{ whiteSpace: 'pre-wrap', minHeight: '100%' }} /></pre>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <i className="ri-code-box-line text-3xl text-surface-600 mb-2"></i>
                                <p className="text-xs text-surface-500">Select a file</p>
                            </div>
                        )}
                    </div>

                    {/* Preview */}
                    {iframeUrl && webContainer && (
                        <div className="w-[350px] flex flex-col border-l border-surface-700">
                            <div className="flex items-center gap-2 p-2 bg-surface-800 border-b border-surface-700">
                                <input value={iframeUrl} onChange={(e) => setIframeUrl(e.target.value)}
                                    className="flex-1 px-2 py-1 bg-surface-700 rounded text-[10px] text-surface-300 border border-surface-600 outline-none" />
                            </div>
                            <iframe src={iframeUrl} className="flex-1 bg-white"></iframe>
                        </div>
                    )}
                </div>
            </section>

            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-surface-950/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-surface-800 border border-surface-700 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold text-surface-50">Add Members</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-7 h-7 rounded-lg bg-surface-700 flex items-center justify-center">
                                <i className="ri-close-line text-surface-300 text-sm"></i>
                            </button>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2 mb-4 scrollbar-hide">
                            {users.map(u => (
                                <div key={u._id} onClick={() => handleUserClick(u._id)}
                                    className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-colors ${selectedUserId.has(u._id) ? 'bg-accent/10 border border-accent/30' : 'bg-surface-700/50 border border-transparent hover:bg-surface-700'}`}>
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${selectedUserId.has(u._id) ? 'bg-accent' : 'bg-surface-600'}`}>
                                        <span className="text-[10px] font-bold text-white">{u.email?.[0]?.toUpperCase()}</span>
                                    </div>
                                    <span className="text-sm text-surface-100 truncate">{u.email}</span>
                                    {selectedUserId.has(u._id) && <i className="ri-check-line text-accent ml-auto"></i>}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 px-6 py-2 rounded-xl font-semibold bg-transparent border border-surface-600 text-surface-300 hover:bg-surface-700 transition-all duration-300 text-sm" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button onClick={addCollaborators} disabled={selectedUserId.size === 0} className="flex-1 px-6 py-2 rounded-xl font-semibold text-white bg-accent hover:bg-accent-dark transition-all duration-300 text-sm disabled:opacity-40">
                                Add ({selectedUserId.size})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Project