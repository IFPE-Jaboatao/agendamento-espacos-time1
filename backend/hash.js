const bcrypt = require("bcrypt");

(async () => {
  const hash = await bcrypt.hash("123", 10);
  console.log(hash);
})();

// INSERT INTO usuarios (
//   login,
//   senha,
//   nome,
//   email,
//   perfil,
//   criado_em
// ) VALUES (
//   'admin',
//   '$2b$10$vEQBUsDjGVJBU.odfI8lder5UN6ypkmikHNJ/twq/QtISchzYjZVa',
//   'Administrador',
//   'admin@email.com',
//   'admin',
//   NOW()
// );