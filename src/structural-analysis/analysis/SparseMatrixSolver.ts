/**
 * Sparse Matrix Solver for Structural Analysis
 * Optimized for large structural systems with memory efficiency
 */

export interface SparseMatrix {
  rows: number;
  cols: number;
  data: Map<string, number>; // key: "row,col", value: matrix value
}

export interface SparseVector {
  size: number;
  data: Map<number, number>; // key: index, value: vector value
}

/**
 * Create a sparse matrix
 */
export const createSparseMatrix = (rows: number, cols: number): SparseMatrix => {
  return {
    rows,
    cols,
    data: new Map()
  };
};

/**
 * Create a sparse vector
 */
export const createSparseVector = (size: number): SparseVector => {
  return {
    size,
    data: new Map()
  };
};

/**
 * Set value in sparse matrix
 */
export const setSparseMatrixValue = (matrix: SparseMatrix, row: number, col: number, value: number): void => {
  if (Math.abs(value) > 1e-12) { // Only store non-zero values
    matrix.data.set(`${row},${col}`, value);
  } else {
    matrix.data.delete(`${row},${col}`);
  }
};

/**
 * Get value from sparse matrix
 */
export const getSparseMatrixValue = (matrix: SparseMatrix, row: number, col: number): number => {
  return matrix.data.get(`${row},${col}`) || 0;
};

/**
 * Add value to sparse matrix
 */
export const addSparseMatrixValue = (matrix: SparseMatrix, row: number, col: number, value: number): void => {
  const currentValue = getSparseMatrixValue(matrix, row, col);
  setSparseMatrixValue(matrix, row, col, currentValue + value);
};

/**
 * Set value in sparse vector
 */
export const setSparseVectorValue = (vector: SparseVector, index: number, value: number): void => {
  if (Math.abs(value) > 1e-12) {
    vector.data.set(index, value);
  } else {
    vector.data.delete(index);
  }
};

/**
 * Get value from sparse vector
 */
export const getSparseVectorValue = (vector: SparseVector, index: number): number => {
  return vector.data.get(index) || 0;
};

/**
 * Add value to sparse vector
 */
export const addSparseVectorValue = (vector: SparseVector, index: number, value: number): void => {
  const currentValue = getSparseVectorValue(vector, index);
  setSparseVectorValue(vector, index, currentValue + value);
};

/**
 * Convert dense matrix to sparse matrix
 */
export const denseToSparse = (denseMatrix: number[][]): SparseMatrix => {
  const rows = denseMatrix.length;
  const cols = denseMatrix[0]?.length || 0;
  const sparse = createSparseMatrix(rows, cols);
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (Math.abs(denseMatrix[i][j]) > 1e-12) {
        setSparseMatrixValue(sparse, i, j, denseMatrix[i][j]);
      }
    }
  }
  
  return sparse;
};

/**
 * Convert sparse matrix to dense matrix
 */
export const sparseToDense = (sparseMatrix: SparseMatrix): number[][] => {
  const dense = Array(sparseMatrix.rows).fill(0).map(() => Array(sparseMatrix.cols).fill(0));
  
  for (const [key, value] of sparseMatrix.data) {
    const [row, col] = key.split(',').map(Number);
    dense[row][col] = value;
  }
  
  return dense;
};

/**
 * Convert dense vector to sparse vector
 */
export const denseVectorToSparse = (denseVector: number[]): SparseVector => {
  const sparse = createSparseVector(denseVector.length);
  
  for (let i = 0; i < denseVector.length; i++) {
    if (Math.abs(denseVector[i]) > 1e-12) {
      setSparseVectorValue(sparse, i, denseVector[i]);
    }
  }
  
  return sparse;
};

/**
 * Convert sparse vector to dense vector
 */
export const sparseVectorToDense = (sparseVector: SparseVector): number[] => {
  const dense = Array(sparseVector.size).fill(0);
  
  for (const [index, value] of sparseVector.data) {
    dense[index] = value;
  }
  
  return dense;
};

/**
 * Conjugate Gradient solver for sparse symmetric positive definite systems
 * Optimized for structural analysis problems
 */
