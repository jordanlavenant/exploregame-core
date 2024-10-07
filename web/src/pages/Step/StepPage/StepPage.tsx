import StepCell from 'src/components/Step/StepCell'

type StepPageProps = {
  id: string
}

const StepPage = ({ id }: StepPageProps) => {
  return <StepCell id={id} />
}

export default StepPage
