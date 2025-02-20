import Context from './Context'
import type Device from './Device'
import type EventHandler from './event/EventHandler'
import ViewEventHandler from './event/ViewEventHandler'
import Container from './geom/Container'
import WebglDevice from './webgl/WebglDevice'

export default class Canvas {
  constructor(canvas: HTMLCanvasElement, handler: EventHandler | null = null) {
    this.eventHandler = new ViewEventHandler(this)
    this.eventHandler.next = handler

    this.device = new WebglDevice(canvas, this.eventHandler)
    this.context = new Context(this.device)
  }

  draw(): void {
    this.device.beginDraw()
    this.root?.draw(this.device, this.context)
    this.device.endDraw()
  }

  pick(): void {
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

  root?: Container
  context: Context
  device: Device
  eventHandler: EventHandler

  picked: number[] = []
}
