export default function randomNumber (digitCount) {
  return Math.round(Math.random() * (10 * digitCount))
}
