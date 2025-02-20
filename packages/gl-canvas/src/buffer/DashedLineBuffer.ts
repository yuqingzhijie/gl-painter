import type VertexBuffer from '../VertexBuffer'
import LineBuffer from './LineBuffer'
import { LineBufferType } from './LineBufferType'

export default class DashedLineBuffer extends LineBuffer {
  constructor(
    vertexes: VertexBuffer,
    lengths: VertexBuffer,
    first: number,
    count: number,
    total: number,
    dashed: number,
    type = LineBufferType.Default,
  ) {
    super(vertexes, first, count, type)
    this.lengths = lengths
    this.total = total
    this.dashed = dashed
  }
  lengths: VertexBuffer
  total: number
  dashed: number
}
