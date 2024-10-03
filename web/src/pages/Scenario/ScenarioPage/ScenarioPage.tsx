import ScenarioCell from 'src/components/Scenario/ScenarioCell'

type ScenarioPageProps = {
  id: string
}

const ScenarioPage = ({ id }: ScenarioPageProps) => {
  return <ScenarioCell id={id} />
}

export default ScenarioPage
