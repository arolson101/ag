import { IconName } from '@ag/core/context'

export const mapIconName = (icon: IconName | undefined): string => {
  if (!icon) {
    throw new Error('icon name must be specified')
  }

  // https://ionicons.com/
  switch (icon) {
    case 'url':
      return 'globe'

    case 'image':
      return 'photo'

    case 'library':
      return 'images'

    case 'trash':
      return 'trash'

    case 'edit':
      return 'create'

    case 'add':
    case 'refresh':
    case 'sync':
    default:
      return icon
  }
}
