import { useState } from 'react'
import ClassResultsViewer from '../components/ClassResultsViewer'
import NewsManager from '../components/NewsManager'
import PageHeader from '../components/PageHeader'
import { DJANGO_ADMIN_URL } from '../lib/config'

type Tab = 'news' | 'results'

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('news')

  function tabClass(name: Tab) {
    return (
      'border-b-2 px-4 py-2 text-sm font-medium ' +
      (tab === name ? 'border-brand text-brand' : 'border-transparent text-slate-500 hover:text-slate-800')
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader title="Admin panel" subtitle="Manage news and keep an eye on results.">
        <a
          href={DJANGO_ADMIN_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100"
        >
          Manage users, classes and students ↗
        </a>
      </PageHeader>

      <div className="mb-6 flex gap-2 border-b border-slate-200">
        <button className={tabClass('news')} onClick={() => setTab('news')}>
          News & Events
        </button>
        <button className={tabClass('results')} onClick={() => setTab('results')}>
          Class results
        </button>
      </div>

      {tab === 'news' ? <NewsManager /> : <ClassResultsViewer />}
    </div>
  )
}
