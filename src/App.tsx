import { useState, useEffect, useCallback } from 'react'
import { USERS_URL } from './constants'
import type { ISearchResults, IUserEndpointResponse } from './types'
import UserRow from './components/UserRow'

const DEFAULT_API_RESULTS_STATE = {
  isLoading: false,
  error: null,
  data: [],
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFirstSearch, setIsFirstSearch] = useState(true)
  const [searchResults, setSearchResults] = useState<ISearchResults>(
    DEFAULT_API_RESULTS_STATE
  )
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const searchUsers = useCallback(
    async (query: string) => {
      try {
        setSearchResults({ ...DEFAULT_API_RESULTS_STATE, isLoading: true })
        const response = await fetch(
          `${USERS_URL}?q=${encodeURIComponent(query)}&per_page=5`
        )
        const responseJSON: IUserEndpointResponse = await response.json()
        setSearchResults((prevState) => ({
          ...prevState,
          data: responseJSON.items,
        }))
      } catch (error) {
        console.error(error)
        setSearchResults(DEFAULT_API_RESULTS_STATE)
      } finally {
        setSearchResults((prevState) => ({ ...prevState, isLoading: false }))
        if (isFirstSearch) {
          setIsFirstSearch(false)
        }
      }
    },
    [isFirstSearch]
  )

  useEffect(() => {
    const handleEnterKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && searchQuery.length > 0) {
        searchUsers(searchQuery)
      }
    }

    document.addEventListener('keydown', handleEnterKey)

    return () => {
      document.removeEventListener('keydown', handleEnterKey)
    }
  }, [searchQuery, searchUsers])

  return (
    <main className='w-full max-w-[480px] p-4'>
      <input
        type='text'
        placeholder='Enter username'
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className='block w-full py-2 px-4 bg-gray-100 rounded-md'
      />
      <button
        onClick={() => searchUsers(searchQuery)}
        className='w-full mt-4 bg-blue-500 text-white rounded-md py-2 disabled:bg-gray-300'
        disabled={searchQuery.length === 0 || searchResults.isLoading}
      >
        Search
      </button>
      {searchResults.isLoading ? (
        <p>Loading...</p>
      ) : searchResults.error ? (
        <p>{searchResults.error}</p>
      ) : searchResults.data.length === 0 && !isFirstSearch ? (
        <p>No results found</p>
      ) : searchResults.data.length > 0 ? (
        <>
          <p className='mt-4'>Showing users for {`“${searchQuery}”`}</p>
          <ul className='mt-4 grid grid-flow-row gap-y-2'>
            {searchResults.data.map((user) => (
              <UserRow
                key={user.id}
                username={user.login}
                isExpanded={selectedUser === user.login}
                onClick={() =>
                  setSelectedUser((prevState) =>
                    prevState === user.login ? null : user.login
                  )
                }
              />
            ))}
          </ul>
        </>
      ) : null}
    </main>
  )
}

export default App
