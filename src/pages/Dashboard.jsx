import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { auth, db } from '../services/firebase'

function Dashboard() {
  const navigate = useNavigate()
  const user = auth.currentUser
  const [taskTitle, setTaskTitle] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }))
      setTasks(taskData)
    })

    return () => unsubscribe()
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleAddTask = async () => {
    if (!taskTitle.trim() || !user) return

    try {
      await addDoc(collection(db, 'tasks'), {
        title: taskTitle,
        completed: false,
        userId: user.uid,
        createdAt: serverTimestamp(),
      })
      setTaskTitle('')
    } catch (err) {
      alert(err.message)
    }
  }

  const toggleTaskComplete = async (taskId, currentValue) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        completed: !currentValue,
      })
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId))
    } catch (err) {
      alert(err.message)
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length
  const pendingCount = tasks.filter((task) => !task.completed).length

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                TaskFlow
              </p>
              <h1 className="mt-3 text-2xl font-semibold text-white">Dashboard</h1>
              <p className="mt-2 text-sm text-zinc-400">
                Manage your tasks in one clean workspace.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Signed in as
              </p>
              <p className="mt-2 break-all text-sm text-zinc-200">
                {user?.email || 'Unknown user'}
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-zinc-400">Total tasks</p>
                <p className="mt-1 text-2xl font-semibold text-white">{tasks.length}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-zinc-400">Completed</p>
                <p className="mt-1 text-2xl font-semibold text-white">{completedCount}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-zinc-400">Pending</p>
                <p className="mt-1 text-2xl font-semibold text-white">{pendingCount}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-8 w-full rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Logout
            </button>
          </aside>

          <main className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                    Overview
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">
                    Welcome back
                  </h2>
                  <p className="mt-2 max-w-2xl text-zinc-400">
                    Create, manage, and complete your tasks with a cleaner
                    full-stack dashboard experience.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                    <p className="text-sm text-zinc-400">Tasks</p>
                    <p className="mt-2 text-2xl font-semibold">{tasks.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                    <p className="text-sm text-zinc-400">Completed</p>
                    <p className="mt-2 text-2xl font-semibold">{completedCount}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                    <p className="text-sm text-zinc-400">Pending</p>
                    <p className="mt-2 text-2xl font-semibold">{pendingCount}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex flex-col gap-4 lg:flex-row">
                <input
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  placeholder="Enter a new task..."
                  className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/25"
                />

                <button
                  onClick={handleAddTask}
                  className="rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:scale-[1.01] hover:opacity-95"
                >
                  Add task
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                    Task list
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Your tasks
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {tasks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 py-10 text-center">
                    <p className="text-lg font-medium text-white">No tasks yet</p>
                    <p className="mt-2 text-sm text-zinc-400">
                      Add your first task to start using the dashboard.
                    </p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.04] lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="min-w-0">
                        <p
                          className={`truncate text-base font-medium ${
                            task.completed
                              ? 'text-zinc-500 line-through'
                              : 'text-white'
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="mt-2 text-sm text-zinc-500">
                          {task.completed ? 'Completed' : 'Pending'}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            toggleTaskComplete(task.id, task.completed)
                          }
                          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/5"
                        >
                          {task.completed ? 'Undo' : 'Complete'}
                        </button>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard