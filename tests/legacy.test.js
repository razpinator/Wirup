import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const wirupPath = path.resolve(__dirname, '../Wirup.js');
const wirupCode = fs.readFileSync(wirupPath, 'utf-8');

describe('Wirup Legacy Tests', () => {
    let dom;
    let window;
    let document;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="contentBody"></div></body></html>', {
            url: "http://localhost/",
            runScripts: "dangerously",
            resources: "usable"
        });
        window = dom.window;
        document = window.document;

        // Mock localStorage - JSDOM has a basic implementation, but if we want to spy:
        // window.localStorage is read-only, so we mock the methods if needed, or just let it be.
        // For this test, we might not trigger localStorage usage immediately, but let's be safe.
        // If we really need to mock it:
        Object.defineProperty(window, 'localStorage', {
          value: {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
          },
          writable: true
        });
        
        // Mock XMLHttpRequest
        window.XMLHttpRequest = vi.fn(() => ({
            open: vi.fn(),
            setRequestHeader: vi.fn(),
            send: vi.fn(),
            onreadystatechange: null, // Will be set by code
            readyState: 4,
            status: 200,
            responseText: JSON.stringify({ views: [] })
        }));

        // Mock fetch
        window.fetch = vi.fn(() => Promise.resolve({
            ok: true,
            text: () => Promise.resolve('<div>View Content</div>')
        }));

        // Inject script
        const scriptEl = document.createElement('script');
        scriptEl.textContent = wirupCode;
        document.body.appendChild(scriptEl);
    });

    it('should define window.wu', () => {
        expect(window.wu).toBeDefined();
    });

    it('should have init method', () => {
        expect(typeof window.wu.init).toBe('function');
    });

    it('should have registerComponent method', () => {
        expect(typeof window.wu.registerComponent).toBe('function');
    });
});
