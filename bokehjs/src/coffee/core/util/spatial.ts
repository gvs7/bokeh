/// <reference types="@types/rbush" />
import * as flatbush from "flatbush"

export type Rect = {minX: number, minY: number, maxX: number, maxY: number}

export abstract class SpatialIndex {
  abstract indices(rect: Rect): number[]
}

export class FlatBush extends SpatialIndex {
  private readonly index: any

  constructor(points: (Rect & {i: number})[]) {
    super()
    this.index = flatbush(points.length);

    for (const p of points) {
      this.index.add(p.minX, p.minY, p.maxX, p.maxY);
    }
    this.index.finish();
  }

  get bbox(): Rect {
    return {
      minX: this.index._minX,
      minY: this.index._minY,
      maxX: this.index._maxX,
      maxY: this.index._maxY
    }
  }

  search(rect: Rect): (Rect & {i: number})[] {
    const indices = this.indices(rect);
    const rects = new Array<(Rect & {i: number})>();
    for (const i of indices) {
      const data = this.index.data.slice(i*5, i*5+5);
      rects.push({minX: data[1], minY: data[2], maxX: data[3], maxY: data[4], i});
    }
    return rects;
  }

  indices(rect: Rect): number[] {
    return this.index.search(rect.minX, rect.minY, rect.maxX, rect.maxY);
  }
}
