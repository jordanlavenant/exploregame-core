import EditHintLevelCell from 'src/components/HintLevel/EditHintLevelCell'

type HintLevelPageProps = {
  id: string
}

const EditHintLevelPage = ({ id }: HintLevelPageProps) => {
  return <EditHintLevelCell id={id} />
}

export default EditHintLevelPage
