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

let dataUsers = [];
var dataVagas = [];
let dataCandidaturas = [];

const onLoadPage = async () => {
  await getUsers();
  //console.log(dataUsers);
  await getVagas();
  //console.log(dataVagas);
  await getCandidaturas();
  //console.log(dataCandidaturas);
};

async function getUsers() {
  const response = await fetch(`${url}/users`);
  dataUsers = await response.json();

  // console.log(dataUsers);
}
async function getVagas() {
  const response = await fetch(`${url}/vagas`);
  dataVagas = await response.json();

  //console.log(dataVagas);
}
async function getCandidaturas() {
  const response = await fetch(`${url}/candidatura`);
  dataCandidaturas = await response.json();

  return dataCandidaturas;
}

async function deleteVaga(id) {
  await fetch(`${url}/vagas/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function fazerLogin(emailLogin, senhaLogin) {
  if (!emailLogin && !senhaLogin) {
    emailLogin = document.getElementById("emailLogin").value;
    senhaLogin = document.getElementById("senhaLogin").value;
  }

  if (!emailLogin) return alert("Email não pode estar vazio");

  if (!senhaLogin) return alert("Campo senha não pode estar vazio");

  let user = dataUsers.find((item) => {
    if (emailLogin == item.email && senhaLogin == item.senha) return item;
  });

  if (!user)
    document.getElementById("login-error").innerText = "USUÁRIO NÃO CADASTRADO";
  else {
    localStorage.setItem(
      "user",
      JSON.stringify({ email: user.email, id: user.id, logado: true })
    );
    if (user.tipo == "candidato") {
      window.location.href = "./pages/home-candidato.html";
    } else {
      window.location.href = "./pages/home-recrutador.html";
    }
  }
}

function logOut() {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
}

// if (document.getElementById("form-signup") != null) {
//   document.getElementById("form-signup").addEventListener("submit", postSignup);
// }

let formUser = document.getElementById("form-signup");
if (formUser) {
  formUser.addEventListener("submit", async (event) => {
    event.preventDefault();
    await postSignup(event);
  });
}

async function postSignup(event) {
  let data = new FormData(event.target).entries();
  let userSignup = Object.fromEntries(data);

  try {
    let dataFormatada = userSignup.birthDate.split("-");

    const json = {
      tipo: userSignup.typeUser,
      nome: userSignup.nameUser,
      dataNascimento: `${dataFormatada[0]}/${dataFormatada[1] - 1}/${
        dataFormatada[2]
      }`,
      email: userSignup.email,
      senha: userSignup.password,
      candidaturas: [],
    };

    await fetch(`${url}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });

    window.location.href = "../index.html";
    //apos cadastro, loga o usuario
    //await fazerLogin(userSignup.email, userSignup.password);
  } catch (error) {
    console.error(error);
  }
}

function deleteVaga() {
  const url2 = window.location.href;
  const id2 = url2.split("").splice(url2.lastIndexOf("="), 3);
  id2.shift();
  const id3 = id2.join("");

  fetch(`${url}/vagas/${id3}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function listarVagas(tipoUser) {
  await onLoadPage();

  let userToken = JSON.parse(localStorage.getItem("user"));

  if (tipoUser == "recrutador") {
    dataVagas.map((item) => {
      return document
        .getElementById("containerListaDeVagas")
        .insertAdjacentHTML(
          "beforeend",
          `<div class="content-container">
      <a href="./vaga-recrutador.html?id=${item.id}">
      <p>${item.titulo}</p>
      <p>R$ ${item.remuneracao}</p>
      </a>
      </div>`
        );
    });
  } else {
    let user = dataUsers.find((item) => {
      if (item.id == userToken.id) return item;
    });

    let candidaturas = user.candidaturas.sort((a, b) => a - b);

    if (!candidaturas) {
      dataVagas.map((item) => {
        createComponentVagas(
          "vaga-nao-cadastrado",
          item.titulo,
          item.id,
          item.remuneracao
        );
      });
    } else {
      dataVagas.map((item) => {
        if (candidaturas.find((el) => el == item.id)) {
          if (
            dataCandidaturas.find((cand) => {
              if (cand.id == item.id && cand.reprovado) {
                return cand;
              }
            })
          ) {
            return createComponentVagas(
              "vaga-reprovado",
              item.titulo,
              item.id,
              item.remuneracao
            );
          }
          createComponentVagas(
            "vaga-cadastrado",
            item.titulo,
            item.id,
            item.remuneracao
          );
        } else {
          createComponentVagas(
            "vaga-nao-cadastrado",
            item.titulo,
            item.id,
            item.remuneracao
          );
        }
      });
    }
  }
}

const createComponentVagas = (rota, titulo, id, remuneracao) => {
  return document.getElementById("containerListaDeVagas").insertAdjacentHTML(
    "beforeend",
    `<div class="content-container">
<a href="./${rota}.html?id=${id}">
<p>${titulo}</p>
<p>R$ ${remuneracao}</p>
</a>
</div>`
  );
};

// if(document.getElementById('containerListaDeVagas') !== null){
//   listarVagas()
// }

function postVaga() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const salary = document.getElementById("salary").value;

  try {
    if (title === "" || description === "" || salary === "") {
      throw new Error("campos vazios");
    }

    const json = {
      titulo: title,
      descricao: description,
      remuneracao: salary,
    };

    fetch(`${url}/vagas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
    window.location.href = "./home-recrutador.html";
  } catch (error) {
    console.error(error);
  }
}

