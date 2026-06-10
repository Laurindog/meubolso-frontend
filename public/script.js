// URL do backend
const API_URL = "https://meubolso-backend-46es.onrender.com";

// TESTE DA API V1
async function testarAPI() {

  try {

    const resposta =
      await fetch(`${API_URL}/v1`);

    const dados =
      await resposta.json();

    document.getElementById("status-api").innerHTML = `
      <div class="success">
        ${dados.message}<br>
        ${dados.chamada_em}
      </div>
    `;

  } catch (erro) {

    document.getElementById("status-api").innerHTML = `
      <div class="error">
        Erro ao conectar API
      </div>
    `;

  }

}

// CARREGAR GASTOS
async function carregarGastos() {

  const container =
    document.getElementById("gastos");

  try {

    const response =
      await fetch(`${API_URL}/gastos`);

    const dados =
      await response.json();

    if (dados.gastos.length === 0) {

      container.innerHTML =
        "<p>Nenhum gasto cadastrado</p>";

      return;

    }

    let total = 0;

    container.innerHTML =
      dados.gastos.map(gasto => {

        total += Number(gasto.valor);

        return `
          <div class="gasto">

            <h3>${gasto.descricao}</h3>

            <p>💰 R$ ${gasto.valor}</p>

            <p>📂 ${gasto.categoria}</p>

            <p>📅 ${gasto.data}</p>

          </div>
        `;

      }).join("");

    document.getElementById("total").innerText =
      `R$ ${total.toFixed(2)}`;

  } catch (erro) {

    console.error(erro);

  }

}

// ADICIONAR GASTO
async function adicionarGasto() {

  const descricao =
    document.getElementById("descricao").value;

  const valor =
    document.getElementById("valor").value;

  const categoria =
    document.getElementById("categoria").value;

  const mensagem =
    document.getElementById("mensagem");

  if (!descricao || !valor) {

    mensagem.innerHTML =
      '<div class="error">Preencha descrição e valor</div>';

    return;

  }

  try {

    const response =
      await fetch(`${API_URL}/gastos`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          descricao,
          valor,
          categoria
        })

      });

    if (!response.ok) {

      throw new Error(
        "Erro ao adicionar gasto"
      );

    }

    mensagem.innerHTML =
      '<div class="success">Gasto adicionado!</div>';

    document.getElementById("descricao").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("categoria").value = "";

    carregarGastos();

  } catch (erro) {

    mensagem.innerHTML =
      '<div class="error">Erro ao adicionar gasto</div>';

  }

}

// INICIAR
document.addEventListener(
  "DOMContentLoaded",
  () => {
    carregarGastos();
    testarAPI();
  }
);