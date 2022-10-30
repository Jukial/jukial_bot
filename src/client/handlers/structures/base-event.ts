import { BaseEventData } from '@/utils/types'

abstract class BaseEvent {
  private _name: string
  private _once?: boolean

  public get name(): string {
    return this._name
  }

  public get once(): boolean | undefined {
    return this._once
  }

  constructor(data: BaseEventData) {
    this._name = data.name
    this._once = data.once
  }

  abstract run(...args: any[]): any | Promise<any>
}

export default BaseEvent
