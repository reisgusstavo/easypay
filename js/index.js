// Alternar entre login e cadastro
const loginForm = document.getElementById("loginForm");
const cadastroForm = document.getElementById("cadastroForm");
const linkCadastro = document.getElementById("linkCadastro");
const linkLogin = document.getElementById("linkLogin");

linkCadastro.addEventListener("click", () => {
  loginForm.style.display = "none";
  cadastroForm.style.display = "flex";
});

linkLogin.addEventListener("click", () => {
  cadastroForm.style.display = "none";
  loginForm.style.display = "flex";
});

// Cadastrar usuário
cadastroForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("nomeCadastro").value;
  const email = document.getElementById("emailCadastro").value;
  const senha = document.getElementById("senhaCadastro").value;

  const usuario = { nome, email, senha };

  localStorage.setItem("usuario", JSON.stringify(usuario));
  alert("Cadastro realizado com sucesso!");
  
  cadastroForm.reset();
  cadastroForm.style.display = "none";
  loginForm.style.display = "flex";
});

// Fazer login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));

  if (!usuarioSalvo) {
    alert("Nenhum usuário cadastrado!");
    return;
  }

  if (email === usuarioSalvo.email && senha === usuarioSalvo.senha) {
    alert(`Bem-vindo, ${usuarioSalvo.nome}!`);
    window.location.href = "home.html"; // redireciona para a página principal
  } else {
    alert("E-mail ou senha incorretos!");
  }
});
