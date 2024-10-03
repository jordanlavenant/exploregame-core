import EditLocationCell from 'src/components/Location/EditLocationCell'

type LocationPageProps = {
  id: string
}

const EditLocationPage = ({ id }: LocationPageProps) => {
  return <EditLocationCell id={id} />
}

export default EditLocationPage
