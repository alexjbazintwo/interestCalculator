export type Duration = "Daily" | "Monthly" | "Yearly";
export type CalculatorInputs = {
  principal: number;
  rate: number;
  duration: Duration;
};

export const calculateInterest = (
  principal: number,
  rate: number,
  duration: Duration
): { expectedInterest: number; expectedTotal: number } => {
  const multipliers: Record<Duration, number> = {
    Daily: 1 / 365,
    Monthly: 1 / 12,
    Yearly: 1,
  };

  const multiplier = multipliers[duration];
  if (multiplier === undefined) {
    throw new Error(`Unknown duration: ${duration}`);
  }

  const expectedInterest = +((principal * rate * multiplier) / 100).toFixed(2);
  const expectedTotal = +(principal + expectedInterest).toFixed(2);

  return { expectedInterest, expectedTotal };
};
