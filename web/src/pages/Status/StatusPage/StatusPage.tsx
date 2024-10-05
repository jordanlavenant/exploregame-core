import StatusCell from 'src/components/Status/StatusCell'

type StatusPageProps = {
  id: string
}

const StatusPage = ({ id }: StatusPageProps) => {
  return <StatusCell id={id} />
}

export default StatusPage
