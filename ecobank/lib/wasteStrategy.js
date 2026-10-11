export class WasteStrategy {
  calculate(weight, rate) {
    throw new Error("Method calculate() harus diimplementasikan.");
  }
}

export class StandardCalculationStrategy extends WasteStrategy {
  calculate(weight, rate) {
    return weight * rate;
  }
}

export class CalculatorContext {
  constructor(strategy) {
    this.strategy = strategy;
  }
  execute(weight, rate) {
    return this.strategy.calculate(weight, rate);
  }
}