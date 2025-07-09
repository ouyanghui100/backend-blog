/**
 * 日期时间工具类
 * 提供统一的时间格式化功能
 */
export class DateUtil {
  /**
   * 将 Date 对象格式化为 YYYY-MM-DD HH:mm:ss 格式
   * @param date - 要格式化的日期对象
   * @returns 格式化后的时间字符串，如果输入为空则返回 null
   */
  static formatDateTime(date: Date | null | undefined): string | null {
    if (!date) {
      return null;
    }

    const d = new Date(date);

    // 检查日期是否有效
    if (isNaN(d.getTime())) {
      return null;
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * 将 Date 对象转换为时间戳（毫秒）
   * @param date - 要转换的日期对象
   * @returns 时间戳，如果输入为空则返回 null
   */
  static toTimestamp(date: Date | null | undefined): number | null {
    if (!date) {
      return null;
    }

    const d = new Date(date);

    // 检查日期是否有效
    if (isNaN(d.getTime())) {
      return null;
    }

    return d.getTime();
  }

  /**
   * 将 Date 对象格式化为仅日期格式 YYYY-MM-DD
   * @param date - 要格式化的日期对象
   * @returns 格式化后的日期字符串，如果输入为空则返回 null
   */
  static formatDate(date: Date | null | undefined): string | null {
    if (!date) {
      return null;
    }

    const d = new Date(date);

    // 检查日期是否有效
    if (isNaN(d.getTime())) {
      return null;
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
