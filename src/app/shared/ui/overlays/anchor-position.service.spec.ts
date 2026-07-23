import { computePosition, Rect } from './anchor-position.service';
import { describe, it, expect } from 'vitest';

describe('computePosition', () => {
  const viewport = { viewportWidth: 1000, viewportHeight: 800, offset: 4, viewportPadding: 8 };

  const triggerRect: Rect = {
    top: 400,
    bottom: 440,
    left: 400,
    right: 500,
    width: 100,
    height: 40,
  };

  const overlayRect: Rect = {
    top: 0,
    bottom: 200,
    left: 0,
    right: 200,
    width: 200,
    height: 200,
  };

  it('should position bottom-start correctly without flipping', () => {
    const result = computePosition(triggerRect, overlayRect, 'bottom-start', viewport);
    expect(result.resolvedPlacement).toBe('bottom-start');
    expect(result.top).toBe(444); // 440 + 4 offset
    expect(result.left).toBe(400); // aligns with trigger left
  });

  it('should position bottom-end correctly without flipping', () => {
    const result = computePosition(triggerRect, overlayRect, 'bottom-end', viewport);
    expect(result.resolvedPlacement).toBe('bottom-end');
    expect(result.top).toBe(444); // 440 + 4 offset
    expect(result.left).toBe(300); // trigger right (500) - overlay width (200)
  });

  it('should position bottom-center correctly without flipping', () => {
    const result = computePosition(triggerRect, overlayRect, 'bottom-center', viewport);
    expect(result.resolvedPlacement).toBe('bottom-center');
    expect(result.top).toBe(444);
    expect(result.left).toBe(350); // 400 + (100 / 2) - (200 / 2)
  });

  it('should flip to top if bottom overflows viewport', () => {
    const lowTrigger: Rect = { ...triggerRect, top: 750, bottom: 790 };
    const result = computePosition(lowTrigger, overlayRect, 'bottom-start', viewport);
    expect(result.resolvedPlacement).toBe('top-start');
    expect(result.top).toBe(546); // 750 - 200 - 4
  });

  it('should NOT flip if both sides overflow (tall overlay)', () => {
    const tallOverlay: Rect = { ...overlayRect, height: 1000 };
    const result = computePosition(triggerRect, tallOverlay, 'bottom-start', viewport);
    // It should stay on bottom because neither bottom nor top fit
    expect(result.resolvedPlacement).toBe('bottom-start');
    expect(result.top).toBe(444);
  });

  it('should shift/clamp cross-axis if it overflows the right edge', () => {
    const rightTrigger: Rect = { ...triggerRect, left: 900, right: 1000 };
    const result = computePosition(rightTrigger, overlayRect, 'bottom-start', viewport);
    // left would normally be 900. But 900 + 200 (width) = 1100, which is > 1000 - 8 (padding)
    // max left = 1000 - 200 - 8 = 792
    expect(result.resolvedPlacement).toBe('bottom-start');
    expect(result.left).toBe(792);
  });

  it('should shift/clamp cross-axis if it overflows the left edge', () => {
    const leftTrigger: Rect = { ...triggerRect, left: 0, right: 100 };
    const result = computePosition(leftTrigger, overlayRect, 'bottom-end', viewport);
    // left would normally be 100 - 200 = -100.
    // min left = 8
    expect(result.resolvedPlacement).toBe('bottom-end');
    expect(result.left).toBe(8);
  });

  it('should handle overly wide overlays by pinning to viewport min (clamp fallback)', () => {
    const wideOverlay: Rect = { ...overlayRect, width: 1200 };
    const result = computePosition(triggerRect, wideOverlay, 'bottom-start', viewport);
    // max left = 1000 - 1200 - 8 = -208
    // min left = 8
    // max < min, so clamp falls back to min (8).
    expect(result.resolvedPlacement).toBe('bottom-start');
    expect(result.left).toBe(8);
  });

  it('should flip left to right if it overflows the left edge (main axis)', () => {
    const leftTrigger: Rect = { ...triggerRect, left: 50, right: 150 };
    const result = computePosition(leftTrigger, overlayRect, 'left-start', viewport);
    // Left side fits? 50 - 200 - 4 = -154 (false)
    // Right side fits? 150 + 200 + 4 = 354 <= 1000 - 8 (true)
    expect(result.resolvedPlacement).toBe('right-start');
    expect(result.left).toBe(154); // 150 + 4
    expect(result.top).toBe(400); // start align
  });

  it('should handle bottom-right corner correctly (flip main axis and clamp cross axis)', () => {
    // Trigger in bottom right corner
    const bottomRightTrigger: Rect = { 
      top: 750, 
      bottom: 790, 
      left: 900, 
      right: 1000, 
      width: 100, 
      height: 40 
    };
    const result = computePosition(bottomRightTrigger, overlayRect, 'bottom-start', viewport);
    
    // Main axis (bottom) overflows: 790 + 200 + 4 > 800 - 8 (false). Flips to top.
    expect(result.resolvedPlacement).toBe('top-start');
    
    // Main axis top math: 750 - 200 - 4 = 546
    expect(result.top).toBe(546);

    // Cross axis (start) would be left = 900.
    // 900 + 200 (width) = 1100 > 1000 - 8. Max left = 1000 - 200 - 8 = 792.
    // So it should clamp to 792.
    expect(result.left).toBe(792);
  });
});
