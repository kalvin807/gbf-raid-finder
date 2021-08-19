import React from 'react'
import { Image, ImageProps } from 'rebass/styled-components'

interface Props {
  src: string
  fallback: string
  type?: string
  width: number
  height: number
}

const ImageWithFallback = ({ src, fallback, type = 'image/webp', width, height, ...delegated }: Props & ImageProps) => {
  return (
    <picture>
      <source srcSet={src} type={type} width={width} height={height} />
      <Image src={fallback} width={width} height={height} {...delegated} />
    </picture>
  )
}

export default ImageWithFallback
