/**
 * 日期工具类
 */
export class DateUtil {
  /**
   * 将 Date 对象格式化为 'YYYY-MM-DD HH:mm:ss' 格式
   */
  static formatDateTime(date: Date | null | undefined): string | null {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return null;
    }

    return date.toISOString().replace('T', ' ').substring(0, 19);
  }

  /**
   * 解析前端传入的日期字符串，支持多种格式
   * @param dateString - 日期字符串
   * @returns Date对象或null
   */
  static parseDateTime(dateString: string | undefined): Date | undefined {
    if (!dateString) {
      return undefined;
    }

    // 尝试解析日期字符串
    const date = new Date(dateString);

    // 检查是否为有效日期
    if (isNaN(date.getTime())) {
      throw new Error(`无效的日期格式: ${dateString}`);
    }

    return date;
  }

  /**
   * 获取当前时间
   */
  static now(): Date {
    return new Date();
  }
}
