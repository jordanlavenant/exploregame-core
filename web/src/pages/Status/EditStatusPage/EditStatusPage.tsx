import EditStatusCell from 'src/components/Status/EditStatusCell'

type StatusPageProps = {
  id: string
}

const EditStatusPage = ({ id }: StatusPageProps) => {
  return <EditStatusCell id={id} />
}

export default EditStatusPage
