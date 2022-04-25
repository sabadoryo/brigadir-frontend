export default function hasToken() {
  return localStorage.getItem('token') ?? null
}