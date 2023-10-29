const isProduction = process.env.NODE_ENV === 'production';

export function log(...message) {
  if (!isProduction) {
    console.log(message);
  }
}