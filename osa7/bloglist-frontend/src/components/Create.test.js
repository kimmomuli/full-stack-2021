import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CreateForm from './Create'

describe('BlogForm', () => {
  test('form works right', () => {
    const createBlog = jest.fn()

    const component = render(
      <CreateForm postBlog={createBlog}/>
    )

    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, {
      target: { value: 'Title test' }
    })

    fireEvent.change(author, {
      target: { value: 'Author' }
    })

    fireEvent.change(url, {
      target: { value: 'https://google.com' }
    })

    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)

    const newBlog = createBlog.mock.calls[0][0]

    expect(newBlog.title).toBe('Title test')
    expect(newBlog.author).toBe('Author')
    expect(newBlog.url).toBe('https://google.com')
  })
})