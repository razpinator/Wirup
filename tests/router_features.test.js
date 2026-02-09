// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as router from '../src/router.js';
import * as network from '../src/network.js';
import * as utils from '../src/utils.js';

// Mock getElement since it's used in router
vi.mock('../src/utils.js', async () => {
    const actual = await vi.importActual('../src/utils.js');
    return {
        ...actual,
        getElement: vi.fn(),
    };
});

// Mock network
vi.mock('../src/network.js', () => ({
    wijax: vi.fn()
}));

describe('Router Features', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        
        // Setup initial mocks
        network.wijax.mockImplementation((type, url, contentType, callback) => {
            const data = JSON.stringify({ 
                views: [
                    { viewName: 'home', url: '/', viewFile: 'home.html' },
                    { viewName: 'user', url: '/user/:id', viewFile: 'user.html' }
                ] 
            });
            if (callback) {
                callback(data);
            }
            return Promise.resolve(data);
        });
        
        // Mock fetch for fillView
        global.fetch = vi.fn(() => Promise.resolve({
            ok: true,
            text: () => Promise.resolve('template content')
        }));
        
        // Mock getElement impl
        utils.getElement.mockReturnValue(document.createElement('div'));
    });

    it('should parse route parameters', async () => {
        await router.registerViews();
        
        // Manually set appLocation implies pushing state or we need to mock window.location
        // But getTemplate reads variable appLocation which is init to window.location.pathname
        // navigateTo updates it.
        
        await router.navigateTo('/user/123');
        
        const params = router.getRouteParams();
        expect(params).toEqual({ id: '123' });
    });

    it('should reset params on exact match', async () => {
        await router.registerViews();
        
        await router.navigateTo('/user/456');
        expect(router.getRouteParams()).toEqual({ id: '456' });
        
        await router.navigateTo('/');
        expect(router.getRouteParams()).toEqual({});
    });
});
