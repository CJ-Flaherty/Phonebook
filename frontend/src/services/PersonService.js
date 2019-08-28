import axios from 'axios'
var baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const deletePerson = (id ) => {
  var url = baseUrl.concat('/', id)

  return axios.delete(url)
}
export default { 
  getAll, 
  create,  
  deletePerson
}