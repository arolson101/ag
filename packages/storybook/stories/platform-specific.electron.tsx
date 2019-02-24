import { AppContext } from '@ag/app'
import { ui } from '@ag/ui-blueprint'
import { storiesOf } from '@storybook/react'

const electronFetch: AppContext['fetch'] = fetch

export { electronFetch as fetch, ui, storiesOf }
