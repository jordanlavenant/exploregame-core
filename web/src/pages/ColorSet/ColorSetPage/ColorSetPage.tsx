import ColorSetCell from 'src/components/ColorSet/ColorSetCell'

type ColorSetPageProps = {
  id: string
}

const ColorSetPage = ({ id }: ColorSetPageProps) => {
  return <ColorSetCell id={id} />
}

export default ColorSetPage