function redirecionarTelaVaga() {
  window.location.href = "./cadastrar-vaga.html";
}

//window.addEventListener('load',() => redirecionarVagaEspecifica())

function redirecionarVagaEspecifica() {
  const url2 = window.location.href;
  const id2 = url2.split("").splice(url2.lastIndexOf("="), 3);
  id2.shift();
  const id3 = id2.join("");
  let userTipo;

  if (dataUsers.length > 0) {
    userTipo = dataUsers.filter((user) => lerItem().email == user.email);
    getInscritos(id3, userTipo[0].tipo);
  } else {
    redirecionarVagaEspecifica();
    console.error("vixe");
  }
}

// Ideia para verificar usuario logado
// Criar item:
function gravarItem(email, id) {
  let key = "user";
  let myObj = {
    id: id,
    email: email,
    logado: true,
  };
  localStorage.setItem(key, JSON.stringify(myObj));
}

// Ler item:
function lerItem() {
  let key = "user";
  let myItem = JSON.parse(localStorage.getItem(key));
  return myItem;
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
      candidatos: [...c, idCandidato],
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

function getInscritos(id, tipo) {
  console.log(dataVagas);
  console.log("getInscritos", tipo);

  if (dataVagas.length > 0) {
    let idVaga = parseInt(id);
    const vagaFiltrada = dataVagas.filter(
      (vaga) => parseInt(vaga.id) === idVaga
    );
    const candidatoFiltrado = dataUsers.filter((users) =>
      vagaFiltrada[0].candidatos.includes(users.id)
    );
    document.getElementById("id-vacancy").innerText = vagaFiltrada[0].id;
    document.getElementById("title-vacancy").innerText = vagaFiltrada[0].titulo;
    document.getElementById("description-vacancy").innerText =
      vagaFiltrada[0].descricao;
    document.getElementById(
      "remuneration-vacancy"
    ).innerText = `R$ ${vagaFiltrada[0].remuneracao.toString()}`;
    if (tipo == "recrutador") {
      console.log("RECRUTADOR");
      candidatoFiltrado.map(
        (el) =>
          (document.getElementById("candidates").innerHTML += `
      <div class="content-container-button">
      <a href="#">
      <p>${el.nome}</p>
      <p>${el.nascimento}</p>
      </a>
      <button class="btn-disapproved btn-secondary " onclick="reprovarCandidato(${vagaFiltrada[0].id}, ${el.id})">Reprovar</button>
      </div>
      `)
      );
    } else if (tipo == "candidato") {
      console.log("CANDIDATO");
      candidatoFiltrado.map(
        (el) =>
          (document.getElementById("candidates").innerHTML += `
      <div class="content-container-button">
      <a href="#">
      <p>${el.nome}</p>
      <p>${el.nascimento}</p>
      </a>
      </div>
      `)
      );
    }
  } else {
    setTimeout(() => {
      getInscritos(id);
    }, 200);
  }
}

function reprovarCandidato(idVaga, idCandidato) {
  const candidatura = dataCandidaturas.filter(
    (candidatura) =>
      candidatura.idVaga === idVaga && candidatura.idCandidato === idCandidato
  );
  candidatura[0].reprovado = true;

  try {
    const json = {
      reprovado: candidatura[0].reprovado,
    };

    fetch(`${url}/candidatura/${candidatura[0].id}`, {
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

// criandoVaga = document.getElementById('AQUI FICA O ID DA DIV QUE VAI RECEBER OS ELEMENTOS').insertAdjacentElement('beforeend', `
//     <div class="content-container">
//         <a href="${link-vaga}">
//             <p>${titulo-vaga}</p>
//             <p>${salario-vaga}</p>
//         </a>
//     </div>
// `)
