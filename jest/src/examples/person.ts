// src/person.ts
export class Person {
    private name: string;
    private age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    introduce() {
        return `My name is ${this.name} and I am ${this.age} years old.`;
    }
    greet() {
        return `Hello, my name is ${this.name}`;
    }

    celebrateBirthday() {
        this.age++;
        return this.introduce();
    }
}
