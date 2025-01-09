import EditGenderCell from 'src/components/Gender/EditGenderCell'

type GenderPageProps = {
  id: string
}

const EditGenderPage = ({ id }: GenderPageProps) => {
  return <EditGenderCell id={id} />
}

export default EditGenderPage
