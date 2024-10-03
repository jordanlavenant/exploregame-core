import AdminCell from 'src/components/Admin/AdminCell'

type AdminPageProps = {
  id: string
}

const AdminPage = ({ id }: AdminPageProps) => {
  return <AdminCell id={id} />
}

export default AdminPage
