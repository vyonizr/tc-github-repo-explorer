import { rest } from 'msw'
import { USERS_URL } from '../constants'
import MOCK_USER_ENDPOINT_RESPONSE from './mockUserEndpointResponse'

function getUsers() {
  return rest.get(`${USERS_URL}`, (req, res, ctx) => {
    const username = req.url.searchParams.get('q')
    const perPage = req.url.searchParams.get('per_page')

    if (username === 'linus' && perPage === '5') {
      return res(ctx.status(200), ctx.json(MOCK_USER_ENDPOINT_RESPONSE))
    }

    return res(
      ctx.status(200),
      ctx.json({
        total_count: 0,
        incomplete_results: false,
        items: [],
      })
    )
  })
}

export const handlers = [getUsers()]
