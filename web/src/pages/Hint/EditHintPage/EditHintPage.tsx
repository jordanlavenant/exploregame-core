import EditHintCell from 'src/components/Hint/EditHintCell'

type HintPageProps = {
  id: string
}

const EditHintPage = ({ id }: HintPageProps) => {
  return <EditHintCell id={id} />
}

export default EditHintPage
