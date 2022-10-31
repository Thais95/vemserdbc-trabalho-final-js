/*NECESSARIO

Para instalar json server colocar no terminal:
npm install -g json-server
E rodar com:
json-server --watch db.json
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
  try {
    await fetch(`${url}/vagas/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    Window.location.href = "./home-recrutador.html";
  } catch (err) {}
}
function validaEmail(email) {
  const emailRegex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    "gm"
  );
  const isValidEmail = emailRegex.test(email);
  if (!isValidEmail) {
    document.getElementById("login-error").innerText = "Digite um email válido";
  }
}

async function fazerLogin(_email, _password) {
  await onLoadPage();
  let emailLogin;
  let senhaLogin;
  if (!_email && !_password) {
    emailLogin = document.getElementById("emailLogin").value;
    senhaLogin = document.getElementById("senhaLogin").value;
  } else {
    emailLogin = _email;
    senhaLogin = _password;
  }

  try {
    if (!emailLogin && !senhaLogin)
      throw new Error("Campos não podem estar vazios");

    if (!emailLogin) throw new Error("Campo de email não pode estar vazio");

    if (!senhaLogin) throw new Error("Campo de senha não pode estar vazio");

    if (senhaLogin.length < 4) throw new Error("Dados incorretos");

    let user = dataUsers.find((item) => {
      if (emailLogin == item.email && senhaLogin == item.senha) return item;
    });

    if (!user)
      document.getElementById("login-error").innerText =
        "Dados incorretos, por favor cheque seu email e senha";
    else {
      localStorage.setItem(
        "user",
        JSON.stringify({ email: user.email, id: user.id, logado: true })
      );
      if (user.tipo == "Candidato") {
        window.location.href = "./pages/home-candidato.html";
      } else {
        window.location.href = "./pages/home-recrutador.html";
      }
    }
  } catch (e) {
    document.getElementById("login-error").innerText = e.message;
  }
}

function logOut() {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
}

// if (document.getElementById("form-signup") != null) {
//   document.getElementById("form-signup").addEventListener("submit", postSignup);
// }

function capitalizeName(string) {
  string = string.toLowerCase().split(" ");
  string = string.map((n) => n.charAt(0).toUpperCase() + n.slice(1));
  return string.join(" ");
}

let formUser = document.getElementById("form-signup");
if (formUser) {
  formUser.addEventListener("submit", async (event) => {
    event.preventDefault();
    await postSignup(event);
  });
}

async function postSignup(event) {
  await onLoadPage();
  let data = new FormData(event.target).entries();
  let userSignup = Object.fromEntries(data);
  try {
    let dataFormatada = userSignup.birthDate.split("-");

    if (!userSignup.email)
      throw new Error("Campo de email não pode estar vazio");

    if (!userSignup.password)
      throw new Error("Campo de senha não pode estar vazio");

    if (!userSignup.birthDate) throw new Error("Preencha data de nascimento");

    if (userSignup.password.length < 4)
      throw new Error("Senha deve ter pelo menos 4 dígitos");

    if (dataUsers.length > 0) {
      const isCadastrado = dataUsers.find((item) => {
        if (userSignup.email == item.email) return item;
      });

      if (isCadastrado) throw new Error("Email já cadastrado");
    }

    const json = {
      tipo: userSignup.typeUser,
      nome: capitalizeName(userSignup.nameUser),
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
  } catch (e) {
    //document.getElementById("signup-error").innerText = e.message;
    console.error(e);
  }
}

async function deleteVaga() {
  const url2 = window.location.href;
  const id2 = url2.split("").splice(url2.lastIndexOf("="), 3);
  id2.shift();
  const id3 = id2.join("");

  var candidatura = dataCandidaturas.filter((item) => item.idVaga == id3);

  console.log(candidatura);
  await allFetchDelete(id3).then(
    () => (window.location.href = "./home-recrutador.html")
  );
}

const allFetchDelete = async (id3) => {
  try {
    var candidatura = dataCandidaturas.filter((item) => item.idVaga == id3);

    let allFetchCheck = 0;
    if (candidatura) {
      let user = dataUsers.map((item) => {
        item.candidaturas = item.candidaturas.filter((item) => item != id3);
        return item;
      });

      for (item of candidatura) {
        await fetch(`${url}/candidatura/${item.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }).then(() => allFetchCheck++);
      }

      for (item of user) {
        await fetch(`${url}/users/${item.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }).then(() => allFetchCheck++);
      }
    }

    await fetch(`${url}/vagas/${id3}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log(err);
  }
};

async function listarVagas(tipoUser) {
  await onLoadPage();

  let userToken = JSON.parse(localStorage.getItem("user"));

  if (dataVagas.length == 0)
    document.getElementById("component-empty").style.display = "flex";

  if (tipoUser == "recrutador") {
    dataVagas.map((item) => {
      return document.getElementById("vagas").insertAdjacentHTML(
        "afterbegin",
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
              if (
                cand.idVaga == item.id &&
                cand.reprovado == true &&
                cand.idCandidato == user.id
              ) {
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
  return document.getElementById("vagas").insertAdjacentHTML(
    "beforeend",
    `<div class="content-container">
<a href="./${rota}.html?id=${id}">
<p>${titulo}</p>
<p>R$ ${remuneracao}</p>
</a>
</div>`
  );
};

async function postVaga() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const salary = document.getElementById("salary").value;

  console.log(title);
  try {
    const json = {
      titulo: title,
      descricao: description,
      remuneracao: salary,
      candidatos: [],
    };

    await fetch(`${url}/vagas`, {
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

async function redirecionarVagaEspecifica() {
  await onLoadPage();
  const url2 = window.location.href;
  const id2 = url2.split("").splice(url2.lastIndexOf("="), 3);
  id2.shift();
  const id3 = id2.join("");
  let userTipo;

  userTipo = dataUsers.filter((user) => lerItem().email == user.email);
  getInscritos(id3, userTipo[0].tipo);
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

async function candidatarVaga() {
  await onLoadPage();
  let idCandidato = JSON.parse(localStorage.getItem("user")).id;
  const idVaga = window.location.href.split("=")[1];

  const response = await fetch(`${url}/vagas/${idVaga}`);
  vaga = await response.json();

  vaga.candidatos.push(idCandidato);

  try {
    let allFetchCheck = 0;

    const json = {
      id: vaga.id,
      titulo: vaga.titulo,
      descricao: vaga.descricao,
      remuneracao: vaga.remuneracao,
      candidatos: vaga.candidatos,
    };

    await fetch(`${url}/vagas/${idVaga}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    }).then(() => allFetchCheck++);

    let user = dataUsers.find((item) => item.id == idCandidato);
    user.candidaturas.push(parseInt(idVaga));

    await fetch(`${url}/users/${idCandidato}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then(() => allFetchCheck++);

    const jsonCandidatura = {
      idCandidato: parseInt(idCandidato),
      idVaga: parseInt(idVaga),
      reprovado: false,
    };

    await fetch(`${url}/candidatura`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonCandidatura),
    }).then(() => allFetchCheck++);
    console.log("teste");

    if (allFetchCheck == 3) window.location.href = "./home-candidato.html";
  } catch (error) {
    console.error(error);
  }
}

function getInscritos(id, tipo) {
  console.log(dataVagas);
  console.log(tipo);
  if (dataVagas.length > 0) {
    let idVaga = parseInt(id);
    const vagaFiltrada = dataVagas.filter(
      (vaga) => parseInt(vaga.id) == idVaga
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
    if (tipo == "Recrutador") {
      console.log("RECRUTADOR");
      candidatoFiltrado.map((el) => {
        if (
          dataCandidaturas.find((item) => {
            if (item.idCandidato == el.id && item.reprovado) return item;
          })
        ) {
          document.getElementById("candidates").innerHTML += `
      <div class="content-container-button">
      
      <p>${el.nome}</p>
      <p>${el.dataNascimento}</p>
    
      <button disabled type="button" id="${
        "btn-reprovado" + el.id
      }" class="btn-disapproved btn-disable" onclick="reprovarCandidato(${
            vagaFiltrada[0].id
          }, ${el.id})">Reprovar</button>
      </div>
      `;
        } else {
          document.getElementById("candidates").innerHTML += `
          <div class="content-container-button">
          
          <p>${el.nome}</p>
          <p>${el.dataNascimento}</p>
          
          <button type="button" id="${
            "btn-reprovado" + el.id
          }" class="btn-disapproved btn-secondary" onclick="reprovarCandidato(${
            vagaFiltrada[0].id
          }, ${el.id})">Reprovar</button>
          </div>
          `;
        }
      });
    } else if (tipo == "Candidato") {
      //console.log("CANDIDATO");
      //console.log(candidatoFiltrado);

      candidatoFiltrado.map(
        (el) => {
          // if (
          //   dataCandidaturas.find((item) => {
          //     if (item.idCandidato == el.id && item.reprovado) return item;
          //   })
          // ) {
          //   document.getElementById("candidates").innerHTML += `
          //     <div class="content-container content-container-disapproved">
          //     <a>
          //     <p>${el.nome}</p>
          //     <p>${el.dataNascimento}</p>
          //     </a>
          //     </div>
          //     `;
          // } else {
          document.getElementById("candidates").innerHTML += `
      <div class="content-container ">
      <a>
      <p>${el.nome}</p>
      <p>${el.dataNascimento}</p>
      </a>
      </div>
      `;
        }
        // }
      );
    }
  } else {
    setTimeout(() => {
      getInscritos(id);
    }, 200);
  }
}

const listarReprovado = async () => {
  await onLoadPage();

  let user = JSON.parse(localStorage.getItem("user"));
  user = dataUsers.find((item) => item.id == user.id);

  document.getElementById(
    "candidates"
  ).innerHTML += `<div class="content-container content-container-disapproved"><a><p>${user.nome}</p>
  <p>${user.dataNascimento}</p></a></div>`;
};

async function reprovarCandidato(idVaga, idCandidato) {
  let btn = document.getElementById(`btn-reprovado${idCandidato}`);
  btn.classList.add("btn-disable");
  btn.classList.remove("btn-secondary");

  console.log(`btn-reprovado${idCandidato}`);
  const candidatura = dataCandidaturas.filter(
    (candidatura) =>
      candidatura.idVaga === idVaga && candidatura.idCandidato === idCandidato
  );
  candidatura[0].reprovado = true;

  try {
    const json = {
      reprovado: candidatura[0].reprovado,
    };

    await fetch(`${url}/candidatura/${candidatura[0].id}`, {
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

async function cancelarCandidatura() {
  await onLoadPage();
  let id = new Map();

  const url2 = window.location.href;
  const id2 = url2.split("").splice(url2.lastIndexOf("="), 3);
  id2.shift();
  const id3 = id2.join("");

  if (id3.endsWith("#")) id3.shift();

  dataUsers.forEach((element) => {
    id.set(element.email, element.id);
  });

  let idCandidato = JSON.parse(localStorage.getItem("user")).id;
  console.log(id3);
  let candidatura = dataCandidaturas.find((item) => {
    console.log(idCandidato);
    if (idCandidato == item.idCandidato && item.idVaga == id3) return item;
  });
  console.log(candidatura);

  try {
    let allFetchCheck = 0;

    await fetch(`${url}/candidatura/${candidatura.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => allFetchCheck++);

    let vaga = dataVagas.find((item) => item.id == id3);
    vaga.candidatos = vaga.candidatos.filter((item) => item != idCandidato);

    //console.log(vaga);

    await fetch(`${url}/vagas/${id3}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vaga),
    }).then(() => allFetchCheck++);

    let user = dataUsers.find((item) => item.id == idCandidato);
    user.candidaturas = user.candidaturas.filter((item) => item != id3);
    console.log(user);

    await fetch(`${url}/users/${idCandidato}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then(() => allFetchCheck++);

    if (allFetchCheck == 3) window.location.href = "./home-candidato.html";
  } catch (err) {
    console.log(err);
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
