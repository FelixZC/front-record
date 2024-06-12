import { Person } from '../examples/person';

test('updates age on birthday', () => {
  const person = new Person('Alice', 30);
  expect(person.greet()).toBe('Hello, my name is Alice');
  expect(person.introduce()).toBe('My name is Alice and I am 30 years old.');
  expect(person.celebrateBirthday()).toBe('My name is Alice and I am 31 years old.');
});