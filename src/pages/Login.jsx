import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../services/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return

    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b] px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="hidden lg:block">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
            TaskFlow
          </p>
          <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-tight text-white">
            Organise your work with a cleaner, faster task dashboard.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-zinc-400">
            A full-stack productivity dashboard with authentication, real-time task
            management, and a modern SaaS-style interface.
          </p>

          <div className="mt-10 grid max-w-lg gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-sm text-zinc-400">Real-time task sync</p>
              <p className="mt-2 text-2xl font-semibold text-white">Live</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-sm text-zinc-400">Authentication</p>
              <p className="mt-2 text-2xl font-semibold text-white">Secure</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                Welcome back
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Sign in</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Enter your account details to access your dashboard.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">Email</label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/25"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">Password</label>
                <input
                  type="password"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/25"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="mt-2 w-full rounded-2xl bg-white px-4 py-3 font-medium text-black transition hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Demo account
              </p>
              <p className="mt-2 text-sm text-zinc-300">test@test.com</p>
              <p className="text-sm text-zinc-300">123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login