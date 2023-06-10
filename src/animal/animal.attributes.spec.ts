import { AnimalAttributes } from './animal.attributes';

describe('AnimalAttributes', () => {
  it('should be defined', () => {
    expect(new AnimalAttributes()).toBeDefined();
  });
  test('should initialize with empty name and value', () => {
    const animalAttributes = new AnimalAttributes();
    expect(animalAttributes.name).toBe(undefined);
    expect(animalAttributes.value).toBe(undefined);
  });

  test('should assign and retrieve values for name property', () => {
    const animalAttributes = new AnimalAttributes();
    animalAttributes.name = 'Lion';
    expect(animalAttributes.name).toBe('Lion');
  });

  test('should assign and retrieve values for value property', () => {
    const animalAttributes = new AnimalAttributes();
    animalAttributes.value = 'Fierce';
    expect(animalAttributes.value).toBe('Fierce');
  });
});
