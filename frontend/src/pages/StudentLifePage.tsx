import CallToAction from '../components/CallToAction'
import InfoCard from '../components/InfoCard'
import PageHero from '../components/PageHero'
import Section from '../components/Section'

const clubs = [
  'Coding & Robotics', 'Debate & Public Speaking', 'Drama', 'Choir & Music', 'Art Club', 'Press Club',
  'Football', 'Basketball', 'Athletics', 'Chess', 'Science Club', 'Young Entrepreneurs',
]

const care = [
  { title: 'Counselling', text: 'Our school counsellor helps students with worries about school, friendships, family or the future.' },
  { title: 'Health care', text: 'A sick bay with a qualified nurse looks after students who feel unwell during the day.' },
  { title: 'Anti-bullying', text: 'We have zero tolerance for bullying. Every report is taken seriously and dealt with quickly.' },
  { title: 'Safeguarding', text: 'All staff are trained to keep children safe and know exactly what to do if they have a concern.' },
]

const boarding = [
  'Separate, supervised boarding houses for boys and girls',
  'House parents who live on site and look after students',
  'Evening study time with teachers available to help',
  'Balanced meals prepared fresh in the school kitchen',
  'Weekend activities, outings and visiting days for families',
]

export default function StudentLifePage() {
  return (
    <div>
      <PageHero title="Student Life" subtitle="Clubs, care and community. There's a lot more to school than lessons." />

      <Section title="Clubs and activities" intro="Every student joins at least one club each term. It's a great way to make friends and try something new.">
        <div className="flex flex-wrap gap-3">
          {clubs.map((club) => (
            <span key={club} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              {club}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Pastoral care" intro="We look after the whole child, not just their grades." shaded>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {care.map((item) => (
            <InfoCard key={item.title} title={item.title} text={item.text} />
          ))}
        </div>
      </Section>

      <Section title="Boarding">
        <div className="grid gap-8 lg:grid-cols-2">
          <p className="leading-relaxed text-slate-700">
            Boarding gives students a safe, structured home away from home. Boarders build independence and lifelong
            friendships, with caring staff on hand day and night.
          </p>
          <ul className="space-y-3">
            {boarding.map((point) => (
              <li key={point} className="flex gap-3 text-slate-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CallToAction
        title="See what's coming up"
        text="Sports days, cultural days, prize giving and more. Check the latest news and events."
        buttonText="News & Events"
        buttonLink="/news"
      />
    </div>
  )
}
