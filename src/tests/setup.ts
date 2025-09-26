import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Global test setup
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
} as Storage

global.localStorage = localStorageMock
global.sessionStorage = localStorageMock

// Mock Web Workers
class MockWorker {
  constructor(stringUrl: string) {
    this.url = stringUrl
    this.onmessage = null
  }
  
  url: string
  onmessage: ((event: MessageEvent) => void) | null
  
  postMessage(msg: any) {
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({ data: { type: 'COMPLETE', data: { success: true } } } as MessageEvent)
      }
    }, 10)
  }
  
  terminate() {}
}

Object.defineProperty(window, 'Worker', {
  value: MockWorker,
  writable: true
})

// Mock Three.js
vi.mock('three', () => ({
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    domElement: document.createElement('canvas'),
  })),
  Scene: vi.fn(),
  PerspectiveCamera: vi.fn(),
  Mesh: vi.fn(),
  BoxGeometry: vi.fn(),
  SphereGeometry: vi.fn(),
  MeshBasicMaterial: vi.fn(),
  Vector3: vi.fn(() => ({
    x: 0, y: 0, z: 0,
    set: vi.fn(),
    add: vi.fn(),
    normalize: vi.fn(),
    length: vi.fn(() => 1),
  })),
  Color: vi.fn(),
}))

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
  },
  writable: true
})