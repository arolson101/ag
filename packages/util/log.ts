import createChannel from 'debug'

export const log = {
  nav: createChannel('app:nav'),
  db: createChannel('app:debug'),
}

createChannel.enable('app:*')
