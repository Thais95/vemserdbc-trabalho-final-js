/*NECESSARIO

Para instalar json server colocar no terminal:
npm install -g json-server
E rodar com:
json-server --watch meuJSON.json
Pagina de visualizacao:
http://localhost:3000/

Documentacao => https://github.com/typicode/json-server
*/

const url = "http://localhost:3000";

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

//getUsers();

//getVagas();

//getCandidaturas();

async function deleteVaga(id) {
  await fetch(`${url}/vagas/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function fazerLogin() {
    let emailLogin;
    let senhaLogin;
    if (document.getElementById('emailLogin').value) {
        emailLogin = document.getElementById('emailLogin').value
    } else {
        alert('Email não pode estar vazio')
    }
    if (document.getElementById('senhaLogin').value) {
        senhaLogin = document.getElementById('senhaLogin').value;
    } else {
        alert('Campo senha não pode estar vazio')
    }

  let tamanho = await dataUsers.length;
  let emailsCadastrados = new Map();
  let senhas = new Map();
  for (let i = 0; i < tamanho; i++) {
    emailsCadastrados.set(await dataUsers[i].email, i);
    senhas.set(await dataUsers[i].email, await dataUsers[i].senha);
  }

  if (emailsCadastrados.has(emailLogin)) {
    if (senhas.get(emailLogin) == senhaLogin) {
      document.getElementById("logado").innerText = "LOGADO";
    }
  } else {
    document.getElementById("logado").innerText = "USUÁRIO NÃO CADASTRADO";
  }
}

document.getElementById("form-signup").addEventListener("submit", function (event) {
  event.preventDefault();
  postSignup(event);
});

function postSignup(e) {
  let data = new FormData(e.target).entries();
  let userSignup = Object.fromEntries(data);
  
  console.log(userSignup);
  try {
    if (
      userSignup.name-user === "" ||
      userSignup.e-mail === "" ||
      userSignup.senha === "" ||
      userSignup.birth-date === ""
      ) {
        throw new Error("campos vazios");
      }
      
      let newDateObj = new Date(userSignup.birth-date)
      let nascimentoDateObj = new Date(newDateObj.getTime() + ((newDateObj.getTimezoneOffset() * 60000)))

    const json = {
      tipo: userSignup.type-user,
      nome: userSignup.name-user,
      dataNascimento: nascimentoDateObj,
      email: userSignup.e-mail,
      senha: userSignup.password,
      candidaturas: []
    };

    fetch(`${url}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
  } catch (error) {
    console.error(error);
  }

  //apos cadastro, loga o usuario
  //fazerLogin(userSignup.e-mail, userSignup.password)
}

function postVaga(){
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const salary = document.getElementById('salary').value;

  console.log(title, description, salary);

  try {
    if (
      title === "" ||
      description === "" ||
      salary === ""
    ) {
      throw new Error("campos vazios");
    }

    const json = {
      titulo: title,
      descricao: description,
      remuneracao: salary,
      candidatos: []
    };

    fetch(`${url}/vagas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
  } catch (error) {
    console.error(error);
  }
}

// Ideia para verificar usuario logado
// Criar item:
function gravarItem(){
  let key = 'user';
  let myObj = { email: 'juslis@gmail.com', logado: true };
  localStorage.setItem(key, JSON.stringify(myObj));
}

// Ler item:
function lerItem(){
  let key = 'user';
  let myItem = JSON.parse(localStorage.getItem(key));
  console.log(myItem);
}



// criandoVaga = document.getElementById('AQUI FICA O ID DA DIV QUE VAI RECEBER OS ELEMENTOS').insertAdjacentElement('beforeend', `
//     <div class="content-container">
//         <a href="${link-vaga}">
//             <p>${titulo-vaga}</p>
//             <p>${salario-vaga}</p>
//         </a>
//     </div>
// `)