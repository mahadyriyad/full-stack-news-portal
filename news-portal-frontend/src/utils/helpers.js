export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

export const truncateText = (text, length) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};
