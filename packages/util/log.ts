import createChannel = require('debug')

export const log = {
  info: createChannel('app:debug'),
  warning: createChannel('app:warning'),
  error: createChannel('app:error'),
}
