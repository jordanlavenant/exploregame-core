import NewsCell from 'src/components/News/NewsCell'

type NewsPageProps = {
  id: string
}

const NewsPage = ({ id }: NewsPageProps) => {
  return <NewsCell id={id} />
}

export default NewsPage
