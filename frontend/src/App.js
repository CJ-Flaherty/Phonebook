import React, { useState, useEffect } from 'react'
import SumbissionForm from './components/SubmissionForm'
import SearchForm from './components/SearchForm'
import PersonDisplay from './components/PersonDisplay'
import personService from './services/PersonService'
import './index.css'
import Notification from './components/Notification.js'

const App = () => {
  const [ persons, setPersons] = useState([])
  const [newName, setNewName ] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [search, setSearch] = useState(false)
  const [erorrMessage, setErrorMessage] = useState(null)



  
  useEffect( () => {
    personService
    .getAll()
    .then( response => {
      setPersons(response.data)
    })
  }, [])



  const checkSearch = (str, searchTerm) =>{
    return (str.includes(searchTerm))
  }

  
  const personsToShow = (search === false)
    ? persons
    : persons.filter(person => checkSearch(person.name, searchTerm))
  


  const addPerson = (event) => {
    event.preventDefault()
    const personObj = {
      name: newName,
      number: newNumber
    }
    if(persons.map(person => person.name).includes(personObj.name)){
      setErrorMessage(`${personObj.name} is already in the phonebook`);
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    else{
      console.log('here :');
      personService
        .create(personObj)
        .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('') 
        setNewNumber('')
        setErrorMessage(`${personObj.name} added to phonebook`);
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })}

  }

  const handleNameChange = (event) => {
    console.log('event.target:', event.target);
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log('event.target:', event.target);
    setNewNumber(event.target.value)
  }
  
  const handleSearchTermChange = (event) => {
    setSearch(false)
    setSearchTerm(event.target.value)
  }
  
  const handleSearchChange = (event) => {
    event.preventDefault()
    setSearch(!search)
  }

  const toggleDeleteOf = id => {
    const person = persons.find(p => p.id ===id)
  
    if (window.confirm(`Do you really want to delete ${person.name}`)){
    personService
    .deletePerson(id)
    .then( response => {
      setPersons(persons.filter(p => p.id !== id))
      
    })
    setErrorMessage(`${person.name} deleted from phonebook`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
    
    }
  
  }

  const Persons = () => {

    return ( personsToShow.map(person => 
      
      <PersonDisplay 
          key = {person.name}
          name= {person.name} 
          number= {person.number}
          toggleDelete = {() => toggleDeleteOf(person.id)}
          
      />)

    )
  }
  



    return(



    <div>
      <h2>Phonebook</h2>
     
      <Notification message = {erorrMessage} />

      <SumbissionForm 
      onSubmit = {addPerson} name1 = 'name' value1 = {newName} onChange1 = {handleNameChange}
       name2 = 'number' value2 = {newNumber} onChange2 = {handleNumberChange} 
      />



      
        <SearchForm
         onSubmit = {handleSearchChange} name = 'search' value = {searchTerm} onChange = {handleSearchTermChange}
        />

     
      
      
      <h2>Numbers</h2>
      {console.log('persons2', personsToShow)}

      <Persons personsToShow = {personsToShow} />
    </div>
    )
}

export default App