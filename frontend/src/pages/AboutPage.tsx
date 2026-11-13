import CallToAction from '../components/CallToAction'
import InfoCard from '../components/InfoCard'
import PageHero from '../components/PageHero'
import Section from '../components/Section'
import { SCHOOL_MOTTO, SCHOOL_NAME } from '../lib/config'

const values = [
  { title: 'Integrity', text: 'We tell the truth, keep our word and do the right thing even when nobody is watching.' },
  { title: 'Excellence', text: 'We aim high in the classroom, on the sports field and in everything we take on.' },
  { title: 'Respect', text: 'We treat every person with kindness, whatever their background or ability.' },
  { title: 'Service', text: 'We look for ways to help our classmates, our families and the wider community.' },
]

const milestones = [
  { year: 'Year 1', text: 'The school opens with two classrooms, a handful of teachers and its very first group of students.' },
  { year: 'Year 5', text: 'New science and ICT labs open, and the first set of students sit their final exams.' },
  { year: 'Year 10', text: 'The library, sports field and boarding house are added as the school grows.' },
  { year: 'Today', text: 'A full secondary school with a growing alumni community and an online portal for families.' },
]

export default function AboutPage() {
  return (
    <div>
      <PageHero title={'About ' + SCHOOL_NAME} subtitle="A caring secondary school where every student is known, challenged and supported." />

      <Section title="Who we are">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 leading-relaxed text-slate-700">
            <p>
              {SCHOOL_NAME} is a day and boarding secondary school for students aged 10 to 18. We believe good schooling is
              about more than exam grades. It's about raising young people who think clearly, act kindly and are ready to
              make a difference.
            </p>
            <p>
              Our classes are kept small so teachers get to know every student. We work closely with parents, and our
              online portal means families can follow their child's progress at any time.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-brand p-6 text-white">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">Our vision</h3>
              <p className="mt-2">To be a school where every child discovers their gifts and grows into a confident, responsible adult.</p>
            </div>
            <div className="rounded-lg bg-brand-dark p-6 text-white">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">Our mission</h3>
              <p className="mt-2">To give every student excellent teaching, strong values and the care they need to thrive.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 sm:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Our motto</h3>
              <p className="mt-2 text-lg font-semibold text-brand">{SCHOOL_MOTTO}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Our core values" intro="Four values shape how we teach, learn and live together." shaded>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <InfoCard key={value.title} title={value.title} text={value.text} />
          ))}
        </div>
      </Section>

      <Section title="Our story">
        <ol className="relative space-y-8 border-l-2 border-brand-light pl-6">
          {milestones.map((milestone) => (
            <li key={milestone.year}>
              <span className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-white bg-accent" />
              <h3 className="font-semibold text-brand">{milestone.year}</h3>
              <p className="mt-1 text-slate-600">{milestone.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CallToAction
        title="Come and see us"
        text="The best way to get to know a school is to visit. Book a tour with our admissions team."
        buttonText="Admissions"
        buttonLink="/admissions"
      />
    </div>
  )
}
