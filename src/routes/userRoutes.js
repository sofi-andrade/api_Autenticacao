const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
router.post("/login", userController.login);
const verificarToken = require("../middleware/auth");

router.get("/", verificarToken, userController.ListarUsuarios);
router.get("/:id", verificarToken, userController.BuscarUsuarioPorId);
router.post("/", verificarToken, userController.adicionarUsuario);

module.exports = router;