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
            document.getElementById('logado').innerText = 'LOGADO'
        }
    } else {
        document.getElementById('logado').innerText = 'USUÁRIO NÃO CADASTRADO'
    }
}