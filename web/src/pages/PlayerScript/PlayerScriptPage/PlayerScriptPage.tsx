import PlayerScriptCell from 'src/components/PlayerScript/PlayerScriptCell'

type PlayerScriptPageProps = {
  id: string
}

const PlayerScriptPage = ({ id }: PlayerScriptPageProps) => {
  return <PlayerScriptCell id={id} />
}

export default PlayerScriptPage
