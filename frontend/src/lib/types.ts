export type Role = 'admin' | 'teacher' | 'student' | 'parent'

export type User = {
  id: number
  email: string
  first_name: string
  last_name: string
  role: Role
  phone_number: string | null
  nationality: string
  created_at: string
}

export type SchoolClass = {
  id: number
  name: string
  arm: string
  class_teacher: number | null
  class_teacher_name: string | null
}

export type Subject = {
  id: number
  name: string
  code: string
}

export type Student = {
  id: number
  first_name: string
  last_name: string
  school_class: string
}

export type Term = 'first' | 'second' | 'third'

export type Result = {
  id: number
  student: number
  student_name: string
  subject: number
  subject_name: string
  session: string
  term: Term
  test_score: number
  exam_score: number
  total: number
  grade: string
  recorded_by: number | null
  updated_at: string
}

export type Post = {
  id: number
  title: string
  body: string
  category: 'news' | 'event'
  event_date: string | null
  is_published: boolean
  created_by: number | null
  created_at: string
}
