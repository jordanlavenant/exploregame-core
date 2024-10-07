import EditScriptStepCell from 'src/components/ScriptStep/EditScriptStepCell'

type ScriptStepPageProps = {
  id: string
}

const EditScriptStepPage = ({ id }: ScriptStepPageProps) => {
  return <EditScriptStepCell id={id} />
}

export default EditScriptStepPage
