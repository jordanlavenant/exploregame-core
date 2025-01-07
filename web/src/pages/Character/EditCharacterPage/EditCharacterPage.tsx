import EditCharacterCell from 'src/components/Character/EditCharacterCell'

type CharacterPageProps = {
  id: string
}

const EditCharacterPage = ({ id }: CharacterPageProps) => {
  return <EditCharacterCell id={id} />
}

export default EditCharacterPage
