import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'

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
