import { describe, it, expect, beforeEach } from 'vitest'
import { dot } from 'dothtml'

describe('DOThtml rendering', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'
  })

  it('renders a heading', () => {
    dot('#app').h1('Hello DOThtml!')
    const h1 = document.querySelector('h1')
    expect(h1).not.toBeNull()
    expect(h1?.textContent).toBe('Hello DOThtml!')
  })
})
