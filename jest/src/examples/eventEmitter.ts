// src/eventEmitter.ts
export class EventEmitter {
    private listeners: Function[] = [];

    subscribe(listener: Function) {
        this.listeners.push(listener);
    }

    publish(event: any) {
        this.listeners.forEach(listener => listener(event));
    }
}