import Context from '../Context'
import Device from '../Device'
import type Pickable from '../Pickable'
import Geometry from './Geometry'
import Vertex from './Vertex'

export default interface Container extends Pickable {
  geometries: Geometry[]
  picks: Geometry[]
  barycenter: Vertex

  draw(device: Device, context: Context): void
  pick(device: Device, context: Context): void
}
