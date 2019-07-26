import { useImage } from '@ag/core/components'
import { IconName, ImageId } from '@ag/core/context'
import * as Antd from 'antd'
import React from 'react'

type Props = React.ComponentProps<typeof Antd.Icon> & {
  id: ImageId | undefined
  header?: boolean
}

export const ImageSourceIcon: React.FC<Props> = ({ id, header, ...props }) => {
  const image = useImage(id)

  if (!image || !image.src) {
    return null
  }

  return (
    <Antd.Icon
      {...props}
      component={
        image
          ? () => (
              <Antd.Avatar
                size={header ? 'large' : 'small'}
                shape='square'
                style={{ borderRadius: 0 }}
                src={image.src}
              />
            )
          : undefined
      }
    />
  )
}
