import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { SCHOOL_NAME } from '../lib/config'

const questions = [
  {
    question: 'What age groups do you take?',
    answer: 'We are a secondary school for students from JSS 1 to SSS 3, usually between 10 and 18 years old.',
  },
  {
    question: 'When can my child join?',
    answer: 'Most students join at the start of JSS 1 or SSS 1, but we accept transfer students into other classes whenever there is space.',
  },
  {
    question: 'Do you offer boarding?',
    answer: 'Yes. We have supervised boarding houses for boys and girls, as well as day places.',
  },
  {
    question: 'How do I check my child\'s results?',
    answer: 'Create a parent account on the portal and ask the school office to link it to your child. You will then see every result as soon as teachers enter it.',
  },
  {
    question: 'What happens if my child is struggling in a subject?',
    answer: 'Teachers will let you know early, and your child can join our free after-school catch-up lessons until they are back on track.',
  },
  {
    question: 'How do you deal with bullying?',
    answer: 'We have a zero tolerance policy. Every report is investigated, parents are kept informed, and we work with everyone involved to stop it happening again.',
  },
  {
    question: 'Are there scholarships?',
    answer: 'We offer a small number of academic and sports scholarships each year. Contact the admissions office for details.',
  },
  {
    question: 'I forgot my portal password. What do I do?',
    answer: 'Click "Forgot your password?" on the sign in page and we will email you a link to choose a new one.',
  },
]

export default function FaqPage() {
  return (
    <div>
      <PageHero title="Frequently asked questions" subtitle={'Answers to the questions families ask us most about ' + SCHOOL_NAME + '.'} />

      <div className="mx-auto max-w-3xl px-4 py-14">
        <div className="space-y-3">
          {questions.map((item) => (
            <details key={item.question} className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                {item.question}
                <span className="text-xl text-brand transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>

        <p className="mt-10 text-center text-slate-600">
          Still have a question?{' '}
          <Link to="/contact" className="font-semibold text-brand hover:underline">
            Get in touch
          </Link>
        </p>
      </div>
    </div>
  )
}
