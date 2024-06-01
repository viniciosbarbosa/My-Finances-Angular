import { StatusPipe } from './status.pipe';

describe('StatusPipe', () => {
  let pipe: StatusPipe;

  beforeEach(() => {
    pipe = new StatusPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "Pago" for truthy values', () => {
    expect(pipe.transform(true)).toBe('Pago');
    expect(pipe.transform(1)).toBe('Pago');
    expect(pipe.transform('any string')).toBe('Pago');
    expect(pipe.transform([])).toBe('Pago');
    expect(pipe.transform({})).toBe('Pago');
  });

  it('should return "Pendente" for falsy values', () => {
    expect(pipe.transform(false)).toBe('Pendente');
    expect(pipe.transform(0)).toBe('Pendente');
    expect(pipe.transform('')).toBe('Pendente');
    expect(pipe.transform(null)).toBe('Pendente');
    expect(pipe.transform(undefined)).toBe('Pendente');
  });
});
