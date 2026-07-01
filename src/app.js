const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const userRoutes = require("./routes/userRoutes.js");
const pool = require("./config/pool.js");
const app = express();
const PORT = process.env.PORT || 3006;


app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    mensagem: "API de Gerenciamento de Usuários",
    versao: "1.0.0",
    endpoints: {
      ListarTodos: "GET /users",
      BuscarPorId: "GET /users/:id",
      CriarUsuario: "POST /users"
    }
  });
});

app.use("/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: "Rota não encontrada",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;