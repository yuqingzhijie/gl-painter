import { Matrix, Vector } from '@painter/gl-math'
import {
  FRAME_INTERVAL_TIME,
  MouseButtonsEnum,
} from 'packages/gl-canvas/src/config'
import { debounce } from 'packages/gl-canvas/src/utils'
import Canvas from '../Canvas'
import Vertex from '../geom/Vertex'
import DummyEventHandler from './DummyEventHandler'
import type EventHandler from './EventHandler'

export default class ViewEventHandler extends DummyEventHandler {
  constructor(canvas: Canvas, next: EventHandler | null = null) {
    super(next)
    this.canvas = canvas
    this.debouncePick = debounce(this.canvas.pick, FRAME_INTERVAL_TIME).bind(
      this.canvas,
    )
  }

  onMouseMove(ev: MouseEvent): boolean {
    if (ev.buttons === MouseButtonsEnum.Left || this.mouseJustLeaving) {
      return true
    }

    let dx = ev.movementX
    let dy = ev.movementY
    if (this.x !== 0 || this.y !== 0) {
      dx = ev.offsetX * devicePixelRatio - this.x
      dy = ev.offsetY * devicePixelRatio - this.y
    }
    this.x = ev.offsetX * devicePixelRatio
    this.y = ev.offsetY * devicePixelRatio
    const device = this.canvas.device
    const context = this.canvas.context

    /**
     * 兼容组合鼠标按键
     * 左键：button: 0; buttons: 1;
     * 滚轮：button: 1; buttons: 4;
     * 右键：button: 2; buttons: 2;
     * 按下多个按键时，buttons返回初始值的和。
     */
    if ((ev.buttons === 2 || ev.buttons === 6) && this.buttonType !== 1) {
      let barycenter: Vertex = Vertex.ORIGIN
      if (this.canvas.root) {
        barycenter = this.canvas.root.barycenter
      }

      const translate = Matrix.IDENTITY.translate(
        Vertex.ORIGIN.to(
          barycenter.transform(
            context.modelMatrix.multiply(context.viewMatrix),
          ),
        ),
      )

      let rotateMatrix = Matrix.IDENTITY.rotate(
        Vector.X_AXIS,
        (dy / device.height()) * Math.PI * 2,
      ).rotate(Vector.Y_AXIS, (dx / device.width()) * Math.PI * 2)

      rotateMatrix = translate
        .multiply(rotateMatrix)
        .multiply(translate.inverse())
      context.viewMatrix = rotateMatrix.multiply(context.viewMatrix)
    } else if (
      (ev.buttons === 4 || ev.buttons === 6) &&
      this.buttonType !== 2
    ) {
      // const translateMatrix = Matrix.IDENTITY.translate(
      //     new Vector((2 * dx) / device.width(), (-2 * dy) / device.height(), 0)
      // );
      // context.setViewMatrix(
      //     context
      //         .getProjectionInverseMatrix()
      //         .multiply(translateMatrix)
      //         .multiply(context.getProjectMatrix())
      //         .multiply(context.viewMatrix)
      // );
      const orthoUnits = context.orthoUnits
      const translateMatrix1 = Matrix.IDENTITY.translate(
        new Vector(2 * dx * orthoUnits, -2 * dy * orthoUnits, 0),
      )
      context.viewMatrix = translateMatrix1.multiply(context.viewMatrix)
    } else {
      return super.onMouseMove(ev)
    }

    this.canvas.draw()

    return true
  }

  onMouseDown(ev: MouseEvent): boolean {
    this.buttonType = ev.button
    if ((ev.buttons !== 1 && ev.button === 0) || ev.buttons === 1)
      return super.onMouseDown(ev)

    return true
  }

  onMouseUp(ev: MouseEvent): boolean {
    if (
      ev.buttons === MouseButtonsEnum.NoClick ||
      ev.buttons === MouseButtonsEnum.Left
    ) {
      this.x = 0
      this.y = 0
    }
    this.buttonType = -1
    switch (ev.button) {
      case 1:
        this.canvas.pick()
        break
      case 2:
        this.canvas.pick()
        break
      default:
        return super.onMouseUp(ev)
    }

    return true
  }

  onMouseLeave(ev: MouseEvent): boolean {
    this.x = 0
    this.y = 0
    this.mouseJustLeaving = true
    setTimeout(() => {
      this.mouseJustLeaving = false
    }, FRAME_INTERVAL_TIME)
    this.buttonType = -1
    super.onMouseLeave(ev)
    return true
  }

  onWheel(ev: WheelEvent): boolean {
    const device = this.canvas.device
    const context = this.canvas.context
    // const cropSpaceX =
    //     ((Math.floor(ev.offsetX * window.devicePixelRatio) - device.width() / 2) / device.width()) * 2;
    // const cropSpaceY =
    //     ((Math.floor(ev.offsetY * window.devicePixelRatio) - device.height() / 2) / device.height()) * 2;
    // const oldProjectionInverseMatrix = context.getProjectionInverseMatrix();

    // context.setOrthoUnits(context.orthoUnits * (ev.deltaY < 0 ? 0.8 : 1.2), device.width(), device.height());

    // const newProjectionMatrix = context.getProjectMatrix();
    // const newCropSpaceCoordinate = new Vertex(cropSpaceX, cropSpaceY, 1).transform(
    //     newProjectionMatrix.multiply(oldProjectionInverseMatrix)
    // );
    // const dx = cropSpaceX - newCropSpaceCoordinate.x;
    // const dy = cropSpaceY - newCropSpaceCoordinate.y;
    // const translateMatrix = Matrix.IDENTITY.translate(new Vector(dx, -dy, 0));
    // context.setViewMatrix(
    //     context
    //         .getProjectionInverseMatrix()
    //         .multiply(translateMatrix)
    //         .multiply(context.getProjectMatrix())
    //         .multiply(context.viewMatrix)
    // );

    const orthoUnits = context.orthoUnits

    const scaleV = ev.deltaY < 0 ? 0.8 : 1.25
    context.orthoUnits = scaleV * orthoUnits

    const cropSpaceFn = (coordinate: number, attribute: number): number =>
      (Math.floor(coordinate * window.devicePixelRatio) * 2 - attribute) *
      orthoUnits
    const offset = (coordinate: number, attribute: number) =>
      cropSpaceFn(coordinate, attribute) * (scaleV - 1)

    context.viewMatrix = Matrix.IDENTITY.translate(
      new Vector(
        offset(ev.offsetX, device.width()),
        -offset(ev.offsetY, device.height()),
        0,
      ),
    ).multiply(context.viewMatrix)

    this.canvas.draw()
    this.debouncePick()
    return true
  }

  canvas: Canvas
  buttonType!: number
  private x = 0
  private y = 0
  // move节流，leave没，可能导致leave后继续触发move，加个mouseJustLeaving做判断
  private mouseJustLeaving = false
  private debouncePick: typeof this.canvas.pick
}
