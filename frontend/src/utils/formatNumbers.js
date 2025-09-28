export const formatCompactNumber = (number) => {
  if (number === null || number === undefined || !Number.isFinite(number)) {
    return '0';
  }

  if (Math.abs(number) < 1000) {
    return number.toString();
  }

  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  });

  return formatter.format(number);
};

export const formatPercentage = (number) => {
  if (number === null || number === undefined || !Number.isFinite(number)) {
    return '0%';
  }

  return `${Number(number).toFixed(2)}%`;
};