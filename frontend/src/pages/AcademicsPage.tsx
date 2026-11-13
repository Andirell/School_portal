import CallToAction from '../components/CallToAction'
import InfoCard from '../components/InfoCard'
import PageHero from '../components/PageHero'
import Section from '../components/Section'

const stages = [
  {
    title: 'Junior Secondary (JSS 1 – 3)',
    text: 'A broad foundation across languages, maths, sciences, humanities, arts and technology, ending with the junior school certificate exam.',
  },
  {
    title: 'Senior Secondary (SSS 1 – 3)',
    text: 'Students choose a Science, Arts or Commercial track and prepare for their final school certificate and university entrance exams.',
  },
]

const subjectGroups = [
  { title: 'Core', subjects: ['English Language', 'Mathematics', 'Civic Education', 'Computer Studies'] },
  { title: 'Sciences', subjects: ['Basic Science', 'Biology', 'Chemistry', 'Physics', 'Further Mathematics', 'Agricultural Science'] },
  { title: 'Arts & Humanities', subjects: ['Literature in English', 'History', 'Government', 'Religious Studies', 'French', 'Fine Art', 'Music'] },
  { title: 'Commercial', subjects: ['Economics', 'Accounting', 'Commerce', 'Business Studies'] },
]

const support = [
  { title: 'Small classes', text: 'Classes are kept small so teachers can give each student real attention and feedback.' },
  { title: 'Extra lessons', text: 'Free catch-up lessons after school for any student who is finding a subject hard.' },
  { title: 'Exam preparation', text: 'Mock exams, past-paper practice and revision classes ahead of every major exam.' },
  { title: 'Labs and library', text: 'Well-equipped science and ICT labs and a quiet library with books and e-resources.' },
]

const grades = [
  { grade: 'A', range: '70 – 100', meaning: 'Excellent' },
  { grade: 'B', range: '60 – 69', meaning: 'Very good' },
  { grade: 'C', range: '50 – 59', meaning: 'Good' },
  { grade: 'D', range: '45 – 49', meaning: 'Fair' },
  { grade: 'E', range: '40 – 44', meaning: 'Pass' },
  { grade: 'F', range: '0 – 39', meaning: 'Needs improvement' },
]

export default function AcademicsPage() {
  return (
    <div>
      <PageHero title="Academics" subtitle="A balanced curriculum that builds strong foundations and opens doors to university and beyond." />

      <Section title="How school is organised">
        <div className="grid gap-5 md:grid-cols-2">
          {stages.map((stage) => (
            <InfoCard key={stage.title} title={stage.title} text={stage.text} />
          ))}
        </div>
        <p className="mt-6 text-slate-600">
          The school year has three terms. Each term students sit continuous assessment tests and an end of term exam.
        </p>
      </Section>

      <Section title="Subjects we offer" shaded>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {subjectGroups.map((group) => (
            <div key={group.title} className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-semibold text-brand">{group.title}</h3>
              <ul className="space-y-1.5 text-sm text-slate-600">
                {group.subjects.map((subject) => (
                  <li key={subject}>{subject}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="How we support learning">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {support.map((item) => (
            <InfoCard key={item.title} title={item.title} text={item.text} />
          ))}
        </div>
      </Section>

      <Section title="Assessment and grading" intro="Each subject is scored out of 100: a test out of 40 and an exam out of 60." shaded>
        <div className="max-w-xl overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((row) => (
                <tr key={row.grade}>
                  <td className="px-4 py-3 font-bold text-brand">{row.grade}</td>
                  <td className="px-4 py-3">{row.range}</td>
                  <td className="px-4 py-3">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-600">Parents and students can see every result online through the school portal.</p>
      </Section>

      <CallToAction
        title="Check results online"
        text="Students and parents can sign in to see scores and grades for every term."
        buttonText="Portal sign in"
        buttonLink="/signin"
      />
    </div>
  )
}
