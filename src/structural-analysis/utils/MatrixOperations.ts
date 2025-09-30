/**
 * Matrix Operations Utility
 * Implementasi operasi matrix untuk analisis struktur
 */

export class Matrix {
  private data: number[][];
  public rows: number;
  public cols: number;

  constructor(rows: number, cols: number, data?: number[][]) {
    this.rows = rows;
    this.cols = cols;
    
    if (data) {
      this.data = data.map(row => [...row]);
    } else {
      this.data = Array(rows).fill(0).map(() => Array(cols).fill(0));
    }
  }

  // ==================== BASIC OPERATIONS ====================
  
  get(row: number, col: number): number {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error(`Index out of bounds: (${row}, ${col})`);
    }
    return this.data[row][col];
  }

  set(row: number, col: number, value: number): void {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error(`Index out of bounds: (${row}, ${col})`);
    }
    this.data[row][col] = value;
  }

  clone(): Matrix {
    return new Matrix(this.rows, this.cols, this.data);
  }

  // ==================== MATRIX ARITHMETIC ====================

  add(other: Matrix): Matrix {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw new Error('Matrix dimensions must match for addition');
    }

    const result = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(i, j, this.get(i, j) + other.get(i, j));
      }
    }
    return result;
  }

  subtract(other: Matrix): Matrix {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw new Error('Matrix dimensions must match for subtraction');
    }

    const result = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(i, j, this.get(i, j) - other.get(i, j));
      }
    }
    return result;
  }

  multiply(other: Matrix): Matrix {
    if (this.cols !== other.rows) {
      throw new Error('Invalid matrix dimensions for multiplication');
    }

    const result = new Matrix(this.rows, other.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < other.cols; j++) {
        let sum = 0;
        for (let k = 0; k < this.cols; k++) {
          sum += this.get(i, k) * other.get(k, j);
        }
        result.set(i, j, sum);
      }
    }
    return result;
  }

  multiplyScalar(scalar: number): Matrix {
    const result = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(i, j, this.get(i, j) * scalar);
      }
    }
    return result;
  }

  // ==================== MATRIX PROPERTIES ====================

  transpose(): Matrix {
    const result = new Matrix(this.cols, this.rows);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(j, i, this.get(i, j));
      }
    }
    return result;
  }

  determinant(): number {
    if (this.rows !== this.cols) {
      throw new Error('Determinant is only defined for square matrices');
    }

    if (this.rows === 1) {
      return this.get(0, 0);
    }

    if (this.rows === 2) {
      return this.get(0, 0) * this.get(1, 1) - this.get(0, 1) * this.get(1, 0);
    }

    // For larger matrices, use LU decomposition
    const lu = this.luDecomposition();
    let det = lu.determinantSign;
    for (let i = 0; i < this.rows; i++) {
      det *= lu.L.get(i, i) * lu.U.get(i, i);
    }
    return det;
  }

  norm(): number {
    let sum = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        sum += this.get(i, j) * this.get(i, j);
      }
    }
    return Math.sqrt(sum);
  }

  // ==================== LINEAR ALGEBRA ====================

  luDecomposition(): { L: Matrix, U: Matrix, P: Matrix, determinantSign: number } {
    if (this.rows !== this.cols) {
      throw new Error('LU decomposition requires square matrix');
    }

    const n = this.rows;
    const L = new Matrix(n, n);
    const U = this.clone();
    const P = Matrix.identity(n);
    let determinantSign = 1;

    // Initialize L as identity
    for (let i = 0; i < n; i++) {
      L.set(i, i, 1);
    }

    for (let k = 0; k < n - 1; k++) {
      // Partial pivoting
      let maxRow = k;
      for (let i = k + 1; i < n; i++) {
        if (Math.abs(U.get(i, k)) > Math.abs(U.get(maxRow, k))) {
          maxRow = i;
        }
      }

      if (maxRow !== k) {
        U.swapRows(k, maxRow);
        P.swapRows(k, maxRow);
        if (k > 0) L.swapRows(k, maxRow);
        determinantSign *= -1;
      }

      // Elimination
      for (let i = k + 1; i < n; i++) {
        const factor = U.get(i, k) / U.get(k, k);
        L.set(i, k, factor);
        
        for (let j = k; j < n; j++) {
          U.set(i, j, U.get(i, j) - factor * U.get(k, j));
        }
      }
    }

    return { L, U, P, determinantSign };
  }

  solve(b: Matrix): Matrix {
    if (this.rows !== this.cols) {
      throw new Error('System matrix must be square');
    }
    if (b.rows !== this.rows || b.cols !== 1) {
      throw new Error('Right-hand side vector has incorrect dimensions');
    }

    const { L, U, P } = this.luDecomposition();
    
    // Solve Pb = Ly
    const Pb = P.multiply(b);
    const y = Matrix.forwardSubstitution(L, Pb);
    
    // Solve Ux = y
    const x = Matrix.backwardSubstitution(U, y);
    
    return x;
  }

  inverse(): Matrix {
    if (this.rows !== this.cols) {
      throw new Error('Inverse is only defined for square matrices');
    }

    const n = this.rows;
    const identity = Matrix.identity(n); 
    const result = new Matrix(n, n);

    for (let i = 0; i < n; i++) {
      const ei = new Matrix(n, 1);
      ei.set(i, 0, 1);
      const xi = this.solve(ei);
      
      for (let j = 0; j < n; j++) {
        result.set(j, i, xi.get(j, 0));
      }
    }

    return result;
  }

  // ==================== UTILITY METHODS ====================

  private swapRows(row1: number, row2: number): void {
    const temp = this.data[row1];
    this.data[row1] = this.data[row2];
    this.data[row2] = temp;
  }

  static identity(size: number): Matrix {
    const matrix = new Matrix(size, size);
    for (let i = 0; i < size; i++) {
      matrix.set(i, i, 1);
    }
    return matrix;
  }

  static zeros(rows: number, cols: number): Matrix {
    return new Matrix(rows, cols);
  }

  static ones(rows: number, cols: number): Matrix {
    const matrix = new Matrix(rows, cols);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        matrix.set(i, j, 1);
      }
    }
    return matrix;
  }

  static forwardSubstitution(L: Matrix, b: Matrix): Matrix {
    const n = L.rows;
    const x = new Matrix(n, 1);

    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += L.get(i, j) * x.get(j, 0);
      }
      x.set(i, 0, (b.get(i, 0) - sum) / L.get(i, i));
    }

    return x;
  }

  static backwardSubstitution(U: Matrix, b: Matrix): Matrix {
    const n = U.rows;
    const x = new Matrix(n, 1);

    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += U.get(i, j) * x.get(j, 0);
      }
      x.set(i, 0, (b.get(i, 0) - sum) / U.get(i, i));
    }

    return x;
  }

  // ==================== DISPLAY ====================

  toString(): string {
    let result = '';
    for (let i = 0; i < this.rows; i++) {
      result += '[';
      for (let j = 0; j < this.cols; j++) {
        result += this.get(i, j).toFixed(4);
        if (j < this.cols - 1) result += ', ';
      }
      result += ']\n';
    }
    return result;
  }

  toArray(): number[][] {
    return this.data.map(row => [...row]);
  }
}