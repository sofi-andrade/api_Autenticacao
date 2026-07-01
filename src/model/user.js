class User {
  constructor(id, nome, email, senha, permissao_id, admin_id){
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.permissao_id = permissao_id;
  }
}

module.exports = User;