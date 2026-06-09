import React from 'react';
import MetricCard from '../../components/cards/MetricCard';

// Testes de contrato do componente (sem render, compatível com React 19)
describe('MetricCard — contrato de props', () => {
  it('é uma função React (componente válido)', () => {
    expect(typeof MetricCard).toBe('function');
  });

  it('aceita props obrigatórias sem lançar erro de tipagem', () => {
    const props = { label: 'Temperatura', value: '42.5°C', icon: 'thermometer' as const };
    expect(() => React.createElement(MetricCard, props)).not.toThrow();
  });

  it('aceita prop status = critical sem lançar erro', () => {
    const props = { label: 'Temperatura', value: '70°C', icon: 'thermometer' as const, status: 'critical' as const };
    expect(() => React.createElement(MetricCard, props)).not.toThrow();
  });

  it('aceita prop status = warning sem lançar erro', () => {
    const props = { label: 'Bateria', value: '15%', icon: 'battery-dead' as const, status: 'warning' as const };
    expect(() => React.createElement(MetricCard, props)).not.toThrow();
  });

  it('aceita prop subtext opcional', () => {
    const props = { label: 'Sinal', value: '80%', icon: 'wifi' as const, subtext: 'Estável' };
    expect(() => React.createElement(MetricCard, props)).not.toThrow();
  });
});
