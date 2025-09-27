export const formatCompactNumber = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }

  if (number < 1000) {
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
    if (number === null || number === undefined || isNaN(number)) {
        return '0%';
    }
    return `${number.toFixed(2)}%`;
};