// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import Wirup from '../src/index.js';
import * as data from '../src/data.js';

describe('Wirup New Features', () => {

    beforeEach(() => {
        document.body.innerHTML = '<div id="contentBody"></div>';
        // Reset data store if possible or just use unique keys
        // We can't easily reset dataStore module state without re-importing or having a reset method.
        // We will use unique keys for data tests.
    });

    describe('Security: XSS Prevention', () => {
        it('should sanitize string data in components', () => {
            const maliciousCode = '<script>alert("xss")</script>';
            Wirup.registerComponent('xssComp', (item) => `<div>${item}</div>`);
            Wirup.registerData('xssData', maliciousCode);
            
            const output = Wirup.buildComponent('xssComp', 'xssData');
            // Expected escaped output
            expect(output).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
            expect(output).not.toContain('<script>');
        });

        it('should sanitize nested object data', () => {
            const maliciousObj = { name: '<img src=x onerror=alert(1)>' };
            Wirup.registerComponent('xssObjComp', (item) => `<div>${item.name}</div>`);
            Wirup.registerData('xssObjData', maliciousObj);
            
            const output = Wirup.buildComponent('xssObjComp', 'xssObjData');
            expect(output).toContain('&lt;img src=x onerror=alert(1)&gt;');
        });
    });

    describe('DX: Event Delegation', () => {
        it('should handle registered events via attributes', () => {
            const handler = vi.fn();
            Wirup.registerEventHandler('testClick', handler);

            const btn = document.createElement('button');
            btn.setAttribute('wu-click', 'testClick');
            btn.setAttribute('wu-data', 'someData');
            document.body.appendChild(btn);

            btn.click();

            expect(handler).toHaveBeenCalled();
            expect(handler).toHaveBeenCalledWith(expect.anything(), 'someData');
        });

        it('should handle nested elements in click target', () => {
            const handler = vi.fn();
            Wirup.registerEventHandler('nestedClick', handler);

            const container = document.createElement('div');
            container.setAttribute('wu-click', 'nestedClick');
            const span = document.createElement('span');
            container.appendChild(span);
            document.body.appendChild(container);

            span.click();

            expect(handler).toHaveBeenCalled();
        });
    });

    describe('Modernization: Proxy Reactivity', () => {
        it('should trigger update callback when modifying array via push directly', () => {
            const callback = vi.fn();
            data.setUpdateComponentsCallback(callback);
            
            const key = 'proxyData';
            Wirup.registerData(key, []);
            
            // Direct array mutation on the data store object
            Wirup.dataStore[key].push('newItem');
            
            expect(callback).toHaveBeenCalledWith(key);
            expect(Wirup.dataStore[key].length).toBe(1);
        });

        it('should trigger update when setting property on object', () => {
            const callback = vi.fn();
            data.setUpdateComponentsCallback(callback);
            
            const key = 'proxyObj';
            Wirup.registerData(key, { name: 'Old' });
            
            Wirup.dataStore[key].name = 'New';
            
            expect(callback).toHaveBeenCalledWith(key);
            expect(Wirup.dataStore[key].name).toBe('New');
        });
    });
});
