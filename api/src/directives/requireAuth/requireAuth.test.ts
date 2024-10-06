import { mockRedwoodDirective, getDirectiveName } from '@redwoodjs/testing/api'

import requireAuth from './requireAuth'

describe('requireAuth directive', () => {
  it('declares the directive sdl as schema, with the correct name', () => {
    expect(requireAuth.schema).toBeTruthy()
    expect(getDirectiveName(requireAuth.schema)).toBe('requireAuth')
  })

  it('requireAuth has stub implementation. Should not throw when current user', () => {
    // Pass an authenticated user in the context
    const mockExecution = mockRedwoodDirective(requireAuth, {
      context: { currentUser: { id: 1, name: 'Lebron McGretzky' } },
    })

    expect(mockExecution).not.toThrowError()
  })
})
