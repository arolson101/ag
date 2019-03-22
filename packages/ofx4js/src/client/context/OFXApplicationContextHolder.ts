import { DefaultApplicationContext } from './DefaultApplicationContext'
import { OFXApplicationContext } from './OFXApplicationContext'

export class OFXApplicationContextHolder {
  private static CURRENT_CONTEXT: OFXApplicationContext = new DefaultApplicationContext(
    'Money',
    '1600'
  ) // some apps fail unless you're Quicken or Money...

  /**
   * Get the current (thread-safe) context.
   *
   * @return The thread-safe context.
   */
  static getCurrentContext(): OFXApplicationContext {
    // todo: implement a strategy (perhaps for thread-local access or something)?
    return this.CURRENT_CONTEXT
  }

  /**
   * Set the current context.
   *
   * @param context The context.
   */
  static setCurrentContext(context: OFXApplicationContext): void {
    this.CURRENT_CONTEXT = context
  }
}
