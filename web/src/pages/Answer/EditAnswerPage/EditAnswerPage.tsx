import EditAnswerCell from 'src/components/Answer/EditAnswerCell'

type AnswerPageProps = {
  id: string
}

const EditAnswerPage = ({ id }: AnswerPageProps) => {
  return <EditAnswerCell id={id} />
}

export default EditAnswerPage
