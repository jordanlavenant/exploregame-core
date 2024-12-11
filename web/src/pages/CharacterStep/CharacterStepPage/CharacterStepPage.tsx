import CharacterStepCell from 'src/components/CharacterStep/CharacterStepCell'

type CharacterStepPageProps = {
  id: string
}

const CharacterStepPage = ({ id }: CharacterStepPageProps) => {
  return <CharacterStepCell id={id} />
}

export default CharacterStepPage
