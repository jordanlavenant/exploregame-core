import EditScenarioCell from 'src/components/Scenario/EditScenarioCell'

type ScenarioPageProps = {
  id: string
}

const EditScenarioPage = ({ id }: ScenarioPageProps) => {
  return <EditScenarioCell id={id} />
}

export default EditScenarioPage
