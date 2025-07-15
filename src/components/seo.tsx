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
  const absoluteImageUrl = imageUrl
    ? `${globalThis.location.origin}${imageUrl}`
    : undefined

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {!!absoluteImageUrl && (
        <meta property="og:image" content={absoluteImageUrl} />
      )}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {!!absoluteImageUrl && (
        <meta name="twitter:image" content={absoluteImageUrl} />
      )}
    </Helmet>
  )
}
