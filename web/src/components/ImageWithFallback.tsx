import React from 'react'
import { Image, ImageProps } from 'rebass'

interface Props {
  src: string
  fallback: string
  type?: string
}

const ImageWithFallback = ({ src, fallback, type = 'image/webp', ...delegated }: Props & ImageProps) => {
  return (
    <picture>
      <source srcSet={src} type={type} />
      <Image src={fallback} {...delegated} />
    </picture>
  )
}

export default ImageWithFallback
