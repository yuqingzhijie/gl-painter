import Context from './Context'
import type Device from './Device'

export default interface Drawable {
  draw(device: Device, context: Context): void
}
