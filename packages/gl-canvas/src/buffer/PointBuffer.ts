import type VertexBuffer from '../VertexBuffer'

export default class PointBuffer {
  constructor(vertexes: VertexBuffer, first: number, count: number) {
    this.vertexes = vertexes
    this.first = first
    this.count = count
  }
  vertexes: VertexBuffer
  first: number
  count: number
}
