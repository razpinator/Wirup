// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import Wirup from '../src/index.js';

describe('Wirup Modern Tests', () => {
    
    beforeEach(() => {
        document.body.innerHTML = '<div id="contentBody"></div>';
        
        // Mock fetch
        global.fetch = vi.fn(() => Promise.resolve({
            ok: true,
            text: () => Promise.resolve('<div>View Content</div>')
        }));
        
        // Mock XMLHttpRequest
        global.XMLHttpRequest = vi.fn(() => ({
            open: vi.fn(),
            setRequestHeader: vi.fn(),
            send: vi.fn(),
            onreadystatechange: null, // Will be set by code
            readyState: 4,
            status: 200,
            responseText: JSON.stringify({ views: [{ url: '/', viewFile: 'home.html' }] })
        }));
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should define window.wu', () => {
        expect(window.wu).toBeDefined();
        expect(window.wu).toBe(Wirup);
    });

    it('should have init method', () => {
        expect(typeof Wirup.init).toBe('function');
    });

    it('should have registerComponent method', () => {
        expect(typeof Wirup.registerComponent).toBe('function');
    });

    it('should register and build a component', () => {
        Wirup.registerComponent('testComp', (item) => `<span>${item}</span>`);
        Wirup.registerData('testData', 'Hello');
        
        const output = Wirup.buildComponent('testComp', 'testData');
        expect(output).toBe('<span>Hello</span>');
    });

    it('should react to data changes', () => {
        // Setup DOM
        document.body.innerHTML = '<div id="contentBody"><reactive-comp id="comp1" datasource="reactiveData"></reactive-comp></div>';
        
        Wirup.registerComponent('reactive-comp', (item) => `<b>${item}</b>`);
        
        // Populate DOM element first manually because init usually does this
        // But here we are unit testing the reactivity
        
        // We need to simulate how components are rendered. 
        // registerData triggers update if set.
        
        Wirup.registerData('reactiveData', 'Initial');
        
        // Manually trigger the build into the DOM for initial state (as init would do)
        const comp1 = document.getElementById('comp1');
        // We know that Wirup.init renders components.
        // Let's just manually update it for the "before" state
        comp1.innerHTML = Wirup.buildComponent('reactive-comp', 'reactiveData');
        
        expect(comp1.innerHTML).toBe('<b>Initial</b>');
        
        // Now update data
        Wirup.dataStore.reactiveData = 'Updated';
        
        // Check if DOM updated
        expect(comp1.innerHTML).toBe('<b>Updated</b>');
    });
});
