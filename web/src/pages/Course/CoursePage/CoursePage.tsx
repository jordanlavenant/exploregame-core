import CourseCell from 'src/components/Course/CourseCell'

type CoursePageProps = {
  id: string
}

const CoursePage = ({ id }: CoursePageProps) => {
  return <CourseCell id={id} />
}

export default CoursePage
