import EditQuestionTypeCell from 'src/components/QuestionType/EditQuestionTypeCell'

type QuestionTypePageProps = {
  id: string
}

const EditQuestionTypePage = ({ id }: QuestionTypePageProps) => {
  return <EditQuestionTypeCell id={id} />
}

export default EditQuestionTypePage
