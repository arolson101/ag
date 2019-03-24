import { ApplicationSecurity } from './ApplicationSecurity'
import { SynchronizationCapability } from './profile/SynchronizationCapability'

// import java.net.URL;

export interface MessageSetProfile {
  /**
   * Version of the message set.
   *
   * @return The version of the message set.
   */
  getVersion(): string | null

  /**
   * The name of the service provider (sometimes the message set processing is outsourced).
   *
   * @return The name of the service provider (sometimes the message set processing is outsourced).
   */
  getServiceProviderName(): string | null

  /**
   * The URL at which the message set is processed.
   *
   * @return The URL at which the message set is processed.
   */
  getUrl(): string | null

  /**
   * The application-level security required for this message set.
   *
   * @return The application-level security required for this message set.
   */
  getSecurity(): ApplicationSecurity | null

  /**
   * Whether transport-level security is required for this message set.
   *
   * @return Whether transport-level security is required for this message set.
   */
  isSslRequired(): boolean

  /**
   * The sign-on realm.
   *
   * @return The sign-on realm.
   */
  getRealm(): string | null

  /**
   * The language.
   *
   * @return The language.
   * @see java.util.Locale#getISO3Language()
   */
  getLanguage(): string | null

  /**
   * The synchronization capability for this message set.
   *
   * @return The synchronization capability for this message set.
   */
  getSyncCapability(): SynchronizationCapability | null

  /**
   * Whether there exists support for resposne-file based error recovery.
   *
   * @return Whether there exists support for resposne-file based error recovery.
   */
  hasFileBasedErrorRecoverySupport(): boolean
}
