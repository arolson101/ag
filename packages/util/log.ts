import createChannel from 'debug'

export const log = {
  nav: createChannel('app:nav'),
  info: createChannel('app:debug'),
  warning: createChannel('app:warning'),
  error: createChannel('app:error'),
}

createChannel.enable('app:*')
