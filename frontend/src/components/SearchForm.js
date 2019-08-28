import React from 'react'

const SearchForm = (props) => {
console.log('props :', props);
return(
   <form onSubmit = {props.onSubmit}>
   <div>
 
     name: <input 
       name = {props.name}
       value = {props.value}
       onChange = {props.onChange}
   />
   </div>

     <button type="submit">Search</button>
 </form>
)
}

export default SearchForm