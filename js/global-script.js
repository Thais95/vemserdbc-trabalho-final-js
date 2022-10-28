const url = "http://localhost:3000";

async function getUsers() {
  const response = await fetch(`${url}/users`);
  const data = await response.json();

  console.log(data);

}
async function getVagas() {
  const response = await fetch(`${url}/vagas`);
  const data = await response.json();

  console.log(data);
}
async function getCandidaturas() {
  const response = await fetch(`${url}/candidatura`);
  const data = await response.json();

  console.log(data);
}

getUsers();

getVagas();

getCandidaturas();

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

async function deleteVaga(id) {
    await fetch(`${url}/vagas/${id}`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
      },
    });
}