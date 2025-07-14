import { cn } from '@/lib/format'

export interface BannerProps {
  img: string
  name: string
  imgClassName?: string
}

export function Banner(props: BannerProps): React.JSX.Element {
  return (
    <div className="relative">
      <img
        src={props.img}
        alt={props.name}
        className={cn(
          'h-60 w-full object-cover sm:h-96 sm:max-h-80',
          props.imgClassName
        )}
      />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  )
}
