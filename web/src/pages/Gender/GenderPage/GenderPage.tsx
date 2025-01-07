import GenderCell from 'src/components/Gender/GenderCell'

type GenderPageProps = {
  id: string
}

const GenderPage = ({ id }: GenderPageProps) => {
  return <GenderCell id={id} />
}

export default GenderPage
