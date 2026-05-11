import bcrypt from "bcrypt";

/**
 * Utilitário de criptografia de senhas
 * Centraliza uso do bcrypt no sistema
 */
export class PasswordUtil {

  private static readonly SALT_ROUNDS = 10;

  /**
   * Gera hash seguro da senha
   */
  static async hash(senha: string): Promise<string> {
    try {
      return await bcrypt.hash(senha, PasswordUtil.SALT_ROUNDS);
    } catch (error) {
      throw new Error("Erro ao gerar hash da senha");
    }
  }

  /**
   * Compara senha com hash armazenado
   */
  static async compare(
    senha: string,
    hash: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(senha, hash);
    } catch (error) {
      throw new Error("Erro ao validar senha");
    }
  }
}