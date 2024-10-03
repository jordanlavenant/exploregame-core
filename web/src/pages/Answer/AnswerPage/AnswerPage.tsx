import AnswerCell from 'src/components/Answer/AnswerCell'

type AnswerPageProps = {
  id: string
}

const AnswerPage = ({ id }: AnswerPageProps) => {
  return <AnswerCell id={id} />
}

export default AnswerPage
