const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {

    const authHeader = req.headers.authorization;
    console.log("Headers recebidos:", req.headers);
    if (!authHeader) {
        return res.status(401).json({
            mensagem: "Token não informado"
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const usuario = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = usuario;

        next();

    } catch {

        return res.status(401).json({
            mensagem: "Token inválido"
        });

    }

}

module.exports = verificarToken;