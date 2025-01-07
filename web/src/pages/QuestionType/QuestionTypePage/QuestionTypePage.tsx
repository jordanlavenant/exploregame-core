import QuestionTypeCell from 'src/components/QuestionType/QuestionTypeCell'

type QuestionTypePageProps = {
  id: string
}

const QuestionTypePage = ({ id }: QuestionTypePageProps) => {
  return <QuestionTypeCell id={id} />
}

export default QuestionTypePage