export const solveConjugateGradient = (
  A: SparseMatrix,
  b: SparseVector,
  x0?: SparseVector,
  tolerance: number = 1e-10,
  maxIterations?: number
): { solution: SparseVector; iterations: number; residual: number } => {
  const n = A.rows;
  maxIterations = maxIterations || Math.min(n, 1000);
  
  // Initialize solution vector
  let x = x0 || createSparseVector(n);
  
  // r = b - A*x
  let r = sparseMatrixVectorMultiply(A, x);
  r = sparseVectorSubtract(b, r);
  
  // p = r
  let p = sparseVectorCopy(r);
  
  let rsold = sparseVectorDot(r, r);
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Ap = A*p
    const Ap = sparseMatrixVectorMultiply(A, p);
    
    // alpha = rsold / (p'*Ap)
    const pAp = sparseVectorDot(p, Ap);
    if (Math.abs(pAp) < 1e-14) break;
    
    const alpha = rsold / pAp;
    
    // x = x + alpha*p
    const alphap = sparseVectorScale(p, alpha);
    x = sparseVectorAdd(x, alphap);
    
    // r = r - alpha*Ap
    const alphaAp = sparseVectorScale(Ap, alpha);
    r = sparseVectorSubtract(r, alphaAp);
    
    const rsnew = sparseVectorDot(r, r);
    const residual = Math.sqrt(rsnew);
    
    if (residual < tolerance) {
      return { solution: x, iterations: iteration + 1, residual };
    }
    
    // beta = rsnew / rsold
    const beta = rsnew / rsold;
    
    // p = r + beta*p
    const betap = sparseVectorScale(p, beta);
    p = sparseVectorAdd(r, betap);
    
    rsold = rsnew;
  }
  
  return { solution: x, iterations: maxIterations, residual: Math.sqrt(rsold) };
};

/**
 * Sparse matrix-vector multiplication
 */
export const sparseMatrixVectorMultiply = (A: SparseMatrix, x: SparseVector): SparseVector => {
  const result = createSparseVector(A.rows);
  
  for (const [key, aValue] of A.data) {
    const [row, col] = key.split(',').map(Number);
    const xValue = getSparseVectorValue(x, col);
    
    if (Math.abs(xValue) > 1e-12) {
      addSparseVectorValue(result, row, aValue * xValue);
    }
  }
  
  return result;
};

/**
 * Sparse vector addition
 */
export const sparseVectorAdd = (a: SparseVector, b: SparseVector): SparseVector => {
  const result = createSparseVector(Math.max(a.size, b.size));
  
  // Add values from vector a
  for (const [index, value] of a.data) {
    setSparseVectorValue(result, index, value);
  }
  
  // Add values from vector b
  for (const [index, value] of b.data) {
    addSparseVectorValue(result, index, value);
  }
  
  return result;
};

/**
 * Sparse vector subtraction
 */
export const sparseVectorSubtract = (a: SparseVector, b: SparseVector): SparseVector => {
  const result = createSparseVector(Math.max(a.size, b.size));
  
  // Add values from vector a
  for (const [index, value] of a.data) {
    setSparseVectorValue(result, index, value);
  }
  
  // Subtract values from vector b
  for (const [index, value] of b.data) {
    addSparseVectorValue(result, index, -value);
  }
  
  return result;
};

/**
 * Sparse vector scaling
 */
export const sparseVectorScale = (vector: SparseVector, scalar: number): SparseVector => {
  const result = createSparseVector(vector.size);
  
  for (const [index, value] of vector.data) {
    setSparseVectorValue(result, index, value * scalar);
  }
  
  return result;
};

/**
 * Sparse vector dot product
 */
export const sparseVectorDot = (a: SparseVector, b: SparseVector): number => {
  let dot = 0;
  
  // Iterate through the smaller vector for efficiency
  const [smaller, larger] = a.data.size <= b.data.size ? [a, b] : [b, a];
  
  for (const [index, value] of smaller.data) {
    const otherValue = getSparseVectorValue(larger, index);
    dot += value * otherValue;
  }
  
  return dot;
};

/**
 * Copy sparse vector
 */
export const sparseVectorCopy = (vector: SparseVector): SparseVector => {
  const copy = createSparseVector(vector.size);
  
  for (const [index, value] of vector.data) {
    setSparseVectorValue(copy, index, value);
  }
  
  return copy;
};

/**
 * LU decomposition for sparse matrices using compressed storage
 */
