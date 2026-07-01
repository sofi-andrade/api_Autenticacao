const pool = require("../config/pool");

const ListarUsuarios = async (req, res) => {
    try {
        const [resultado] = await pool.query(
            `SELECT u.id, u.nome, u.email, p.nome AS nivel_permissao 
             FROM users u
             INNER JOIN permissoes p ON u.permissao_id = p.id`
        );

        return res.status(200).json({
            sucesso: true,
            total: resultado.length,
            dados: resultado.map((u) => ({
                id: u.id,
                nome: u.nome,
                email: u.email,
                permissao: u.nivel_permissao
            }))
        });
    } catch (error) {
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao listar usuários",
            erro: error.message,
        });
    }
};

const BuscarUsuarioPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID inválido. Deve ser um número inteiro",
            });
        }

        const [usuarios] = await pool.query(
            `SELECT u.id, u.nome, u.email, p.nome AS nivel_permissao 
             FROM users u
             INNER JOIN permissoes p ON u.permissao_id = p.id 
             WHERE u.id = ?`,
            [id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: `Usuário com o id ${id} não encontrado`,
            });
        }

        return res.status(200).json({
            sucesso: true,
            dados: usuarios[0], // Retorna o objeto direto do usuário encontrado
        });
    } catch (error) {
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao buscar usuário por id",
            erro: error.message,
        });
    }
};


const adicionarUsuario = async (req, res) => {
    try {
        const { nome, email, senha, permissao_id } = req.body;

        if (!nome || !email || !senha || !permissao_id) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Erro ao adicionar usuário",
                erro: "Todos os campos (nome, email, senha, permissao_id) são obrigatórios."
            });
        }

        await pool.query(
            "INSERT INTO users (nome, email, senha, permissao_id) VALUES (?, ?, ?, ?)",
            [nome, email, senha, permissao_id]
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: "Usuário adicionado com sucesso"
        });
    } catch (error) {
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao adicionar usuário",
            erro: error.message
        });
    }
};

const gerarToken = require("../middleware/jwt");

const login = async (req, res) => {

    const { email, senha } = req.body;

    const [usuarios] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (usuarios.length == 0) {
        return res.status(401).json({
            mensagem: "Usuário não encontrado"
        });
    }

    const usuario = usuarios[0];

    if (usuario.senha != senha) {
        return res.status(401).json({
            mensagem: "Senha incorreta"
        });
    }

    const token = gerarToken(usuario);

    return res.json({
        token
    });

}

module.exports = {
    ListarUsuarios,
    BuscarUsuarioPorId,
    adicionarUsuario,
    login
};