import type IndexBuffer from '../IndexBuffer'
import type VertexBuffer from '../VertexBuffer'
import { FaceBufferType } from './FaceBufferType'

export default class FaceBuffer {
  constructor(
    data: {
      vertexes: VertexBuffer
      normals: VertexBuffer
      indexes?: IndexBuffer
    },
    first: number,
    count: number,
    type = FaceBufferType.Strip, //todo => FaceBufferType.Default
  ) {
    this.vertexes = data.vertexes
    this.normals = data.normals
    this.indexes = data.indexes
    this.first = first
    this.count = count
    this.type = type
  }
  vertexes: VertexBuffer
  normals: VertexBuffer
  indexes?: IndexBuffer
  first: number
  count: number
  type: FaceBufferType
}
