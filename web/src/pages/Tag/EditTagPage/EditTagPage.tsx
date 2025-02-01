import EditTagCell from 'src/components/Tag/EditTagCell'

type TagPageProps = {
  id: string
}

const EditTagPage = ({ id }: TagPageProps) => {
  return <EditTagCell id={id} />
}

export default EditTagPage
