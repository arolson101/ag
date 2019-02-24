import { AppContext } from '@ag/core'
import { ui } from '@ag/ui-blueprint'
import { storiesOf } from '@storybook/react'

const electronFetch: AppContext['fetch'] = fetch

export { electronFetch as fetch, ui, storiesOf }
