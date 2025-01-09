import EditStepCell from 'src/components/Step/EditStepCell'

type StepPageProps = {
  id: string
}

const EditStepPage = ({ id }: StepPageProps) => {
  return <EditStepCell id={id} />
}

export default EditStepPage
