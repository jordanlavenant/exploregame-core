import DepartmentCell from 'src/components/Department/DepartmentCell'

type DepartmentPageProps = {
  id: string
}

const DepartmentPage = ({ id }: DepartmentPageProps) => {
  return <DepartmentCell id={id} />
}

export default DepartmentPage
