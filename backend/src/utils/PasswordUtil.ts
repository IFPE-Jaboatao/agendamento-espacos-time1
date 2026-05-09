import bcrypt from "bcrypt";

/**
 * Utilitário responsável por lidar com senhas
 * Evita repetir bcrypt em vários services
 */
export class PasswordUtil {

  /**
   * Gera hash seguro da senha
   */
  static hash(senha: string) {
    return bcrypt.hash(senha, 10);
  }

  /**
   * Compara senha digitada com hash do banco
   */
  static compare(senha: string, hash: string) {
    return bcrypt.compare(senha, hash);
  }
}