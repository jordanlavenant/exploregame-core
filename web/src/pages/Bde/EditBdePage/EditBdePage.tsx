import EditBdeCell from 'src/components/Bde/EditBdeCell'

type BdePageProps = {
  id: string
}

const EditBdePage = ({ id }: BdePageProps) => {
  return <EditBdeCell id={id} />
}

export default EditBdePage