export const sparseLUDecomposition = (A: SparseMatrix): { L: SparseMatrix; U: SparseMatrix; success: boolean } => {
  const n = A.rows;
  const L = createSparseMatrix(n, n);
  const U = createSparseMatrix(n, n);
  
  try {
    // Initialize L diagonal to 1
    for (let i = 0; i < n; i++) {
      setSparseMatrixValue(L, i, i, 1);
    }
    
    // Perform LU decomposition
    for (let i = 0; i < n; i++) {
      // Upper triangular matrix U
      for (let k = i; k < n; k++) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
          sum += getSparseMatrixValue(L, i, j) * getSparseMatrixValue(U, j, k);
        }
        const uValue = getSparseMatrixValue(A, i, k) - sum;
        setSparseMatrixValue(U, i, k, uValue);
      }
      
      // Lower triangular matrix L
      for (let k = i + 1; k < n; k++) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
          sum += getSparseMatrixValue(L, k, j) * getSparseMatrixValue(U, j, i);
        }
        const uii = getSparseMatrixValue(U, i, i);
        if (Math.abs(uii) < 1e-12) {
          return { L, U, success: false }; // Singular matrix
        }
        const lValue = (getSparseMatrixValue(A, k, i) - sum) / uii;
        setSparseMatrixValue(L, k, i, lValue);
      }
    }
    
    return { L, U, success: true };
  } catch (error) {
    console.error('LU decomposition failed:', error);
    return { L, U, success: false };
  }
};

/**
 * Solve sparse linear system using LU decomposition
 */
export const solveLU = (
  L: SparseMatrix,
  U: SparseMatrix,
  b: SparseVector
): { solution: SparseVector; success: boolean } => {
  const n = L.rows;
  
  try {
    // Forward substitution: Ly = b
    const y = createSparseVector(n);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += getSparseMatrixValue(L, i, j) * getSparseVectorValue(y, j);
      }
      const yValue = getSparseVectorValue(b, i) - sum;
      setSparseVectorValue(y, i, yValue);
    }
    
    // Backward substitution: Ux = y
    const x = createSparseVector(n);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += getSparseMatrixValue(U, i, j) * getSparseVectorValue(x, j);
      }
      const uii = getSparseMatrixValue(U, i, i);
      if (Math.abs(uii) < 1e-12) {
        return { solution: x, success: false }; // Singular matrix
      }
      const xValue = (getSparseVectorValue(y, i) - sum) / uii;
      setSparseVectorValue(x, i, xValue);
    }
    
    return { solution: x, success: true };
  } catch (error) {
    console.error('LU solve failed:', error);
    return { solution: createSparseVector(n), success: false };
  }
};

/**
 * Memory usage estimation for sparse matrices
 */
export const estimateMemoryUsage = (matrix: SparseMatrix): { bytes: number; compressionRatio: number } => {
  const nonZeroEntries = matrix.data.size;
  const totalEntries = matrix.rows * matrix.cols;
  
  // Estimate memory usage
  const sparseBytes = nonZeroEntries * (8 + 8 + 8); // key string + value + map overhead
  const denseBytes = totalEntries * 8; // 8 bytes per number
  
  const compressionRatio = denseBytes / sparseBytes;
  
  return { bytes: sparseBytes, compressionRatio };
};

/**
 * Performance profiler for sparse operations
 */
export class SparseMatrixProfiler {
  private operations: Map<string, { count: number; totalTime: number }> = new Map();
  
  time<T>(operationName: string, operation: () => T): T {
    const start = performance.now();
    const result = operation();
    const end = performance.now();
    
    const existing = this.operations.get(operationName) || { count: 0, totalTime: 0 };
    this.operations.set(operationName, {
      count: existing.count + 1,
      totalTime: existing.totalTime + (end - start)
    });
    
    return result;
  }
  
  getReport(): string {
    let report = 'Sparse Matrix Performance Report:\n';
    report += '================================\n';
    
    for (const [operation, stats] of this.operations) {
      const avgTime = stats.totalTime / stats.count;
      report += `${operation}: ${stats.count} calls, avg: ${avgTime.toFixed(3)}ms, total: ${stats.totalTime.toFixed(3)}ms\n`;
    }
    
    return report;
  }
  
  reset(): void {
    this.operations.clear();
  }
}

export const globalProfiler = new SparseMatrixProfiler();