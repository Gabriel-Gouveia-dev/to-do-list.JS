let lista = document.getElementById("lista");
let input = document.getElementById("inputTarefa");
let contador = document.getElementById("contador");
let selectPrioridade = document.getElementById("prioridade");

let filtroAtual = "todas";

/* TEMA */
let botaoTema = document.getElementById("toggleTema");
let temaAtual = localStorage.getItem("tema") || "escuro";
document.body.classList.add(temaAtual);

botaoTema.onclick = () => {
  document.body.classList.toggle("claro");

  if (document.body.classList.contains("claro")) {
    localStorage.setItem("tema", "claro");
  } else {
    localStorage.setItem("tema", "escuro");
  }
};

/* CARREGAR */
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

/* SALVAR */
function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

/* FILTRO */
function setFiltro(filtro) {
  filtroAtual = filtro;
  renderizarTarefas();
}

/* RENDER */
function renderizarTarefas() {
  lista.innerHTML = "";

  /* BOTÃO ATIVO */
  let botoes = document.querySelectorAll(".filtros button");

  botoes.forEach(btn => {
    btn.classList.remove("ativo");

    if (btn.innerText.toLowerCase() === filtroAtual) {
      btn.classList.add("ativo");
    }
  });

  let tarefasFiltradas = tarefas
    .map((tarefa, index) => ({ ...tarefa, indexOriginal: index }))
    .filter(tarefa => {
      if (filtroAtual === "pendentes") return !tarefa.concluida;
      if (filtroAtual === "concluidas") return tarefa.concluida;
      return true;
    });

  tarefasFiltradas.forEach((tarefa) => {
    let li = document.createElement("li");

    /* TEXTO + PRIORIDADE */
    let span = document.createElement("span");
    span.innerText = tarefa.texto;
    span.classList.add(tarefa.prioridade);

    li.appendChild(span);

    if (tarefas[tarefa.indexOriginal].concluida) {
      li.classList.add("concluida");
    }

    /* CONCLUIR */
    li.onclick = () => {
      tarefas[tarefa.indexOriginal].concluida =
        !tarefas[tarefa.indexOriginal].concluida;

      salvarTarefas();
      renderizarTarefas();
    };

    /* EDITAR */
    let btnEditar = document.createElement("button");
    btnEditar.innerText = "✏️";

    btnEditar.onclick = (e) => {
      e.stopPropagation();

      let inputEditar = document.createElement("input");
      inputEditar.type = "text";
      inputEditar.value = tarefa.texto;

      li.innerHTML = "";
      li.appendChild(inputEditar);

      inputEditar.focus();

      function salvarEdicao() {
        let novoTexto = inputEditar.value.trim();

        if (novoTexto !== "") {
          tarefas[tarefa.indexOriginal].texto = novoTexto;
          salvarTarefas();
          renderizarTarefas();
        } else {
          renderizarTarefas();
        }
      }

      inputEditar.addEventListener("keypress", (e) => {
        if (e.key === "Enter") salvarEdicao();
      });

      inputEditar.addEventListener("blur", salvarEdicao);
    };

    /* REMOVER COM ANIMAÇÃO */
    let btn = document.createElement("button");
    btn.innerText = "X";

    btn.onclick = (e) => {
      e.stopPropagation();

      li.classList.add("removendo");

      setTimeout(() => {
        tarefas.splice(tarefa.indexOriginal, 1);
        salvarTarefas();
        renderizarTarefas();
      }, 300);
    };

    li.appendChild(btnEditar);
    li.appendChild(btn);
    lista.appendChild(li);
  });

  contador.innerText = `Total: ${tarefas.length} tarefas`;
}

/* ADICIONAR */
function adicionarTarefa() {
  if (input.value.trim() === "") return;

  tarefas.push({
    texto: input.value,
    concluida: false,
    prioridade: selectPrioridade.value
  });

  input.value = "";

  salvarTarefas();
  renderizarTarefas();
}

/* ENTER */
input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    adicionarTarefa();
  }
});

/* LIMPAR */
function limparTudo() {
  tarefas = [];
  salvarTarefas();
  renderizarTarefas();
}

/* INICIAR */
renderizarTarefas();