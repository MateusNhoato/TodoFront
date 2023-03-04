const novoTodoContainer = document.querySelector('#novo-todo-container');
const adicionarTodoBotao = document.querySelector("#add-button");
const novoTodoInput = document.querySelector("#novo-todo");
const descricaoInput = document.querySelector("#descricao");
const editarTodoBotao = document.querySelector('#edit-button');
const todosContainer = document.querySelector("#todos-container");

function adicionarTodoNoDocumento(todo){
    const nomeTodo = document.createElement('h3');
    nomeTodo.innerText = todo['nome'];

    const descricaoTodo = document.createElement('p');
    descricaoTodo.innerText = todo['descricao'];

    const concluidaTodo = todo['concluida']; 

    const novoTodo = document.createElement('div');
    novoTodo.classList.add("todo-container");
    
    const botaoRemover = document.createElement('button');
    botaoRemover.classList.add("remover");
    botaoRemover.innerHTML= '<img src="icons/cross.png" alt="remover" >';

    
    botaoRemover.addEventListener('click', async function(event){
        removeTodo(event, todo['id'], novoTodo)
    });

    const botaoCheck = document.createElement('button');
    botaoCheck.classList.add("check");
    botaoCheck.innerHTML= '<img src="icons/check.png" alt="check" >';

    botaoCheck.addEventListener('click', async function(event){
        mudarConcluidaTodo(event, todo['id'], todo, novoTodo)
    });

    const botaoEditar = document.createElement('button');
    botaoEditar.innerHTML= '<img src="icons/edit.png" alt="editar" >';
    botaoEditar.classList.add("editar");
    
    botaoEditar.addEventListener('click', async function(event){
        editarTodo(event, todo['id'], todo, novoTodo)
    });


    const botaoReativar = document.createElement('button');
    botaoReativar.innerHTML= '<img src="icons/return.png" alt="reativar" >';
    botaoReativar.classList.add("reativar");

    botaoReativar.addEventListener('click', async function(e){
        mudarConcluidaTodo(e, todo['id'], todo, novoTodo);
    });



    novoTodo.appendChild(nomeTodo);
    novoTodo.appendChild(descricaoTodo);
    novoTodo.appendChild(botaoCheck);
    novoTodo.appendChild(botaoEditar);
    novoTodo.appendChild(botaoReativar);
    
    if(concluidaTodo === false)
        {
            botaoReativar.hidden = true;
        }
    else{
        botaoCheck.hidden = true;
        botaoEditar.hidden = true;
    }
    novoTodo.appendChild(botaoRemover);
    todosContainer.appendChild(novoTodo);
};

function removerTodoDoDocumento(todo){
    todosContainer.removeChild(todo);
}

async function removeTodo(event, id, todo){
        event.preventDefault();
        try{
            const response = await fetch(`https://localhost:7104/Todos/${id}`, {
                method: "DELETE",
            });
        }catch { (erro) =>
            // se ocorrer erros
            console.log(erro);
        }
        removerTodoDoDocumento(todo);
}

async function postTodo(event){
    event.preventDefault();

    let todo = novoTodoInput.value;
    let desc = descricaoInput.value;

    if(todo.trim() === "" || desc.trim() === "")
        {
            alert("Informações inválidas.");
            return;
        }

    let novoTodo = {
        "nome": `${todo}`,
    "descricao": `${desc}`,
    "concluida": false
    }

        try{
            const response = await fetch("https://localhost:7104/Todos", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(novoTodo),
            });
            const data = await response.json();
            novoTodo['id'] = data['id'];

            console.log(response);
        }catch { (erro) =>
            // se ocorrer erros
            console.log(erro);
        }


   
    novoTodoInput.value = "";
    descricaoInput.value = "";
    adicionarTodoNoDocumento(novoTodo);
}

async function mudarConcluidaTodo(event, id, todoBody, todoDocument){
    {
        event.preventDefault();
        
        if(todoBody['concluida'] === true)
            {
                // request
                todoBody['concluida'] = false;

                // documento
                todoDocument.classList.remove('concluida');
                todoDocument.querySelector('.reativar').hidden = true;
                todoDocument.querySelector('.check').hidden = false;
                todoDocument.querySelector('.editar').hidden = false;           
            }
        else
            {
                // request
                todoBody['concluida'] = true;

                // documento
                todoDocument.classList.add('concluida');
                todoDocument.querySelector('.reativar').hidden = false;
                todoDocument.querySelector('.check').hidden = true;
                todoDocument.querySelector('.editar').hidden = true;
            }

        try{
            const response = await fetch(`https://localhost:7104/Todos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(todoBody),
            });
        }catch { (erro) =>
            // se ocorrer erros
            console.log(erro);
        }

    }
}

async function editarTodo(event, id, todo, todoDocument)
    {
        event.preventDefault();

        descricaoInput.value = todo['descricao'];
        novoTodoInput.value = todo['nome'];
        
        editarTodoBotao.hidden = false;
        adicionarTodoBotao.hidden = true;

        editarTodoBotao.addEventListener('click', async (e) =>{
            e.preventDefault();
            
            // editando as informações
            const nomeEditado = novoTodoInput.value;
            const descricaoEditada = descricaoInput.value;
            
            if(nomeEditado.trim() === "" || descricaoEditada.trim() === "")
            {
                alert("Informações inválidas.");
                return;
            }
    
        let todoBody = {
            "id": id,
            "nome": `${nomeEditado}`,
        "descricao": `${descricaoEditada}`,
        "concluida": false
        }
            try{
                const response = await fetch(`https://localhost:7104/Todos/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(todoBody),
                });
            }catch { (erro) =>
                // se ocorrer erros
                console.log(erro);
            }

            editarTodoBotao.hidden = true;
            adicionarTodoBotao.hidden = false;
            novoTodoInput.value = "";
            descricaoInput.value = "";

            removerTodoDoDocumento(todoDocument);
            adicionarTodoNoDocumento(todoBody);
    });
}


async function carregarToDos(){
    try{
        const response = await fetch("https://localhost:7104/Todos", {
            method: "GET",
        });
        
        const data = await response.json();

        data.forEach(element => {
            adicionarTodoNoDocumento(element);
        });

    }catch { (erro) =>
        // se ocorrer erros
        console.log(erro);
    }
}

adicionarTodoBotao.addEventListener("click", postTodo);

carregarToDos();


