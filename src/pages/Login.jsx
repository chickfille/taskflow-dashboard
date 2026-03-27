import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../services/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-white">Login</h1>

        <input
          className="w-full rounded-lg bg-zinc-800 p-3 text-white"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full rounded-lg bg-zinc-800 p-3 text-white"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-white p-3 text-black"
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default Login
