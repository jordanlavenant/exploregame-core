import CharacterCell from 'src/components/Character/CharacterCell'

type CharacterPageProps = {
  id: string
}

const CharacterPage = ({ id }: CharacterPageProps) => {
  return <CharacterCell id={id} />
}

export default CharacterPage
