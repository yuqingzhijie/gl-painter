import FaceBuffer from './buffer/FaceBuffer'
import LineBuffer from './buffer/LineBuffer'
import PointBuffer from './buffer/PointBuffer'
import TextureBuffer from './buffer/TextureBuffer'
import Color from './Color'
import Context from './Context'
import type IndexBuffer from './IndexBuffer'
import type Texture from './Texture'
import type VertexBuffer from './VertexBuffer'

export default interface Device {
  createVertexBuffer(array: number[]): VertexBuffer
  createIndexBuffer(array: number[]): IndexBuffer

  createTextTexture(
    text: string,
    fontFamily: string,
    fontSize: number,
    textColor: Color,
    backgroundColor: Color,
  ): Texture
  createArrayTexture(
    pixels: ArrayBufferView,
    width: number,
    height: number,
  ): Texture
  createImageTexture(source: TexImageSource): Texture

  clearDepth(): void

  disableDepth(): void
  enableDepth(): void

  cullFrontFace(): void
  cullBackFace(): void
  disableCullFace(): void

  depthMask(flag: boolean): void

  beginDraw(): void
  endDraw(): void

  drawPoint(context: Context, buffer: PointBuffer, color: Color): void
  drawLine(
    context: Context,
    buffer: LineBuffer,
    color: Color,
    width?: number,
  ): void
  drawFace(
    context: Context,
    buffer: FaceBuffer,
    color: Color,
    texture?: TextureBuffer,
  ): void
  drawLine2D(context: Context, buffer: LineBuffer, color: Color): void
  drawFace2D(context: Context, buffer: FaceBuffer, color: Color): void

  beginPick(): void
  endPick(): void

  pickPoint(context: Context, buffer: PointBuffer, id: number): void
  pickLine(context: Context, buffer: LineBuffer, id: number): void
  pickFace(context: Context, buffer: FaceBuffer, id: number): void

  getPicked(x: number, y: number, w: number, h: number): number[]

  width(): number
  height(): number

  resize(width: number, height: number): void
}
