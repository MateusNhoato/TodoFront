const adicionarTodoBotao = document.querySelector("#add-button");
const novoTodoInput = document.querySelector("#novo-todo");
const descricaoInput = document.querySelector("#descricao");
const todosContainer = document.querySelector("#todos-container");

function adicionarTodoNoDocumento(todo){
    let bodyData = {
        "id": todo['id'],
        "nome": todo['nome'],
    "descricao": todo['descricao'],
    "concluida": todo['concluida']
    }

    const nomeTodo = document.createElement('h3');
    nomeTodo.innerText = todo['nome'];

    const descricaoTodo = document.createElement('p');
    descricaoTodo.innerText = todo['descricao'];

    const concluidaTodo = todo['concluida']; 

    const novoTodo = document.createElement('div');
    novoTodo.classList.add("todo-container");
    
    const botaoRemover = document.createElement('button');
    botaoRemover.classList.add("remove");
    botaoRemover.innerHTML= '<img src="icons/cross.png" alt="remover" >';

    
    botaoRemover.addEventListener('click', async function(event){
        removeTodo(event, todo['id'], novoTodo)
    });

    const botaoCheck = document.createElement('button');
    botaoCheck.classList.add("add");
    botaoCheck.innerHTML= '<img src="icons/check.png" alt="check" >';

    botaoCheck.addEventListener('click', async function(event){
        mudarConcluidaTodo(event, todo['id'], bodyData, novoTodo)
    });

    const botaoEditar = document.createElement('button');
    botaoEditar.innerHTML= '<img src="icons/edit.png" alt="editar" >';
    botaoEditar.classList.add("edit");
    
    botaoEditar.addEventListener('click', async function(event){
        editarTodo(event, todo['id'], bodyData)
    });


    const botaoReativar = document.createElement('button');
    botaoReativar.innerHTML= '<img src="icons/return.png" alt="reativar" >';
    botaoReativar.classList.add("reativar");

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

async function removeTodo(event, id, todo){
        event.preventDefault();
        try{
            const response = await fetch(`https://localhost:7104/Todos/${id}`, {
                method: "DELETE",
            });
            console.log(response);
            todosContainer.removeChild(novoTodo);
        }catch { (erro) =>
            // se ocorrer erros
            console.log(erro);
        }
        todosContainer.removeChild(todo);
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

    let bodyData = {
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
                body: JSON.stringify(bodyData),
            });
            const data = await response.json();
            bodyData['id'] = data['id'];

            console.log(response);
        }catch { (erro) =>
            // se ocorrer erros
            console.log(erro);
        }


   
    novoTodoInput.value = "";
    descricaoInput.value = "";
    adicionarTodoNoDocumento(bodyData);
}

async function mudarConcluidaTodo(event, id, todoBody, todoDocument){
    {
        event.preventDefault();
        
        if(todoBody['concluida'] === true)
            {
                // request
                todoBody['concluida'] = false;

                // documento
                todoDocument.querySelector('.reativar').hidden = true;
                todoDocument.querySelector('.add').hidden = false;
                todoDocument.querySelector('.edit').hidden = false;           
            }
        else
            {
                // request
                todoBody['concluida'] = true;

                // documento
                todoDocument.querySelector('.reativar').hidden = false;
                todoDocument.querySelector('.add').hidden = true;
                todoDocument.querySelector('.edit').hidden = true;
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

async function editarTodo(event, id, todo)
    {
        event.preventDefault();
        
        descricaoInput.value = todo['descricao'];
        novoTodoInput.value = todo['nome'];
        
        const confirmarEdicao = document.createElement('button');
        confirmarEdicao.addEventListener('click', async function(e){

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


