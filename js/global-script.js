/*

NECESSARIO

Para instalar json server colocar no terminal:
    npm install -g json-server
E rodar com:
    json-server --watch meuJSON.json
Pagina de visualizacao:
    http://localhost:3000/

Documentacao => https://github.com/typicode/json-server
*/

const url = 'http://localhost:3000'

async function getUsers(){
  const response = await fetch(`${url}/users`);
  const data = response.json();
  
 data.then(value => console.log(value));
  
}
async function getVagas(){
  const response = await fetch(`${url}/vagas`);
  const data = response.json();
  
 data.then(value => console.log(value));
  
}
async function getCandidaturas(){
  const response = await fetch(`${url}/candidatura`);
  const data = response.json();
  
 data.then(value => console.log(value));
  
}

getUsers(); 

getVagas();

getCandidaturas();















