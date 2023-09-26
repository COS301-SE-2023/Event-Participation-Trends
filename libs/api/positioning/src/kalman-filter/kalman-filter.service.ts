import { Injectable } from '@nestjs/common';
import { Matrix } from 'ts-matrix';

@Injectable()
export class KalmanFilter {
  dt: number;
  t: number;
  std_acc: number;
  u: Matrix;
  x: Matrix;
  H: Matrix;
  R: Matrix;
  P: Matrix;

  constructor(
    x: number,
    y: number,
    time: number,
    std_acc: number,
    x_std_meas: number,
    y_std_meas: number
  ) {
    this.t = time;
    this.dt = 0;

    this.std_acc = std_acc;

    this.u = new Matrix(2, 1, [[0], [0]]);

    this.x = new Matrix(6, 1, [[x], [y], [0], [0], [0], [0]]);

    this.H = new Matrix(2, 6, [
      [1, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0],
    ]);

    this.R = new Matrix(2, 2, [
      [x_std_meas ** 2, 0],
      [0, y_std_meas ** 2],
    ]);

    this.P = new Matrix(6, 6, [
      [1, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1],
    ]);
  }

  predict(): number[][] {
    const A = new Matrix(6, 6, [
      [1, 0, this.dt, 0, (1 / 2) * this.dt ** 2, 0],
      [0, 1, 0, this.dt, 0, (1 / 2) * this.dt ** 2],
      [0, 0, 1, 0, this.dt, 0],
      [0, 0, 0, 1, 0, this.dt],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1],
    ]);

    const B = new Matrix(6, 2, [
      [this.dt ** 2 / 2, 0],
      [0, this.dt ** 2 / 2],
      [this.dt, 0],
      [0, this.dt],
      [0, 0],
      [0, 0],
    ]);

    const Q = scalarMultiply(
      new Matrix(6, 6, [
        [this.dt ** 4 / 4, 0, this.dt ** 3 / 2, 0, this.dt ** 2 / 2, 0],
        [0, this.dt ** 4 / 4, 0, this.dt ** 3 / 2, 0, this.dt ** 2 / 2],
        [this.dt ** 3 / 2, 0, this.dt ** 2, 0, this.dt, 0],
        [0, this.dt ** 3 / 2, 0, this.dt ** 2, 0, this.dt],
        [this.dt ** 2, 0, this.dt, 0, 1 / 2, 0],
        [0, this.dt ** 2, 0, this.dt, 0, 1 / 2],
      ]),
      this.std_acc ** 2
    );

    this.x = add(A.multiply(this.x), B.multiply(this.u));

    this.P = add(A.multiply(this.P).multiply(A.transpose()), Q);

    return this.x.values.slice(0, 2);
  }

  update(z: Matrix, time: number): number[][] {
    this.dt = time - this.t;
    this.t = time;
    this.predict();

    const S = add(this.H.multiply(this.P.multiply(this.H.transpose())), this.R);

    const K = this.P.multiply(this.H.transpose()).multiply(S.inverse());

    this.x = round(
      add(this.x, K.multiply(subtract(z, this.H.multiply(this.x))))
    );

    const I = new Matrix(this.H.columns, this.H.columns).setAsIdentity();

    this.P = subtract(I, K.multiply(this.H)).multiply(this.P);

    return this.x.values.slice(0, 2);
  }
}

function add(a: Matrix, b: Matrix): Matrix {
  if (a.rows !== b.rows || a.columns !== b.columns) {
    throw new Error('Matrices are not the same size');
  }

  const result = [];

  for (let i = 0; i < a.rows; i++) {
    const row = [];

    for (let j = 0; j < a.columns; j++) {
      row.push(a.at(i, j) + b.at(i, j));
    }

    result.push(row);
  }

  return new Matrix(a.rows, a.columns, result);
}

function subtract(a: Matrix, b: Matrix): Matrix {
  if (a.rows !== b.rows || a.columns !== b.columns) {
    throw new Error('Matrices are not the same size');
  }

  const result = [];

  for (let i = 0; i < a.rows; i++) {
    const row = [];

    for (let j = 0; j < a.columns; j++) {
      row.push(a.at(i, j) - b.at(i, j));
    }

    result.push(row);
  }

  return new Matrix(a.rows, a.columns, result);
}

function scalarMultiply(a: Matrix, b: number): Matrix {
  const result = [];

  for (let i = 0; i < a.rows; i++) {
    const row = [];

    for (let j = 0; j < a.columns; j++) {
      row.push(a.at(i, j) * b);
    }

    result.push(row);
  }

  return new Matrix(a.rows, a.columns, result);
}

function round(a: Matrix): Matrix {
  const result = [];

  for (let i = 0; i < a.rows; i++) {
    const row = [];

    for (let j = 0; j < a.columns; j++) {
      row.push(Math.round(a.at(i, j) * 100) / 100);
    }

    result.push(row);
  }

  return new Matrix(a.rows, a.columns, result);
}
