import BdeCell from 'src/components/Bde/BdeCell'

type BdePageProps = {
  id: string
}

const BdePage = ({ id }: BdePageProps) => {
  return <BdeCell id={id} />
}

export default BdePage
