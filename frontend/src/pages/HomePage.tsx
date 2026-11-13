import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../components/Loading'
import PostCard from '../components/PostCard'
import { apiGet } from '../lib/api'
import { SCHOOL_MOTTO, SCHOOL_NAME } from '../lib/config'
import type { Post } from '../lib/types'
import { useAuth } from '../lib/useAuth'

const reasons = [
  { title: 'Strong academics', text: 'A broad curriculum taught by caring teachers, with regular feedback on every subject.' },
  { title: 'Character first', text: 'We help students grow in honesty, discipline and kindness alongside their studies.' },
  { title: 'Parents in the loop', text: 'Parents can check results online at any time and stay close to their child\'s progress.' },
  { title: 'Modern facilities', text: 'Science and ICT labs, a library and comfortable classrooms for focused learning.' },
  { title: 'Personal support', text: 'Extra lessons and counselling for students who need a little more help.' },
  { title: 'Clubs and activities', text: 'Sports, arts and tech clubs so every student finds something they love.' },
]

const portals = [
  { title: 'Students', text: 'See your scores and grades for every term.' },
  { title: 'Parents', text: 'Check your children\'s results in one place.' },
  { title: 'Teachers', text: 'Enter and update results for your class.' },
]

export default function HomePage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  useEffect(() => {
    apiGet<Post[]>('/news/')
      .then((data) => setPosts(data.slice(0, 3)))
      .catch(() => setPosts([]))
      .finally(() => setLoadingPosts(false))
  }, [])

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-dark to-brand text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">Welcome to {SCHOOL_NAME}</p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">Raising confident learners for tomorrow</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-200">{SCHOOL_MOTTO}.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={user ? '/dashboard' : '/signin'}
              className="rounded-md bg-accent px-5 py-3 font-semibold text-brand-dark hover:brightness-95"
            >
              {user ? 'Go to my dashboard' : 'Portal sign in'}
            </Link>
            <Link to="/news" className="rounded-md border border-white/40 px-5 py-3 font-semibold hover:bg-white/10">
              News & Events
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-brand">Why choose us</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">
          Everything a child needs to learn well, grow well and enjoy school.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => (
            <div key={reason.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 h-1 w-10 rounded bg-accent" />
              <h3 className="mb-2 font-semibold text-slate-900">{reason.title}</h3>
              <p className="text-sm text-slate-600">{reason.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-5 sm:grid-cols-3">
          <Link to="/about" className="rounded-lg bg-brand p-6 text-white hover:bg-brand-dark">
            <h3 className="text-lg font-semibold">About us</h3>
            <p className="mt-1 text-sm text-slate-200">Our story, vision and values.</p>
          </Link>
          <Link to="/academics" className="rounded-lg bg-brand p-6 text-white hover:bg-brand-dark">
            <h3 className="text-lg font-semibold">Academics</h3>
            <p className="mt-1 text-sm text-slate-200">Curriculum, subjects and grading.</p>
          </Link>
          <Link to="/admissions" className="rounded-lg bg-accent p-6 text-brand-dark hover:brightness-95">
            <h3 className="text-lg font-semibold">Admissions</h3>
            <p className="mt-1 text-sm">How to apply and what you'll need.</p>
          </Link>
        </div>
      </section>

      <section className="bg-brand-light">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold text-brand">School portal</h2>
          <p className="mt-2 max-w-xl text-slate-600">One sign in for students, parents and teachers.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {portals.map((portal) => (
              <Link
                key={portal.title}
                to={user ? '/dashboard' : '/signin'}
                className="rounded-lg bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-brand">{portal.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{portal.text}</p>
                <p className="mt-4 text-sm font-semibold text-brand">Open portal →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-brand">News & Events</h2>
            <p className="mt-2 text-slate-600">What's been happening around school.</p>
          </div>
          <Link to="/news" className="text-sm font-semibold text-brand hover:underline">
            See all news →
          </Link>
        </div>

        {loadingPosts && <Loading />}
        {!loadingPosts && posts.length === 0 && <p className="text-sm text-slate-500">No news yet. Check back soon.</p>}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}
