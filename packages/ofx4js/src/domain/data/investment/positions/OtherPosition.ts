import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { BasePosition } from './BasePosition'

/**
 * Represents other types of positions.
 * @see "Section 13.9.2.6.1, OFX Spec"
 */
export class OtherPosition extends BasePosition {}

Aggregate_add(OtherPosition, 'POSOTHER')
