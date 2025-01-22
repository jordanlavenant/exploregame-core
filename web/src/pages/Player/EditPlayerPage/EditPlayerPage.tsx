import EditPlayerCell from 'src/components/Player/EditPlayerCell'

type PlayerPageProps = {
  id: string
}

const EditPlayerPage = ({ id }: PlayerPageProps) => {
  return <EditPlayerCell id={id} />
}

export default EditPlayerPage
