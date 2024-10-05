import EditScriptCell from 'src/components/Script/EditScriptCell'

type ScriptPageProps = {
  id: string
}

const EditScriptPage = ({ id }: ScriptPageProps) => {
  return <EditScriptCell id={id} />
}

export default EditScriptPage
