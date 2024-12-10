import EditCharacterStepCell from 'src/components/CharacterStep/EditCharacterStepCell'

type CharacterStepPageProps = {
  id: string
}

const EditCharacterStepPage = ({ id }: CharacterStepPageProps) => {
  return <EditCharacterStepCell id={id} />
}

export default EditCharacterStepPage
