// ===================== VARIÁVEIS =====================
let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let registros = JSON.parse(localStorage.getItem("registros")) || [];

// ===================== NAVEGAÇÃO =====================
function mostrarSecao(id) {
  document.querySelectorAll('.secao').forEach(sec => sec.classList.remove('ativa'));
  document.getElementById(id).classList.add('ativa');
  atualizarSelects();
  atualizarTabelaFuncionarios();
  atualizarTabelaServicos();
}

// ===================== FUNCIONÁRIOS =====================

// Cadastrar funcionário
function cadastrarFuncionario() {
  const nome = document.getElementById('nomeFuncionario').value.trim();
  const cpf = document.getElementById('cpfFuncionario').value.trim();
  const dataNasc = document.getElementById('dataNascFuncionario').value;
  const telefone = document.getElementById('telefoneFuncionario').value.trim();

  if (!nome || !cpf || !dataNasc || !telefone) {
    return alert("Preencha todos os campos!");
  }

  funcionarios.push({ nome, cpf, dataNasc, telefone });
  localStorage.setItem("funcionarios", JSON.stringify(funcionarios));

  alert("Funcionário cadastrado com sucesso!");
  limparCamposFuncionario();
  atualizarTabelaFuncionarios();
  atualizarSelects();
}

// Limpar campos de funcionário
function limparCamposFuncionario() {
  document.getElementById('nomeFuncionario').value = "";
  document.getElementById('cpfFuncionario').value = "";
  document.getElementById('dataNascFuncionario').value = "";
  document.getElementById('telefoneFuncionario').value = "";
}

// Excluir funcionário
function excluirFuncionario(index) {
  if (confirm("Deseja realmente excluir este funcionário?")) {
    funcionarios.splice(index, 1);
    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
    atualizarTabelaFuncionarios();
    atualizarSelects();
  }
}

// Atualizar tabela de funcionários
function atualizarTabelaFuncionarios() {
  const tabela = document.getElementById('tabelaFuncionarios');
  tabela.innerHTML = `
    <tr>
      <th>Nome</th>
      <th>CPF</th>
      <th>Nascimento</th>
      <th>Telefone</th>
      <th>Ações</th>
    </tr>
  `;

  funcionarios.forEach((f, index) => {
    tabela.innerHTML += `
      <tr>
        <td>${f.nome}</td>
        <td>${f.cpf}</td>
        <td>${f.dataNasc}</td>
        <td>${f.telefone}</td>
        <td><button onclick="excluirFuncionario(${index})">Excluir</button></td>
      </tr>
    `;
  });
}

// ===================== SERVIÇOS =====================

// Cadastrar serviço
function cadastrarServico() {
  const nome = document.getElementById('nomeServico').value.trim();
  const valor = document.getElementById('valorServicoCadastro').value.trim();

  if (!nome || !valor) return alert("Preencha o nome e o valor do serviço!");

  servicos.push({ nome, valor });
  localStorage.setItem("servicos", JSON.stringify(servicos));

  alert("Serviço cadastrado com sucesso!");
  limparCamposServico();
  atualizarTabelaServicos();
  atualizarSelects();
}

// Limpar campos de serviço
function limparCamposServico() {
  document.getElementById('nomeServico').value = "";
  document.getElementById('valorServicoCadastro').value = "";
}

// Excluir serviço
function excluirServico(index) {
  if (confirm("Deseja realmente excluir este serviço?")) {
    servicos.splice(index, 1);
    localStorage.setItem("servicos", JSON.stringify(servicos));
    atualizarTabelaServicos();
    atualizarSelects();
  }
}

// Atualizar tabela de serviços
function atualizarTabelaServicos() {
  const tabela = document.getElementById('tabelaServicos');
  tabela.innerHTML = `
    <tr>
      <th>Nome</th>
      <th>Valor (R$)</th>
      <th>Ações</th>
    </tr>
  `;

  servicos.forEach((s, index) => {
    tabela.innerHTML += `
      <tr>
        <td>${s.nome}</td>
        <td>${s.valor}</td>
        <td>
          <button onclick="excluirServico(${index})">Excluir</button>
          <button onclick="limparCamposServico()">Limpar</button>
        </td>
      </tr>
    `;
  });
}

