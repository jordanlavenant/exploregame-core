import EditNewsCell from 'src/components/News/EditNewsCell'

type NewsPageProps = {
  id: string
}

const EditNewsPage = ({ id }: NewsPageProps) => {
  return <EditNewsCell id={id} />
}

export default EditNewsPage
