export namespace Geometry {
  export interface Point2D {
    x: number;
    y: number;
  }
  export interface Point3D extends Point2D {
    z: number;
  }
}