// src/__tests__/logger.test.ts
import { log } from '../examples/logger';

test('logs a message', () => {
    const spy = jest.spyOn(console, 'log');
    log('Hello, World!');
    expect(spy).toHaveBeenCalledWith('Hello, World!');
    spy.mockRestore();
});