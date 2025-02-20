import type Texture from '../Texture'
import type VertexBuffer from '../VertexBuffer'

export default class TextureBuffer {
  constructor(texture: Texture, coordinate: VertexBuffer) {
    this.texture = texture
    this.coordinate = coordinate
  }
  texture: Texture
  coordinate: VertexBuffer
}
