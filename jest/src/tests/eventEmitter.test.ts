// src/__tests__/eventEmitter.test.ts
import { EventEmitter } from '../examples/eventEmitter';

test('triggers all listeners', () => {
  const emitter = new EventEmitter();
  const mockListener = jest.fn();
  emitter.subscribe(mockListener);
  emitter.publish({ type: 'test' });

  expect(mockListener).toHaveBeenCalledWith({ type: 'test' });
});