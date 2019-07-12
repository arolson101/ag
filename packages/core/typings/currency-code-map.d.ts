declare module 'currency-code-map' {
  export type CountryCode = 'US' | 'GB' | 'ES' | 'FR' // ...
  export type CurrencyCode = 'EUR' | 'USD' | 'GBP' // ...

  const mapping: Record<CountryCode, CurrencyCode>
  export default mapping
}
