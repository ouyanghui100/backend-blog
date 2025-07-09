import { DateUtil } from './date.util';

describe('DateUtil', () => {
  describe('formatDateTime', () => {
    it('应该正确格式化日期时间', () => {
      const testDate = new Date('2024-01-15T10:30:45.123Z');
      const result = DateUtil.formatDateTime(testDate);

      // 注意：由于时区差异，这里只测试格式
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('应该处理 null 值', () => {
      const result = DateUtil.formatDateTime(null);
      expect(result).toBeNull();
    });

    it('应该处理 undefined 值', () => {
      const result = DateUtil.formatDateTime(undefined);
      expect(result).toBeNull();
    });

    it('应该处理无效日期', () => {
      const invalidDate = new Date('invalid');
      const result = DateUtil.formatDateTime(invalidDate);
      expect(result).toBeNull();
    });
  });

  describe('toTimestamp', () => {
    it('应该正确转换为时间戳', () => {
      const testDate = new Date('2024-01-15T10:30:45.123Z');
      const result = DateUtil.toTimestamp(testDate);
      expect(result).toBe(testDate.getTime());
    });

    it('应该处理 null 值', () => {
      const result = DateUtil.toTimestamp(null);
      expect(result).toBeNull();
    });
  });

  describe('formatDate', () => {
    it('应该正确格式化日期', () => {
      const testDate = new Date('2024-01-15T10:30:45.123Z');
      const result = DateUtil.formatDate(testDate);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('应该处理 null 值', () => {
      const result = DateUtil.formatDate(null);
      expect(result).toBeNull();
    });
  });
});
