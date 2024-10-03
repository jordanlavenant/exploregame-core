import HintCell from 'src/components/Hint/HintCell'

type HintPageProps = {
  id: string
}

const HintPage = ({ id }: HintPageProps) => {
  return <HintCell id={id} />
}

export default HintPage
