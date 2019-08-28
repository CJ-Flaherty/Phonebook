import React from 'react'


 const SumbissionForm = (props) => {
     //console.log('props :', props);
     return(
        <form onSubmit = {props.onSubmit}>
        <div>
      
          name: <input 
            name = {props.name1}
            value = {props.value1}
            onChange = {props.onChange1}
        />
        </div>
        <div>
          number: <input
          name = {props.name2}
          value = {props.value2}
          onChange = {props.onChange2}
          />
        </div>
    
          <button type="submit">add</button>
      </form>
     )
 }


 export default SumbissionForm