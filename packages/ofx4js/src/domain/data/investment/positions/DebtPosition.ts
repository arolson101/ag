import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { BasePosition } from './BasePosition'

/**
 * Represents a debt position.
 * @see "Section 13.9.2.6.1, OFX Spec"
 */
export class DebtPosition extends BasePosition {}

Aggregate_add(DebtPosition, 'POSDEBT')
