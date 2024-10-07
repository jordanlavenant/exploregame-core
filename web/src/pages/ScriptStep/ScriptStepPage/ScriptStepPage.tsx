import ScriptStepCell from 'src/components/ScriptStep/ScriptStepCell'

type ScriptStepPageProps = {
  id: string
}

const ScriptStepPage = ({ id }: ScriptStepPageProps) => {
  return <ScriptStepCell id={id} />
}

export default ScriptStepPage
