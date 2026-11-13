import PageHero from '../components/PageHero'
import { OFFICE_HOURS, SCHOOL_ADDRESS, SCHOOL_EMAIL, SCHOOL_PHONE } from '../lib/config'

const details = [
  { label: 'Visit us', value: SCHOOL_ADDRESS },
  { label: 'Call us', value: SCHOOL_PHONE },
  { label: 'Email us', value: SCHOOL_EMAIL },
  { label: 'Office hours', value: OFFICE_HOURS },
]

const departments = [
  { name: 'Admissions', text: 'Applications, school tours and entrance assessments.' },
  { name: 'Accounts', text: 'School fees, payment plans and receipts.' },
  { name: 'Portal support', text: 'Help with sign in, linking parents to children and results.' },
]

export default function ContactPage() {
  return (
    <div>
      <PageHero title="Contact us" subtitle="We'd love to hear from you. Reach the school office using any of the details below." />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          {details.map((detail) => (
            <div key={detail.label} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{detail.label}</h2>
              <p className="mt-2 font-medium text-slate-900">{detail.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-brand p-6 text-white sm:p-8">
          <h2 className="text-xl font-semibold">Who to ask</h2>
          <ul className="mt-4 space-y-4">
            {departments.map((department) => (
              <li key={department.name}>
                <p className="font-semibold text-accent">{department.name}</p>
                <p className="text-sm text-slate-200">{department.text}</p>
              </li>
            ))}
          </ul>
          <a
            href={'mailto:' + SCHOOL_EMAIL}
            className="mt-8 inline-block rounded-md bg-accent px-5 py-3 font-semibold text-brand-dark hover:brightness-95"
          >
            Send us an email
          </a>
        </div>
      </div>
    </div>
  )
}
