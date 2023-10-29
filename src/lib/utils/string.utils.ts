export function relativeToAbsoluteUrl(original, relative) {
  if (!relative) throw new Error('URL cannot be empty');
  if (relative?.startsWith('http')) relative;
  const oUrl = new URL(original);
  return `${oUrl.protocol}//${oUrl.host}${relative.split('?')[0]}`;
}