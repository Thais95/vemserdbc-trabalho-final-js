/*NECESSARIO

Para instalar json server colocar no terminal:
npm install -g json-server
E rodar com:
json-server --watch meuJSON.json
Pagina de visualizacao:
http://localhost:3000/

Documentacao => https://github.com/typicode/json-server
*/

const url = 'http://localhost:3000'

let dataUsers;
let dataVagas = [];
let dataCandidaturas = [];


async function getUsers() {
  const response = await fetch(`${url}/users`);
    dataUsers = await response.json();

    // console.log(dataUsers);

  }
async function getVagas() {
    const response = await fetch(`${url}/vagas`);
    dataVagas = await response.json();

    // console.log(dataVagas);
    
  }
async function getCandidaturas() {
  const response = await fetch(`${url}/candidatura`);
    dataCandidaturas = await response.json();
    
  }
  
  getUsers();
  
  getVagas();
  
  getCandidaturas();
  
  
  async function deleteVaga(id) {
      await fetch(`${url}/vagas/${id}`, {
          method: "DELETE",
          headers: {
          "Content-Type": "application/json",
        },
      });
  
      let tamanho = await dataUsers.length;
      let emailsCadastrados = new Map();
      let senhas = new Map();
      for (let i = 0; i < tamanho; i++) {
          emailsCadastrados.set(await dataUsers[i].email, i);
          senhas.set(await dataUsers[i].email, await dataUsers[i].senha);
      }
  
      if (emailsCadastrados.has(emailLogin)) {
          if (senhas.get(emailLogin) == senhaLogin) {
              document.getElementById('logado').innerText = 'LOGADO'
          }
      } else {
          document.getElementById('logado').innerText = 'USUÁRIO NÃO CADASTRADO'
      }
  }

  document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();
  postSignup(event);
});

function postSignup(e) {
  let data = new FormData(e.target).entries();
  let userSignup = Object.fromEntries(data);

  try {
    if(userSignup.nome === '' || userSignup.email === '' || userSignup.senha === ''){ 
      throw new Error("campos vazios")
    };

    const json = {
      tipo: "userSignup.tipo",
      nome: "userSignup.nome",
      dataNascimento: "userSignup.dataNascimento",
      email: "userSignup.email",
      senha: "userSignup.senha",
    };
    
    fetch(`${url}/users`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(json),
     });
  
  } catch (error) {
    console.error(error)
  }

}

// FORMATA A DATA DE NASCIMENTO
//let data = document.getElementById('input-signup-date').value;
//let dataObj = new Date(data)
//let dataObjNoTimeZone = new Date(dataObj.getTime() + ((dataObj.getTimezoneOffset() * 60000)))