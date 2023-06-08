const BASE_URL = 'https://api.github.com'
const USERS_URL = `${BASE_URL}/search/users`
const generateRepoURL = (username: string) =>
  `${BASE_URL}/users/${username}/repos`

export { BASE_URL, USERS_URL, generateRepoURL }
