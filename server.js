const express = require('express')

const app = express();
const PORT = 3000;

const path = require('path');

app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em localhost:${PORT}`);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/contato', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contato.html'));
});

app.post('/contato', (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;

  if (!nome || !email || !assunto || !mensagem) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  res.status(200).json({
    mensagem: 'Contato recebido com sucesso!',
    dados: { nome, email, assunto, mensagem }
  });
});


app.get('/sugestao', (req, res) => {
  const nome = req.query.nome;
  const ingredientes = req.query.ingredientes;

  const respostaHTML = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Sugestão recebida</title>
      <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
      <h1>Obrigado pela sua sugestão, ${nome}!</h1>
      <p>Você sugeriu o seguinte lanche com os ingredientes:</p>
      <blockquote>${ingredientes}</blockquote>
      <a href="/">Voltar à página inicial</a>
    </body>
    </html>
  `;

  res.send(respostaHTML);
});

app.post('/contato', (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;

  const respostaHTML = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Mensagem Recebida</title>
      <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
      <h1>Mensagem recebida com sucesso</h1>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Assunto:</strong> ${assunto}</p>
      <p><strong>Mensagem:</strong></p>
      <blockquote>${mensagem}</blockquote>
      <a href="/">Voltar à página inicial</a>
    </body>
    </html>
  `;

  res.send(respostaHTML);
});

const fs = require('fs');


app.get('/api/lanches', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'data', 'lanches.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo de lanches:', err);
      return res.status(500).json({ erro: 'Erro ao acessar os dados dos lanches.' });
    }

    try {
      const lanches = JSON.parse(data);
      res.status(200).json(lanches);
    } catch (e) {
      console.error('Erro ao interpretar o JSON:', e);
      res.status(500).json({ erro: 'Erro ao processar os dados dos lanches.' });
    }
  });
});