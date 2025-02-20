import Context from './Context'
import type Device from './Device'
import type Pickable from './Pickable'

export default interface Clickable extends Pickable {
  hover(device: Device, context: Context): void
  click(device: Device, context: Context): void
}
