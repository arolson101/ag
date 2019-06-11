import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'settings' })
export class Setting {
  @PrimaryColumn() key!: string
  @Column() value!: string

  constructor(key: string, value: string) {
    this.key = key
    this.value = value
  }
}
