import axios from 'axios'

export function search (q, tag, start = 0, count = 30) {
  return axios.get('/v2/movie/search', {
    params: {
      q,
      tag,
      start,
      count
    }
  })
}
