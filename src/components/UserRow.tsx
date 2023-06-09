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
  const [isFirstExpanded, setIsFirstExpanded] = useState(true)

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
      if (isFirstExpanded) {
        setIsFirstExpanded(false)
      }
    }
  }, [username, isExpanded, isFirstExpanded])

  return (
    <li>
      <button
        onClick={onClick}
        className='bg-gray-100 p-2 w-full grid grid-cols-[auto_48px]'
      >
        <p className='text-left'>{username}</p>
        <p className='text-right'>{isExpanded ? '▲' : '▼'}</p>
      </button>
      {isExpanded ? (
        <>
          {repos.isLoading ? (
            <ul className=' mt-2 pl-4 grid grid-flow-row gap-y-2'>
              <li className='bg-gray-200 animate-pulse grid grid-cols-[auto_64px] p-2'>
                <div>
                  <p className='rounded h-4 w-1/2 bg-gray-400'></p>
                  <p className='rounded h-4 mt-2 w-3/4 bg-gray-400'></p>
                </div>
                <p className='rounded h-4 w-full bg-gray-400'></p>
              </li>
            </ul>
          ) : repos.error ? (
            <p>{repos.error}</p>
          ) : !isFirstExpanded && repos.data.length === 0 && isExpanded ? (
            <p>No results found</p>
          ) : repos.data.length > 0 && isExpanded ? (
            <ul className='mt-2 pl-4 grid grid-flow-row gap-y-2'>
              {repos.data.map((repo) => (
                <li
                  key={repo.id}
                  className='bg-gray-200 grid grid-cols-[auto_64px] p-2'
                >
                  <div>
                    <p className='font-bold text-lg'>{repo.name}</p>
                    <p>{repo.description}</p>
                  </div>
                  <p className='font-bold text-right'>
                    {repo.stargazers_count + '★'}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
    </li>
  )
}

export default UserRow