// ===================== REGISTRO DE SERVIÇOS =====================

// Atualiza selects de funcionário e serviço
function atualizarSelects() {
  const funcionarioSelect = document.getElementById('funcionarioSelect');
  const servicoSelect = document.getElementById('servicoSelect');

  funcionarioSelect.innerHTML = funcionarios
    .map(f => `<option value="${f.nome}">${f.nome}</option>`)
    .join("");

  servicoSelect.innerHTML = servicos
    .map((s, index) => `<option value="${index}">${s.nome} - R$ ${s.valor}</option>`)
    .join("");
}

// Registrar serviço
function registrarServico() {
  const data = document.getElementById('dataServico').value;
  const funcionario = document.getElementById('funcionarioSelect').value;
  const servicoIndex = document.getElementById('servicoSelect').value;
  const valor = document.getElementById('valorServico').value;

  if (!data || !funcionario || servicoIndex === "" || !valor) {
    return alert("Preencha todos os campos!");
  }

  const servicoSelecionado = servicos[servicoIndex];

  registros.push({
    data,
    funcionario,
    servico: servicoSelecionado.nome,
    valor
  });

  localStorage.setItem("registros", JSON.stringify(registros));
  alert("Serviço registrado com sucesso!");
}

// Quando mudar o select, preencher o valor automaticamente
document.getElementById('servicoSelect').addEventListener('change', () => {
  const index = document.getElementById('servicoSelect').value;
  if (index !== "" && servicos[index]) {
    document.getElementById('valorServico').value = servicos[index].valor;
  }
});

// ===================== RELATÓRIO =====================

// Gerar relatório
function gerarRelatorio() {
  const inicio = document.getElementById('dataInicio').value;
  const fim = document.getElementById('dataFim').value;
  const relatorio = document.getElementById('relatorio');

  const filtrados = registros.filter(r => {
    return (!inicio || r.data >= inicio) && (!fim || r.data <= fim);
  });

  if (filtrados.length === 0) {
    relatorio.innerHTML = "<p>Nenhum registro encontrado.</p>";
    return;
  }

  let html = `
    <h3>Relatório de Serviços</h3>
    <table border="1" cellspacing="0" cellpadding="5">
      <tr>
        <th>Data</th>
        <th>Funcionário</th>
        <th>Serviço</th>
        <th>Valor (R$)</th>
      </tr>
  `;

  filtrados.forEach(r => {
    html += `
      <tr>
        <td>${r.data}</td>
        <td>${r.funcionario}</td>
        <td>${r.servico}</td>
        <td>${r.valor}</td>
      </tr>
    `;
  });

  html += "</table>";
  relatorio.innerHTML = html;
}

/// ======= GERAR PDF (CORRIGIDO) =======
document.getElementById('gerarPDF').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const relatorio = document.getElementById('relatorio');

  if (!relatorio.innerHTML.trim()) {
    return alert("Gere um relatório antes de exportar o PDF!");
  }

  // Converte o conteúdo em texto simples
  let texto = "Relatório de Serviços\n\n";
  texto += "Data\tFuncionário\tServiço\tValor (R$)\n";
  texto += "-------------------------------------------\n";

  const linhas = relatorio.querySelectorAll("table tr");
  linhas.forEach((linha, i) => {
    if (i === 0) return; // pula cabeçalho
    const colunas = linha.querySelectorAll("td");
    const data = colunas[0]?.innerText || "";
    const funcionario = colunas[1]?.innerText || "";
    const servico = colunas[2]?.innerText || "";
    const valor = colunas[3]?.innerText || "";
    texto += `${data}\t${funcionario}\t${servico}\t${valor}\n`;
  });

  // Adiciona ao PDF (texto simples)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(texto, 10, 10);

  doc.save("relatorio.pdf");
});

// Inicialização ao carregar a página
atualizarTabelaFuncionarios();
atualizarTabelaServicos();
atualizarSelects();
