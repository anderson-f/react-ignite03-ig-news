import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { Async } from '.'

describe('Async test componenet', () => {
  it('should renders correctly', async () => {
    render(<Async />)

    expect(screen.getByText('Hello world!')).toBeInTheDocument()
    // expect(await screen.findByText('Button')).toBeInTheDocument()


    await waitFor(() => {
      return expect(screen.getByText('Button')).toBeInTheDocument()
    })
  })

  it('should wait button to be removed', async () => {
    render(<Async />)

    await waitForElementToBeRemoved(screen.queryByText('Teste'))
  })
})
