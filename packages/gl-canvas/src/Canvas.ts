import Context from './Context'
import type Device from './Device'
import type EventHandler from './event/EventHandler'
import ViewEventHandler from './event/ViewEventHandler'
import Container from './geom/Container'
import WebglDevice from './webgl/WebglDevice'

export default class Canvas {
  constructor(canvas: HTMLCanvasElement, customContent?: unknown) {
    this.customContent = customContent || null
    this.eventHandler = new ViewEventHandler(this)
    this.device = new WebglDevice(canvas, this.eventHandler)
    this.context = new Context(this.device)
  }

  draw(): void {
    if (this.customDraw) {
      this.customDraw()
    } else {
      this.device.beginDraw()
      this.root?.draw(this.device, this.context)
      this.device.endDraw()
    }
  }

  pick(): void {
    if (this.customPick) {
      this.customPick()
    } else {
      this.device.beginPick()
      this.root?.pick(this.device, this.context)
      this.picked = this.device.getPicked(
        0,
        0,
        this.device.width(),
        this.device.height(),
      )
      this.device.endPick()
    }
  }

  resize(width: number, height: number): void {
    this.device.resize(width, height)
    this.context.canvasSize = {
      width: width * window.devicePixelRatio,
      height: height * window.devicePixelRatio,
    }
    this.draw()
    this.pick()
  }

  getPicked(x: number, y: number, w: number, h: number): number[] {
    const set = new Set<number>()
    for (let i = 0; i < w; i++)
      for (let j = 0; j < h; j++)
        set.add(
          this.picked[
            (this.device.height() -
              Math.floor((y + j) * window.devicePixelRatio)) *
              this.device.width() +
              Math.floor((x + i) * window.devicePixelRatio)
          ],
        )
    return Array.from(set)
  }

  // setCustomContent(content: unknown): void {
  //   this.customContent = content
  // }

  setCustomDraw(drawFn: (() => void) | null): void {
    this.customDraw = drawFn
  }

  setCustomPick(pickFn: (() => void) | null): void {
    this.customPick = pickFn
  }

  root?: Container
  context: Context
  device: Device
  eventHandler: EventHandler
  // 要改成泛型吗
  customContent: unknown
  customDraw: (() => void) | null = null
  customPick: (() => void) | null = null

  picked: number[] = []
}
