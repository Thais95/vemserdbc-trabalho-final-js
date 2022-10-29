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
  return dataVagas;

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
}

async function fazerLogin() {
  let emailLogin;
  let senhaLogin;
  if (document.getElementById("emailLogin").value) {
    emailLogin = document.getElementById("emailLogin").value;
  } else {
    alert("Email não pode estar vazio");
  }
  if (document.getElementById("senhaLogin").value) {
    senhaLogin = document.getElementById("senhaLogin").value;
  } else {
    alert("Campo senha não pode estar vazio");
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
      gravarItem(emailLogin);

      let usuarioTipo = '';
      dataUsers.forEach(element => {
        if (element.email == emailLogin) {
          usuarioTipo = element.tipo
        } else {}
      });

      if (usuarioTipo == 'candidato') {
        window.location.href = './pages/home-candidato.html'
      } else {
        window.location.href = './pages/home-recrutador.html'
      }
    }
  } else {
    document.getElementById("logado").innerText = "USUÁRIO NÃO CADASTRADO";
  }
}

function logOut() {
  localStorage.removeItem('user');
  window.location.href = '../index.html'
}

if ((document
    .getElementById("form-signup")) != null) {

  document
    .getElementById("form-signup")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      postSignup(event);
    });
}

function postSignup(e) {
  let data = new FormData(e.target).entries();
  let userSignup = Object.fromEntries(data);

  // console.log(userSignup);
  try {
    if (
      userSignup.nameUser === "" ||
      userSignup.email === "" ||
      userSignup.senha === "" ||
      userSignup.birthDate === ""
    ) {
      throw new Error("campos vazios");
    }

    let dataFormatada = userSignup.birthDate.split('-');

    const json = {
      tipo: userSignup.typeUser,
      nome: userSignup.nameUser,
      dataNascimento: new Date(dataFormatada[0], dataFormatada[1]-1, dataFormatada[2]),
      email: userSignup.email,
      senha: userSignup.password,
      candidaturas: [],
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


async function listarVagas() {
  let listaDeVagas = [];
  listaDeVagas = await getVagas()


  listaDeVagas.forEach(element => {
    document.getElementById('containerListaDeVagas').insertAdjacentHTML("beforeend",
      `<div class="content-container">
      <a href="./vaga-recrutador.html?id=${element.id}">
      <p>${element.titulo}</p>
      <p>R$ ${element.remuneracao}</p>
      </a>
      </div>`
    )
  })

}


if(document.getElementById('containerListaDeVagas') !== null){
  listarVagas()
}

function postVaga() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const salary = document.getElementById("salary").value;

  console.log(title, description, salary);

  try {
    if (title === "" || description === "" || salary === "") {
      throw new Error("campos vazios");
    }

    const json = {
      titulo: title,
      descricao: description,
      remuneracao: salary,
      candidatos: [],
    };

    fetch(`${url}/vagas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
    window.location.href = './home-recrutador.html'
  } catch (error) {
    console.error(error);
  }

}

function redirecionarTelaVaga() {
  window.location.href = './cadastrar-vaga.html'
}

window.addEventListener('load',() => redirecionarVagaEspecifica())

function redirecionarVagaEspecifica() {
  const url2 = window.location.href
  const id2 = url2.split("").splice(url2.lastIndexOf("="), 3);
  id2.shift();
  const id3 = id2.join("");
  console.log(getInscritos(id3));
}

// Ideia para verificar usuario logado
// Criar item:
function gravarItem(email) {
  let key = "user";
  let myObj = {
    email: email,
    logado: true
  };
  localStorage.setItem(key, JSON.stringify(myObj));
}

// Ler item:
function lerItem() {
  let key = "user";
  let myItem = JSON.parse(localStorage.getItem(key));
  console.log(myItem);
}

async function cadidatarVaga(idVaga, idCandidato) {
  idVaga = 3;
  idCandidato = 2;

  const response = await fetch(`${url}/vagas/${idVaga}`);
  vaga = await response.json();
  const c = vaga.candidatos;

  try {
    const json = {
      id: vaga.id,
      titulo: vaga.titutlo,
      descricao: vaga.descricao,
      remuneracao: vaga.remuneracao,
      candidatos: [...c, idCandidato]
    };

    fetch(`${url}/vagas/${idVaga}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
  } catch (error) {
    console.error(error);
  }
}

function getInscritos(id){
    let idVaga = parseInt(id);
    const vagaFiltrada = dataVagas.filter(vaga => parseInt(vaga.id) === idVaga);
    console.log(vagaFiltrada)
    const candidatoFiltrado = dataUsers.filter(users => vagaFiltrada[0].candidatos.includes(users.id))
    document.getElementById('id-vacancy').innerText = vagaFiltrada[0].id;
    document.getElementById('title-vacancy').innerText = vagaFiltrada[0].titulo;
  document.getElementById('description-vacancy').innerText = vagaFiltrada[0].descricao;
  document.getElementById('remuneration-vacancy').innerText = `R$ ${(vagaFiltrada[0].remuneracao).toString()}`;
  
  candidatoFiltrado.map(el => 
    
    document.getElementById('candidates').innerHTML += `
    <div class="content-container-button">
    <a href="#">
    <p>${el.nome}</p>
    <p>${el.nascimento}</p>
    </a>
    <button class="btn-disapproved btn-secondary ">teste</button>
    </div>
    `
    )
}
// criandoVaga = document.getElementById('AQUI FICA O ID DA DIV QUE VAI RECEBER OS ELEMENTOS').insertAdjacentElement('beforeend', `
//     <div class="content-container">
//         <a href="${link-vaga}">
//             <p>${titulo-vaga}</p>
//             <p>${salario-vaga}</p>
//         </a>
//     </div>
// `)
