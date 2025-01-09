import HintLevelCell from 'src/components/HintLevel/HintLevelCell'

type HintLevelPageProps = {
  id: string
}

const HintLevelPage = ({ id }: HintLevelPageProps) => {
  return <HintLevelCell id={id} />
}

export default HintLevelPage
