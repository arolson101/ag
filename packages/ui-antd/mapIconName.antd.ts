import { IconName } from '@ag/core/context'

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
