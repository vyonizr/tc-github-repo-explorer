import { useState, useEffect } from 'react'
import { generateRepoURL } from '../constants'

import type { ISearchRepoResults, Repo } from '../types'

interface UserRowProps {
  username: string
  isExpanded: boolean
  onClick: () => void
}

const DEFAULT_API_RESULTS_STATE = {
  isLoading: false,
  error: null,
  data: [],
}

function UserRow({ username, isExpanded, onClick }: UserRowProps) {
  const [repos, setRepos] = useState<ISearchRepoResults>(
    DEFAULT_API_RESULTS_STATE
  )

  useEffect(() => {
    const fetchRepos = async (username: string) => {
      try {
        setRepos({ ...DEFAULT_API_RESULTS_STATE, isLoading: true })
        const response = await fetch(generateRepoURL(username))
        const responseJSON: Repo[] = await response.json()
        setRepos((prevState) => ({
          ...prevState,
          data: responseJSON,
        }))
      } catch (error) {
        console.error(error)
        setRepos(DEFAULT_API_RESULTS_STATE)
      } finally {
        setRepos((prevState) => ({ ...prevState, isLoading: false }))
      }
    }

    if (isExpanded) {
      fetchRepos(username)
    }
  }, [username, isExpanded])

  return (
    <li>
      <p onClick={onClick}>{username}</p>
      {isExpanded ? (
        <>
          {repos.isLoading ? (
            <p>Loading...</p>
          ) : repos.error ? (
            <p>{repos.error}</p>
          ) : repos.data.length === 0 && isExpanded ? (
            <p>No results found</p>
          ) : repos.data.length > 0 && isExpanded ? (
            <>
              <ul>
                {repos.data.map((repo) => (
                  <li key={repo.id}>
                    <p>{repo.name}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </>
      ) : null}
    </li>
  )
}

export default UserRow
