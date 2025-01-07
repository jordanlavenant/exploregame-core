import EditColorSetCell from 'src/components/ColorSet/EditColorSetCell'

type ColorSetPageProps = {
  id: string
}

const EditColorSetPage = ({ id }: ColorSetPageProps) => {
  return <EditColorSetCell id={id} />
}

export default EditColorSetPage
