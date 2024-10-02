import FiliereCell from 'src/components/Filiere/FiliereCell'

type FilierePageProps = {
  idF: string
}

const FilierePage = ({ idF }: FilierePageProps) => {
  return <FiliereCell idF={idF} />
}

export default FilierePage
