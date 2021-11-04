import React, { useState, useEffect } from 'react'
import personService from "./services/persons"
import './index.css'

const Filter = ({ handleFilterChange, filter }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>name: <input value={newName} onChange={handleNameChange} /></div>
      <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Persons = ({ filteredList, setPersons, persons, setSuccessMessage }) => {

  const deletePersonFromList = (person) => {
    if (window.confirm(`Delete ${person.name}`)) {
      personService.deletePerson(person.id)
      const copyPersons = [...persons]
      copyPersons.splice(copyPersons.indexOf(person), 1)
      setPersons(copyPersons)
      setSuccessMessage(
        `Deleted ${person.name}`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    }
  }

  return (
    <>
      {filteredList.map(person =>
        <p key={person.id}>{person.name} {person.number} <button onClick={() => deletePersonFromList(person)}>delete</button></p>
      )}
    </>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(allPersons => setPersons(allPersons))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one`)) {

        const copyPersonId = persons.find(p => p.name === newName).id

        personService
          .replaceNumber(personObject, copyPersonId)
          .then(response => {
            setPersons(persons.map(person => person.name === newName ? response : person))
            setSuccessMessage(
              `Changed ${personObject.name}'s number`
            )
            setTimeout(() => {
              setSuccessMessage(null)
            }, 3000)
          })
          .catch(error => {
            setError(
              `Information of ${personObject.name} has already been removed from server`
            )
            setTimeout(() => {
              setError(null)
            }, 3000)
            const copyPersons = [...persons]
            const alreadyDeleted = persons.find(person => person.name === newName)
            copyPersons.splice(copyPersons.indexOf(alreadyDeleted), 1)
            setPersons(copyPersons)
          })

      }
    } else {

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setSuccessMessage(
            `Added ${personObject.name}`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 3000)
        })
        .catch(error => {
          setError(
            error.response.data.error
          )
          setTimeout(() => {
            setError(null)
          }, 3000)
        })
    }
    
    setNewName('')
    setNewNumber('')
    setFilter('')
  }

  const handleNameChange = (event) => setNewName(event.target.value)

  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFilterChange = (event) => setFilter(event.target.value)

  const filteredList = filter.length > 0
    ? persons.filter(person => person.name.toLowerCase().includes(filter))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
      <Error message={error} />
      <Filter
        handleFilterChange={handleFilterChange}
        filter={filter}
      />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        filteredList={filteredList}
        setPersons={setPersons}
        persons={persons}
        setSuccessMessage={setSuccessMessage}
      />
    </div>
  )
}

export default App