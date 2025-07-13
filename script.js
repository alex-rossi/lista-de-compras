const form = document.getElementById("form");
const itemInput = document.getElementById("itemInput");
const valorInput = document.getElementById("valorInput");
const lista = document.getElementById("lista");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = itemInput.value.trim();
  let valor = parseFloat(valorInput.value.trim());

  if (nome === "") return;
  if (isNaN(valor)) valor = 0;

  const item = { nome, valor };
  adicionarItem(item);
  salvarLista();
  atualizarTotal();

  itemInput.value = "";
  valorInput.value = "";
  itemInput.focus();
});

function adicionarItem(item) {
  const { nome, valor } = item;
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = valor > 0 ? `${nome} - R$ ${valor.toFixed(2)}` : nome;
  span.classList.add("texto-item");

  span.addEventListener("click", () => {
    li.classList.toggle("comprado");
  });

  const botaoEditar = document.createElement("button");
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", () =>
    editarItem(span, botaoEditar, li)
  );

  const botaoRemover = document.createElement("button");
  botaoRemover.textContent = "Remover";
  botaoRemover.addEventListener("click", () => {
    lista.removeChild(li);
    salvarLista();
    atualizarTotal();
  });

  li.appendChild(span);
  li.appendChild(botaoEditar);
  li.appendChild(botaoRemover);
  lista.appendChild(li);
}

function editarItem(span, botaoEditar, li) {
  const texto = span.textContent;
  let nomeAtual = texto;
  let valorAtual = 0;

  if (texto.includes(" - R$ ")) {
    const partes = texto.split(" - R$ ");
    nomeAtual = partes[0];
    valorAtual = parseFloat(partes[1].replace(",", "."));
  }

  const inputNome = document.createElement("input");
  inputNome.type = "text";
  inputNome.value = nomeAtual;

  const inputValor = document.createElement("input");
  inputValor.type = "number";
  inputValor.step = "0.01";
  inputValor.value = valorAtual > 0 ? valorAtual.toFixed(2) : "";

  li.innerHTML = "";
  li.appendChild(inputNome);
  li.appendChild(inputValor);

  const botaoSalvar = document.createElement("button");
  botaoSalvar.textContent = "Salvar";

  botaoSalvar.addEventListener("click", () => {
    const novoNome = inputNome.value.trim();
    const novoValor = parseFloat(inputValor.value.trim());

    if (novoNome !== "") {
      const novoSpan = document.createElement("span");
      novoSpan.textContent =
        !isNaN(novoValor) && novoValor > 0
          ? `${novoNome} - R$ ${novoValor.toFixed(2)}`
          : novoNome;
      novoSpan.classList.add("texto-item");

      novoSpan.addEventListener("click", () => {
        li.classList.toggle("comprado");
      });

      const novoBotaoEditar = document.createElement("button");
      novoBotaoEditar.textContent = "Editar";
      novoBotaoEditar.addEventListener("click", () =>
        editarItem(novoSpan, novoBotaoEditar, li)
      );

      const botaoRemover = document.createElement("button");
      botaoRemover.textContent = "Remover";
      botaoRemover.addEventListener("click", () => {
        lista.removeChild(li);
        salvarLista();
        atualizarTotal();
      });

      li.innerHTML = "";
      li.appendChild(novoSpan);
      li.appendChild(novoBotaoEditar);
      li.appendChild(botaoRemover);

      salvarLista();
      atualizarTotal();
    }
  });

  li.appendChild(botaoSalvar);
}

function atualizarTotal() {
  let total = 0;

  const spans = document.querySelectorAll("#lista span");
  spans.forEach((span) => {
    const texto = span.textContent;
    const partes = texto.split(" - R$ ");
    if (partes.length === 2) {
      const valor = parseFloat(partes[1].replace(",", "."));
      if (!isNaN(valor)) {
        total += valor;
      }
    }
  });

  document.getElementById("total").textContent = `Total: R$ ${total.toFixed(
    2
  )}`;
}

function salvarLista() {
  const itens = [];

  const spans = document.querySelectorAll("#lista span");
  spans.forEach((span) => {
    const texto = span.textContent;
    let nome = texto;
    let valor = 0;

    if (texto.includes(" - R$ ")) {
      const partes = texto.split(" - R$ ");
      nome = partes[0];
      valor = parseFloat(partes[1].replace(",", "."));
    }

    itens.push({ nome, valor });
  });

  localStorage.setItem("listaCompras", JSON.stringify(itens));
}

function limparLista() {
  localStorage.removeItem("listaCompras");
  lista.innerHTML = "";
  atualizarTotal();
}

document.addEventListener("DOMContentLoaded", () => {
  const dadosSalvos = localStorage.getItem("listaCompras");
  if (dadosSalvos) {
    const itens = JSON.parse(dadosSalvos);
    itens.forEach((item) => adicionarItem(item));
    atualizarTotal();
  }
});
