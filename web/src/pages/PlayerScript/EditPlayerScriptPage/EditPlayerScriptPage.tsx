import EditPlayerScriptCell from 'src/components/PlayerScript/EditPlayerScriptCell'

type PlayerScriptPageProps = {
  id: string
}

const EditPlayerScriptPage = ({ id }: PlayerScriptPageProps) => {
  return <EditPlayerScriptCell id={id} />
}

export default EditPlayerScriptPage
