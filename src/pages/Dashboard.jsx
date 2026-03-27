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
    <div className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
              TaskFlow Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-bold">Welcome back</h1>
            <p className="mt-2 text-zinc-400">
              Your authenticated dashboard is live with Firebase and Firestore.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-900"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">Tasks</p>
            <h2 className="mt-2 text-3xl font-semibold">{tasks.length}</h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">Completed</p>
            <h2 className="mt-2 text-3xl font-semibold">{completedCount}</h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">Pending</p>
            <h2 className="mt-2 text-3xl font-semibold">{pendingCount}</h2>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="text-xl font-semibold">Add Task</h3>

          <div className="mt-4 flex gap-3">
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Enter a task..."
              className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none"
            />
            <button
              onClick={handleAddTask}
              className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:scale-105"
            >
              Add
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="text-xl font-semibold">Your Tasks</h3>

          <div className="mt-4 space-y-3">
            {tasks.length === 0 ? (
              <p className="text-zinc-400">No tasks yet.</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 transition hover:bg-zinc-900"
                >
                  <div>
                    <p
                      className={`font-medium ${
                        task.completed ? 'text-zinc-500 line-through' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {task.completed ? 'Completed' : 'Pending'}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleTaskComplete(task.id, task.completed)}
                      className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
                    >
                      {task.completed ? 'Undo' : 'Complete'}
                    </button>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:opacity-90"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
