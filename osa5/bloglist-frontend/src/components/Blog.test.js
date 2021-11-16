import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('Blog',() => {
  const blog = {
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 3,
    user: {
      usename: ''
    }
  }

  test('blog render title and author', async () => {
    const component = render(
      <Blog blog={blog} />
    )

    expect(component.container).toHaveTextContent('title')
    expect(component.container).toHaveTextContent('author')

    expect(component.container).not.toHaveTextContent('url')
    expect(component.container).not.toHaveTextContent('3')
  })

  test('url and likes rendering after click the button', async () => {
    const mockHandler = jest.fn()

    const component = render(
      <Blog blog={blog} visible={mockHandler}/>
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent('title')
    expect(component.container).toHaveTextContent('author')

    expect(component.container).toHaveTextContent('url')
    expect(component.container).toHaveTextContent('3')
  })

  test('click to button two times', async () => {
    const mockHandler = jest.fn()

    const component = render(
      <Blog blog={blog} likeBlog={mockHandler}/>
    )

    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
