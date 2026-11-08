const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const script = readFileSync(require('node:path').join(__dirname, '../script.js'), 'utf8');

function page({ landing = false, height = 800, scrollHeight = 1600,
    positions = [[130, 350], [500, 1500]], hash = '' } = {}) {
    const frames = [];
    const events = {};
    let overlay = false;
    let headerHeight = 105;
    const window = { innerHeight: height, scrollY: 0, innerWidth: 1200,
        addEventListener: (name, fn) => (events[name] ||= []).push(fn) };
    const location = { origin: 'https://example.test', pathname: '/index.html', hash };
    const targets = positions.map(([top, bottom]) => ({
        top, bottom, contains: () => false,
        getBoundingClientRect() { return { top: this.top - window.scrollY, bottom: this.bottom - window.scrollY }; }
    }));
    const links = targets.map((_, i) => ({
        href: `https://example.test/index.html#section-${i}`, active: false, attrs: {},
        classList: { toggle(name, active) { links[i].active = active; } },
        setAttribute(name, value) { this.attrs[name] = value; },
        removeAttribute(name) { delete this.attrs[name]; }, addEventListener() {}
    }));
    const external = { href: 'https://example.test/blog.html#section-0' };
    const nav = { querySelectorAll: () => [...links, external],
        classList: { contains: () => overlay, remove() { overlay = false; } } };
    const header = { querySelector: () => nav,
        getBoundingClientRect: () => ({ height: headerHeight, bottom: headerHeight }) };
    const button = { addEventListener() {}, setAttribute() {} };
    const document = {
        body: { classList: { contains: () => landing }, style: { setProperty() {} } },
        documentElement: { scrollHeight },
        querySelector: selector => selector === '.site-header' ? header :
            selector === '.site-header nav' ? nav :
            selector === '.hamburger-menu' ? button : null,
        querySelectorAll: () => [], addEventListener() {},
        getElementById: id => /^section-\d+$/.test(id) ? targets[Number(id.slice(8))] || null : null
    };
    let resized;
    vm.runInNewContext(script, { document, window, location, URL,
        requestAnimationFrame: fn => frames.push(fn),
        ResizeObserver: class { constructor(fn) { resized = fn; } observe() {} }
    });
    function flush() { while (frames.length) frames.shift()(); }
    function fire(name) { (events[name] || []).forEach(fn => fn()); flush(); }
    flush();
    return { links, targets, window, location,
        active: () => links.findIndex(link => link.active),
        scroll(y) { window.scrollY = y; fire('scroll'); },
        resize(newHeight) {
            window.innerHeight = newHeight;
            window.scrollY = Math.min(window.scrollY, Math.max(0, scrollHeight - newHeight));
            fire('resize');
        },
        header(height) { headerHeight = height; resized(); flush(); },
        overlay(open) { overlay = open; resized(); flush(); },
        hash(value) { location.hash = value; fire('hashchange'); }
    };
}

test('fully visible last section becomes active at the bottom, without a hash', () => {
    const p = page({ scrollHeight: 1000, positions: [[130, 450], [500, 900]] });
    p.scroll(199);
    assert.equal(p.active(), 1);
    p.scroll(190);
    assert.equal(p.active(), 0);
    p.scroll(200);
    assert.equal(p.links[1].attrs['aria-current'], 'location');
    assert.equal(p.links[0].attrs['aria-current'], undefined);
});

test('a last section still extending below the viewport does not activate early', () => {
    const p = page({ scrollHeight: 1100, positions: [[130, 450], [500, 1105]] });
    p.scroll(300);
    assert.equal(p.active(), 0);
});

test('landing hero is neutral; long sections activate at the reading line in both directions', () => {
    const p = page({ landing: true, scrollHeight: 3000, positions: [[500, 900], [900, 2600]] });
    assert.equal(p.active(), -1);
    p.scroll(369);
    assert.equal(p.active(), 0);
    p.scroll(768);
    assert.equal(p.active(), 0);
    p.scroll(769);
    assert.equal(p.active(), 1);
    p.scroll(768);
    assert.equal(p.active(), 0);
    p.scroll(2200);
    assert.equal(p.active(), 1);
    p.scroll(0);
    assert.equal(p.active(), -1);
});

test('short pages keep the overview initially and honor explicit anchors', () => {
    const p = page({ scrollHeight: 800, positions: [[130, 350], [400, 700]] });
    assert.equal(p.active(), 0);
    p.hash('#section-1');
    assert.equal(p.active(), 1);
    p.hash('#%E0%A4%A');
    assert.equal(p.active(), 0);
});

test('clamped anchor remains usable, but scrolling away uses the reading line', () => {
    const p = page({ hash: '#section-1', scrollHeight: 1000, positions: [[130, 450], [500, 900]] });
    p.scroll(200);
    assert.equal(p.active(), 1);
    p.scroll(180);
    assert.equal(p.active(), 0);
});

test('header and viewport changes update the active section; menu overlay freezes it', () => {
    const p = page({ positions: [[130, 350], [500, 1500]] });
    p.scroll(350);
    assert.equal(p.active(), 0);
    p.overlay(true);
    p.header(800);
    assert.equal(p.active(), 0);
    p.header(140);
    p.overlay(false);
    assert.equal(p.active(), 1);
    p.header(105);
    assert.equal(p.active(), 0);
    p.resize(1500);
    assert.equal(p.active(), 1);
});

// Even a very tall viewport must not assign a section to the unlinked hero.
test('a fully fitting landing page starts neutral and still honors explicit links', () => {
    const p = page({ landing: true, height: 2000, scrollHeight: 1800 });
    assert.equal(p.active(), -1);
    p.hash('#section-1');
    assert.equal(p.active(), 1);
});
