import { STORAGE_KEYS, APP_PREFIX } from "@/constants";

/**
 * 存储工具类
 * 提供localStorage和sessionStorage操作方法
 */
export class Storage {
  /**
   * localStorage 存储
   */
  static set(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  static get<T>(key: string, defaultValue?: T): T {
    const value = sessionStorage.getItem(key);
    if (!value) return defaultValue as T;

    try {
      return JSON.parse(value);
    } catch {
      // 如果解析失败，返回原始字符串
      return value as unknown as T;
    }
  }

  static remove(key: string): void {
    sessionStorage.removeItem(key);
  }
  /**
   * 存储清理工具方法
   */
  // 清理指定键的存储（localStorage + sessionStorage）
  static clear(key: string): void {
    sessionStorage.removeItem(key);
  }

  // 批量清理存储
  static clearMultiple(keys: string[]): void {
    keys.forEach((key) => {
      sessionStorage.removeItem(key);
    });
  }

  // 清理指定前缀的存储
  static clearByPrefix(prefix: string): void {
    // sessionStorage 清理
    const sessionKeys = Object.keys(sessionStorage).filter((key) => key.startsWith(prefix));
    sessionKeys.forEach((key) => sessionStorage.removeItem(key));
  }

  /**
   * 项目特定的清理便利方法
   */
  // 清理所有项目相关的存储
  static clearAllProject(): void {
    const keys = Object.values(STORAGE_KEYS);
    this.clearMultiple(keys);
  }

  // 清理特定分类的存储
  static clearByCategory(category: "auth" | "system" | "ui" | "app"): void {
    const prefix = `${APP_PREFIX}:${category}:`;
    this.clearByPrefix(prefix);
  }

  // 获取所有项目相关的存储键
  static getAllProjectKeys(): string[] {
    return Object.values(STORAGE_KEYS);
  }
}
