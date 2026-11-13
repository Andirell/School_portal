import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Section from '../components/Section'
import { SCHOOL_EMAIL, SCHOOL_PHONE } from '../lib/config'

const steps = [
  { title: 'Get in touch', text: 'Call or email the admissions office to ask questions or book a school tour.' },
  { title: 'Fill in the form', text: 'Collect an application form from the school office, or ask us to email you one.' },
  { title: 'Entrance assessment', text: 'Your child sits a short test in English and Maths, followed by a friendly chat.' },
  { title: 'Offer and enrolment', text: 'If a place is offered, complete the enrolment documents and pay the acceptance fee.' },
]

const documents = [
  "Completed application form",
  "Copy of the child's birth certificate",
  'Two recent passport photographs',
  'Last two school reports',
  'Transfer letter from the previous school (for transfer students)',
  'Medical and immunisation record',
]

const entryPoints = [
  { level: 'JSS 1', age: 'About 10 – 11 years', note: 'Main entry point after primary school' },
  { level: 'JSS 2 – SSS 2', age: 'Transfer students', note: 'Places depend on space in the class' },
  { level: 'SSS 1', age: 'About 13 – 14 years', note: 'Entry into the senior school tracks' },
]

export default function AdmissionsPage() {
  return (
    <div>
      <PageHero title="Admissions" subtitle="We welcome applications all year round. Here's how to join our school family." />

      <Section title="How to apply">
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-bold text-white">{index + 1}</span>
              <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Entry points" shaded>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entryPoints.map((entry) => (
                <tr key={entry.level}>
                  <td className="px-4 py-3 font-semibold text-brand">{entry.level}</td>
                  <td className="px-4 py-3">{entry.age}</td>
                  <td className="px-4 py-3">{entry.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="What you'll need">
        <div className="grid gap-8 lg:grid-cols-2">
          <ul className="space-y-3">
            {documents.map((document) => (
              <li key={document} className="flex gap-3 text-slate-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                {document}
              </li>
            ))}
          </ul>
          <div className="rounded-lg bg-brand p-6 text-white">
            <h3 className="text-lg font-semibold">Talk to admissions</h3>
            <p className="mt-2 text-slate-200">Our team is happy to answer questions about places, fees and scholarships.</p>
            <ul className="mt-4 space-y-1 text-sm">
              <li>Phone: {SCHOOL_PHONE}</li>
              <li>Email: {SCHOOL_EMAIL}</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contact" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-brand-dark">
                Contact us
              </Link>
              <Link to="/faq" className="rounded-md border border-white/40 px-4 py-2 text-sm font-semibold hover:bg-white/10">
                Read the FAQ
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
