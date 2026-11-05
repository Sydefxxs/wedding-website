import Image from 'next/image'
import type { Img } from '@/lib/types'
import { cn, objectPosition } from '@/lib/utils'

type Props = {
  image: Img
  sizes: string
  className?: string
  priority?: boolean
  /** fill the parent (parent must be positioned) instead of intrinsic size */
  fill?: boolean
  imgClassName?: string
}

// next/image doesn't add basePath to string srcs (needed for the GitHub Pages preview)
const withBase = (src: string) => (src.startsWith('/') ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${src}` : src)

/** Every photo on the site goes through here: blur-up, hotspot cropping, responsive sizes. */
export function Photo({ image, sizes, className, priority, fill = true, imgClassName }: Props) {
  const common = {
    src: withBase(image.src),
    alt: image.alt,
    sizes,
    priority,
    placeholder: image.blurDataURL ? ('blur' as const) : ('empty' as const),
    blurDataURL: image.blurDataURL,
    style: { objectPosition: objectPosition(image.hotspot) },
    'data-placeholder': image.placeholder ? 'true' : undefined,
  }
  if (fill) {
    return (
      <div className={cn('relative overflow-hidden bg-paper-2', className)}>
        <Image {...common} alt={image.alt} fill className={cn('object-cover', imgClassName)} />
      </div>
    )
  }
  return <Image {...common} alt={image.alt} width={image.width} height={image.height} className={cn('h-auto w-full', className, imgClassName)} />
}
