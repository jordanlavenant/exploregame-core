import ScriptCell from 'src/components/Script/ScriptCell'

type ScriptPageProps = {
  id: string
}

const ScriptPage = ({ id }: ScriptPageProps) => {
  return <ScriptCell id={id} />
}

export default ScriptPage
