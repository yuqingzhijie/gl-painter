import { describe, expect, test } from 'vitest'
import Vector from '../src/vector'

describe('Vector Class', () => {
  // 基础构造测试
  test('constructor initializes coordinates', () => {
    const v = new Vector(1, 2, 3)
    expect(v.x).toBe(1)
    expect(v.y).toBe(2)
    expect(v.z).toBe(3)
  })

  describe('Vector Operations', () => {
    const v1 = new Vector(1, 2, 3)
    const v2 = new Vector(4, 5, 6)

    test('dot product calculation', () => {
      expect(v1.dot(v2)).toBe(1 * 4 + 2 * 5 + 3 * 6) // 1*4 + 2*5 + 3*6 = 32
      expect(new Vector(0, 0, 0).dot(v1)).toBe(0)
    })

    test('cross product calculation', () => {
      const crossResult = v1.cross(v2)
      const expected = new Vector(-3, 6, -3)
      expect(crossResult.equals(expected)).toBe(true)
    })

    test('vector negation', () => {
      const negated = v1.negative()
      expect(negated.equals(new Vector(-1, -2, -3))).toBe(true)
    })

    test('vector addition', () => {
      const sum = v1.add(v2)
      expect(sum.equals(new Vector(5, 7, 9))).toBe(true)
    })

    test('vector subtraction', () => {
      const diff = v1.sub(v2)
      expect(diff.equals(new Vector(-3, -3, -3))).toBe(true)
    })

    test('scalar multiplication', () => {
      const scaled = v1.scale(2)
      expect(scaled.equals(new Vector(2, 4, 6))).toBe(true)
    })

    test('normalization', () => {
      const normalized = new Vector(3, 0, 0).normalize()
      expect(normalized.norm()).toBeCloseTo(1) // 模长应为1
      expect(() => new Vector(0, 0, 0).normalize()).toThrow() // 零向量应抛出异常
    })

    test('norm calculation', () => {
      expect(new Vector(3, 4, 0).norm()).toBe(5) // 3² + 4² = 5²
    })

    test('angle calculation', () => {
      const a = new Vector(1, 0, 0)
      const b = new Vector(0, 1, 0)
      expect(a.angle(b)).toBeCloseTo(Math.PI / 2)
      const c = new Vector(0, 0, 0)
      expect(() => a.angle(c)).toThrow()
    })
  })

  describe('get xyz()', () => {
    const v = new Vector(1, 2, 3)
    test('xyz property access', () => {
      expect(v.xyz).toEqual([1, 2, 3])
      expect(() => ((v.xyz as any) = [1, 2, 3])).toThrow() // 确保数组不可修改
    })
  })

  describe('fromArray()', () => {
    test('creates from valid array', () => {
      const arr = [4, 5, 6]
      const v = Vector.fromArray(arr)
      expect(v).toEqual(new Vector(4, 5, 6))
    })
  })

  describe('equals()', () => {
    const base = new Vector(2, 3, 4)

    test('returns true for identical vectors', () => {
      expect(base.equals(new Vector(2, 3, 4))).toBe(true)
    })

    test('returns false for different vectors', () => {
      expect(base.equals(new Vector(2.1, 3, 4))).toBe(false)
      expect(base.equals(new Vector(2, 3.1, 4))).toBe(false)
      expect(base.equals(new Vector(2, 3, 4.1))).toBe(false)
    })
  })

  test('toString() returns formatted string', () => {
    const v = new Vector(1.234, 5.678, 9.012)
    expect(v.toString()).toBe('Vector(1.234, 5.678, 9.012)')
  })

  test('static axis should be immutable', () => {
    expect(() => {
      Vector.X_AXIS.x = 5
    }).toThrow()
    expect(() => {
      Vector.Y_AXIS.y = 5
    }).toThrow()
    expect(() => {
      Vector.Z_AXIS.z = 5
    }).toThrow()
  })

  describe('Edge Cases', () => {
    const testCases = [
      { input: [0.0, 0.0, 0.0], expected: 'Vector(0, 0, 0)' },
      {
        input: [NaN, Infinity, -Infinity],
        expected: 'Vector(NaN, Infinity, -Infinity)',
      },
    ]

    testCases.forEach(({ input, expected }) => {
      test(`handles ${input} in toString`, () => {
        const v = new Vector(...input)
        expect(v.toString()).toBe(expected)
      })
    })
  })
})
