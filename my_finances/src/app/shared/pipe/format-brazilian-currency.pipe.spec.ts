import { FormatBrazilianCurrencyPipe } from './format-brazilian-currency.pipe';

describe('FormatBrazilianCurrencyPipe', () => {
  let pipe: FormatBrazilianCurrencyPipe;

  beforeEach(() => {
    pipe = new FormatBrazilianCurrencyPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return null for null input', () => {
    expect(pipe.transform(null)).toBeNull();
  });

  it('should return null for undefined input', () => {
    expect(pipe.transform(undefined)).toBeNull();
  });

  it('should return null for NaN input', () => {
    expect(pipe.transform(NaN)).toBeNull();
  });

  it('should return null for non-numeric string input', () => {
    expect(pipe.transform('abc')).toBeNull();
  });

  it('should return formatted currency for valid number with default locale and currency', () => {
    expect(pipe.transform(1234.56)).toEqual('R$ 1.234,56');
  });

  it('should return formatted currency for valid number with correct locale and currency', () => {
    expect(pipe.transform(1234.56, 'pt-BR', 'BRL')).toEqual('R$ 1.234,56');
  });

  it('should return formatted currency for valid number with different locale and correct currency', () => {
    expect(pipe.transform(1234.56, 'en-US', 'BRL')).toEqual('R$1,234.56');
  });

  it('should return formatted currency for valid number with different locale and different currency', () => {
    expect(pipe.transform(1234.56, 'en-US', 'USD')).toEqual('$1,234.56');
  });

  it('should return formatted currency for valid string number with comma', () => {
    expect(pipe.transform('1234,56', 'pt-BR', 'BRL')).toEqual('R$ 1.234,56');
  });

  it('should return formatted currency for valid string number with dot', () => {
    expect(pipe.transform('1234.56', 'pt-BR', 'BRL')).toEqual('R$ 1.234,56');
  });

  it('should return formatted currency for integer value', () => {
    expect(pipe.transform(1234, 'pt-BR', 'BRL')).toEqual('R$ 1.234,00');
  });
});
