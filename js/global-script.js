const url = 'http://localhost:3000'

async function getUsers(){
  const response = await fetch(`${url}/users`);
  const data = await response.json();
  
 console.log(data) 
}
async function getVagas(){
  const response = await fetch(`${url}/vagas`);
  const data = response.json();
  
 data.then(value => console.log(value));
  
}
async function getCandidaturas(){
  const response = await fetch(`${url}/candidatura`);
  const data = await response.json();
  
console.log(data);
  
}

getUsers(); 

getVagas();

getCandidaturas();















