export const years = Array.from({ length: 101 }, (_, index) => {
  const year = 2000 + index;

  return {
    label: String(year),
    value: year,
  };
});
