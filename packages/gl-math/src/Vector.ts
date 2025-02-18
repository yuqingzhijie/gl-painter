export default class Vector {
  constructor(x = 0.0, y = 0.0, z = 0.0) {
    this.x = x
    this.y = y
    this.z = z
  }

  dot(v: Vector): number {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }

  cross(v: Vector): Vector {
    const r: Vector = new Vector()

    r.x = this.y * v.z - v.y * this.z
    r.y = this.z * v.x - v.z * this.x
    r.z = this.x * v.y - v.x * this.y

    return r
  }

  negative(): Vector {
    const r: Vector = new Vector()

    r.x = -this.x
    r.y = -this.y
    r.z = -this.z

    return r
  }

  add(v: Vector): Vector {
    const r: Vector = new Vector()

    r.x = v.x + this.x
    r.y = v.y + this.y
    r.z = v.z + this.z

    return r
  }

  sub(v: Vector): Vector {
    const r: Vector = new Vector()

    r.x = this.x - v.x
    r.y = this.y - v.y
    r.z = this.z - v.z

    return r
  }

  scale(n: number): Vector {
    const r: Vector = new Vector()

    r.x = n * this.x
    r.y = n * this.y
    r.z = n * this.z

    return r
  }

  normalize(): Vector {
    const norm: number = this.norm()
    if (norm === 0) {
      throw new Error('零向量不可归一化')
    }

    const r: Vector = new Vector()

    r.x = this.x / norm
    r.y = this.y / norm
    r.z = this.z / norm

    return r
  }

  norm(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  angle(v: Vector): number {
    const modA = this.norm()
    const modB = v.norm()

    if (modA === 0 || modB === 0) {
      throw new Error('零向量无法与其他向量成角度')
    }

    const dotProduct = this.dot(v)
    const cos = dotProduct / (modA * modB)
    const angle = Math.acos(cos)
    return angle
  }

  toString(): string {
    return `Vector(${this.x}, ${this.y}, ${this.z})`
  }

  equals(v: Vector, epsilon = Number.EPSILON): boolean {
    return (
      Math.abs(this.x - v.x) < epsilon &&
      Math.abs(this.y - v.y) < epsilon &&
      Math.abs(this.z - v.z) < epsilon
    )
  }

  get xyz(): [number, number, number] {
    return [this.x, this.y, this.z]
  }

  x: number
  y: number
  z: number

  static fromArray(arr: number[]): Vector {
    return new Vector(arr[0] || 0.0, arr[1] || 0.0, arr[2] || 0.0)
  }

  static readonly X_AXIS: Vector = Object.freeze(new Vector(1.0, 0.0, 0.0))
  static readonly Y_AXIS: Vector = Object.freeze(new Vector(0.0, 1.0, 0.0))
  static readonly Z_AXIS: Vector = Object.freeze(new Vector(0.0, 0.0, 1.0))
}
