import EditFiliereCell from 'src/components/Filiere/EditFiliereCell'

type FilierePageProps = {
  idF: string
}

const EditFilierePage = ({ idF }: FilierePageProps) => {
  return <EditFiliereCell idF={idF} />
}

export default EditFilierePage
