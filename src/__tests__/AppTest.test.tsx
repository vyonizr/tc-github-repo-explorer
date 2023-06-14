import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'

const DUMMY_USERNAME = 'linus'

describe('Main page rendered properly', () => {
  beforeEach(() => {
    render(<App />)
  })

  test('Input component is rendered', () => {
    const searchInput = screen.getByTestId('search-input')
    expect(searchInput).toHaveAttribute('placeholder', 'Enter username')
    expect(searchInput).toBeInTheDocument()
  })

  test('Search button is rendered', () => {
    const searchButton = screen.getByTestId('search-button')
    expect(searchButton).toHaveTextContent('Search')
    expect(searchButton).toHaveClass('bg-blue-500')
  })
})

describe('Integration Test', () => {
  beforeEach(() => {
    render(<App />)
  })

  test('Button is disabled when input is empty', () => {
    const searchInput = screen.getByTestId('search-input')
    const searchButton = screen.getByTestId('search-button')

    expect(searchInput).toHaveValue('')
    expect(searchButton).toBeDisabled()
  })

  test('Button is enabled when input is not empty', () => {
    const searchInput = screen.getByTestId('search-input')
    const searchButton = screen.getByTestId('search-button')

    fireEvent.change(searchInput, { target: { value: DUMMY_USERNAME } })

    expect(searchInput).toHaveValue(DUMMY_USERNAME)
    expect(searchButton).not.toBeDisabled()
  })

  test('Loading shimmer and results are rendered', async () => {
    const searchInput = screen.getByTestId('search-input')
    const searchButton = screen.getByTestId('search-button')

    fireEvent.change(searchInput, { target: { value: DUMMY_USERNAME } })
    fireEvent.click(searchButton)
    screen.getAllByTestId('user-shimmer')

    await waitFor(() => {
      const showingUsersText = screen.getByTestId('showing-users-text')
      expect(showingUsersText).toBeInTheDocument()
    })
  })
})
