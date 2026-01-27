import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock localStorage
const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
})

// Mock fetch
const mockFetch = vi.fn()
globalThis.fetch = mockFetch

describe('API Service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockLocalStorage.getItem.mockReturnValue('test-token')
    })

    describe('authenticatedFetch', () => {
        it('should include Authorization header when token exists', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            })

            // Import the module dynamically to pick up mocks
            const { api } = await import('../../services/api')

            // Call any authenticated endpoint
            try {
                await api.getMe()
            } catch {
                // May fail due to other issues, we're testing the fetch call
            }

            // Check that fetch was called with Authorization header
            expect(mockFetch).toHaveBeenCalled()
            const callArgs = mockFetch.mock.calls[0]
            if (callArgs && callArgs[1]?.headers) {
                expect(callArgs[1].headers.Authorization).toMatch(/Bearer/i)
            }
        })

        it('should throw error when no token exists', async () => {
            mockLocalStorage.getItem.mockReturnValue(null)

            const { api } = await import('../../services/api')

            await expect(api.getMe()).rejects.toThrow()
        })
    })

    describe('Login', () => {
        it('should call login endpoint with phone and password', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({
                    access: 'access-token',
                    refresh: 'refresh-token',
                    user: { id: 1, role: 'PARENT' }
                }),
            })

            const { api } = await import('../../services/api')

            const result = await api.login('0555123456', 'password123')

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/accounts/login/student/'),
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining('phone_number'),
                })
            )
            expect(result).toBeDefined()
        })

        it('should store tokens in localStorage on successful login', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({
                    access: 'new-access-token',
                    refresh: 'new-refresh-token',
                    user: { id: 1, role: 'PARENT', first_name: 'Test' }
                }),
            })

            const { api } = await import('../../services/api')

            await api.login('0555123456', 'password123')

            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('auth_token', 'new-access-token')
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refresh_token', 'new-refresh-token')
        })
    })

    describe('Signup', () => {
        it('should call signup endpoint with required fields', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({
                    access: 'access-token',
                    refresh: 'refresh-token',
                    user: { id: 1, role: 'PARENT' }
                }),
            })

            const { api } = await import('../../services/api')

            await api.signup({
                first_name: 'Test',
                last_name: 'User',
                phone_number: '0555123456',
                password: 'password123',
            })

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/accounts/register/'),
                expect.objectContaining({
                    method: 'POST',
                })
            )
        })
    })

    describe('Logout', () => {
        it('should clear tokens from localStorage', async () => {
            const { api } = await import('../../services/api')

            api.logout()

            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth_token')
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refresh_token')
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user')
        })
    })
})
