import EditDepartmentCell from 'src/components/Department/EditDepartmentCell'

type DepartmentPageProps = {
  id: string
}

const EditDepartmentPage = ({ id }: DepartmentPageProps) => {
  return <EditDepartmentCell id={id} />
}

export default EditDepartmentPage
