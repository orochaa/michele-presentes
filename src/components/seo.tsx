import { Helmet } from 'react-helmet-async'

interface SeoProps {
  title: string
  description: string
  imageUrl?: string
}

export function Seo({
  title,
  description,
  imageUrl,
}: SeoProps): React.JSX.Element {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {!!imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {!!imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </Helmet>
  )
}
