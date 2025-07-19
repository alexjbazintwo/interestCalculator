export type Duration = "Daily" | "Monthly" | "Yearly";

export function calculateInterest(
  principal: number,
  rate: number,
  duration: Duration
): { expectedInterest: number; expectedTotal: number } {
  let multiplier: number;

  switch (duration) {
    case "Daily":
      multiplier = 1 / 365;
      break;
    case "Monthly":
      multiplier = 1 / 12;
      break;
    case "Yearly":
      multiplier = 1;
      break;
    default:
      throw new Error(`Unknown duration: ${duration}`);
  }

  const expectedInterest = +((principal * rate * multiplier) / 100).toFixed(2);
  const expectedTotal = +(principal + expectedInterest).toFixed(2);

  return { expectedInterest, expectedTotal };
}


