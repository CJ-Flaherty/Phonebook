import React from 'react'

const PersonDisplay = (props) => {
  const msg = 'Delete'
  return (
    <div> 
      <li className = 'person'>
      Name: {props.name} 
      Number: {props.number}
      <button onClick= {props.toggleDelete}>{msg}</button>
      </li>
    </div>
  )
}

export default PersonDisplay