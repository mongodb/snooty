export default function validateEmail(input) {
  const isValidEmail = input === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  return isValidEmail;
}
