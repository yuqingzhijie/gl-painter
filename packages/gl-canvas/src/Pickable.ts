import Context from './Context'
import type Device from './Device'
import type Drawable from './Drawable'

export default interface Pickable extends Drawable {
  pick(device: Device, context: Context): void
}
