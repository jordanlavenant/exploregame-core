import EditQuestionCell from 'src/components/Question/EditQuestionCell'

type QuestionPageProps = {
  id: string
}

const EditQuestionPage = ({ id }: QuestionPageProps) => {
  return <EditQuestionCell id={id} />
}

export default EditQuestionPage
