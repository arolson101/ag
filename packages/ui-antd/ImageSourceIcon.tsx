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

export const mapIconName = (icon?: IconName): string | undefined => {
  // https://beta.ant.design/components/icon/
  switch (icon) {
    case 'url':
      return 'global'

    case 'image':
      return 'picture'

    case 'library':
      return 'folder-open'

    case 'add':
      return 'file-add'

    case 'refresh':
      return 'reload'

    case 'trash':
      return 'delete'

    case 'edit':
    case 'sync':
    default:
      return icon
  }
}
