/**
 * History Manager Module - Unit Tests
 * T-211: history.jsのテスト実装
 *
 * Tests for:
 * - T-130: 履歴データ管理（CRUD操作）
 * - T-131: LocalStorage永続化
 * - T-132: 履歴パネルUI制御
 * - T-133: 履歴項目クリック処理
 */

describe('HistoryManager Module', () => {

  // ========================================
  // Setup / Teardown
  // ========================================

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Reset HistoryManager state
    if (typeof HistoryManager !== 'undefined') {
      if (HistoryManager.clear) {
        HistoryManager.clear();
      }
      if (HistoryManager.init) {
        HistoryManager.init();
      }
    }
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.clear();
  });

  // ========================================
  // 1. 初期化テスト
  // ========================================

  describe('初期化（init）', () => {

    test('init()が正常に動作する', () => {
      const result = HistoryManager.init();
      expect(result).toBe(true);
    });

    test('init()がLocalStorageから履歴を読み込む', () => {
      // LocalStorageに事前データを設定
      const mockHistory = [
        {
          expression: '10 + 5',
          result: '15',
          mode: 'standard',
          timestamp: new Date().toISOString()
        }
      ];
      localStorage.setItem('calc_history', JSON.stringify(mockHistory));

      // 初期化
      HistoryManager.init();

      // 履歴が読み込まれることを確認
      const history = HistoryManager.getAll();
      expect(history).toHaveLength(1);
      expect(history[0].expression).toBe('10 + 5');
    });

    test('init()はLocalStorageにデータがない場合でもエラーにならない', () => {
      expect(() => {
        HistoryManager.init();
      }).not.toThrow();

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(0);
    });
  });

  // ========================================
  // 2. 追加テスト（add）
  // ========================================

  describe('履歴追加（add）', () => {

    test('履歴項目が正しく追加される', () => {
      const entry = {
        expression: '10 + 5',
        result: '15',
        mode: 'standard'
      };

      HistoryManager.add(entry);

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(1);
      expect(history[0].expression).toBe('10 + 5');
      expect(history[0].result).toBe('15');
      expect(history[0].mode).toBe('standard');
    });

    test('タイムスタンプが自動的に付与される', () => {
      const entry = {
        expression: '10 + 5',
        result: '15',
        mode: 'standard'
      };

      HistoryManager.add(entry);

      const history = HistoryManager.getAll();
      expect(history[0].timestamp).toBeDefined();
      expect(typeof history[0].timestamp).toBe('string');
      // ISO 8601形式のチェック
      expect(history[0].timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    test('modeが指定されていない場合はデフォルトで"standard"になる', () => {
      const entry = {
        expression: '10 + 5',
        result: '15'
      };

      HistoryManager.add(entry);

      const history = HistoryManager.getAll();
      expect(history[0].mode).toBe('standard');
    });

    test('複数の履歴を追加できる（新しいものが先頭に来る）', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });
      HistoryManager.add({ expression: '20 * 3', result: '60', mode: 'standard' });
      HistoryManager.add({ expression: 'sin(30)', result: '0.5', mode: 'scientific' });

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(3);
      // 最新のものが先頭
      expect(history[0].expression).toBe('sin(30)');
      expect(history[1].expression).toBe('20 * 3');
      expect(history[2].expression).toBe('10 + 5');
    });

    test('最大件数（100件）を超えた場合、古い項目が削除される', () => {
      // 101件追加
      for (let i = 0; i < 101; i++) {
        HistoryManager.add({
          expression: `${i} + 1`,
          result: `${i + 1}`,
          mode: 'standard'
        });
      }

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(100);

      // 最新のもの（100）が先頭
      expect(history[0].expression).toBe('100 + 1');
      expect(history[0].result).toBe('101');

      // 最古のもの（1）が最後（0は削除されている）
      expect(history[99].expression).toBe('1 + 1');
      expect(history[99].result).toBe('2');
    });

    test('不正なデータは追加されない（nullチェック）', () => {
      HistoryManager.add(null);
      HistoryManager.add(undefined);

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(0);
    });

    test('不正なデータは追加されない（必須フィールド不足）', () => {
      HistoryManager.add({});
      HistoryManager.add({ expression: '10 + 5' }); // resultが欠けている
      HistoryManager.add({ result: '15' }); // expressionが欠けている

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(0);
    });

    test('空文字のexpressionやresultは追加されない', () => {
      HistoryManager.add({ expression: '', result: '15', mode: 'standard' });
      HistoryManager.add({ expression: '10 + 5', result: '', mode: 'standard' });
      HistoryManager.add({ expression: '   ', result: '15', mode: 'standard' });
      HistoryManager.add({ expression: '10 + 5', result: '   ', mode: 'standard' });

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(0);
    });

    test('非常に長い計算式も保存できる', () => {
      const longExpression = '1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10'.repeat(10);
      HistoryManager.add({
        expression: longExpression,
        result: '550',
        mode: 'standard'
      });

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(1);
      expect(history[0].expression).toBe(longExpression);
    });

    test('特殊文字を含む計算式も保存できる', () => {
      const specialChars = [
        { expression: 'sin(π/2)', result: '1', mode: 'scientific' },
        { expression: '√16', result: '4', mode: 'scientific' },
        { expression: '2³', result: '8', mode: 'scientific' },
        { expression: 'log₁₀(100)', result: '2', mode: 'scientific' }
      ];

      specialChars.forEach(entry => HistoryManager.add(entry));

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(4);
      expect(history[3].expression).toBe('sin(π/2)');
      expect(history[0].expression).toBe('log₁₀(100)');
    });
  });

  // ========================================
  // 3. 取得テスト（getAll）
  // ========================================

  describe('履歴取得（getAll）', () => {

    test('全履歴が正しく取得される', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });
      HistoryManager.add({ expression: '20 * 3', result: '60', mode: 'standard' });

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(2);
      expect(Array.isArray(history)).toBe(true);
    });

    test('履歴が空の場合は空配列を返す', () => {
      const history = HistoryManager.getAll();
      expect(history).toEqual([]);
      expect(Array.isArray(history)).toBe(true);
    });

    test('返される配列は元データのコピーである（元データを変更しない）', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });

      const history1 = HistoryManager.getAll();
      const history2 = HistoryManager.getAll();

      // 異なるインスタンス
      expect(history1).not.toBe(history2);

      // 内容は同じ
      expect(history1).toEqual(history2);

      // history1を変更しても元データに影響しない
      history1.push({ expression: '20 * 3', result: '60', mode: 'standard' });

      const history3 = HistoryManager.getAll();
      expect(history3).toHaveLength(1); // 元データは変更されていない
    });
  });

  // ========================================
  // 4. 削除テスト（deleteHistoryItem）
  // ========================================

  describe('履歴削除（deleteHistoryItem）', () => {

    test('指定インデックスの項目が削除される', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });
      HistoryManager.add({ expression: '20 * 3', result: '60', mode: 'standard' });
      HistoryManager.add({ expression: '30 - 10', result: '20', mode: 'standard' });

      const historyBefore = HistoryManager.getAll();
      expect(historyBefore).toHaveLength(3);

      // インデックス1を削除（20 * 3）
      HistoryManager.deleteHistoryItem(1);

      const historyAfter = HistoryManager.getAll();
      expect(historyAfter).toHaveLength(2);
      expect(historyAfter[0].expression).toBe('30 - 10');
      expect(historyAfter[1].expression).toBe('10 + 5');
    });

    test('先頭（インデックス0）の項目が削除される', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });
      HistoryManager.add({ expression: '20 * 3', result: '60', mode: 'standard' });

      HistoryManager.deleteHistoryItem(0);

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(1);
      expect(history[0].expression).toBe('10 + 5');
    });

    test('最後の項目が削除される', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });
      HistoryManager.add({ expression: '20 * 3', result: '60', mode: 'standard' });

      const historyBefore = HistoryManager.getAll();
      const lastIndex = historyBefore.length - 1;

      HistoryManager.deleteHistoryItem(lastIndex);

      const historyAfter = HistoryManager.getAll();
      expect(historyAfter).toHaveLength(1);
      expect(historyAfter[0].expression).toBe('20 * 3');
    });

    test('不正なインデックス（負の数）ではエラーにならない', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });

      expect(() => {
        HistoryManager.deleteHistoryItem(-1);
      }).not.toThrow();

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(1);
    });

    test('不正なインデックス（範囲外）ではエラーにならない', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });

      HistoryManager.deleteHistoryItem(999);
      HistoryManager.deleteHistoryItem(1);

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(1);
    });

    test('不正なインデックス（文字列）ではエラーにならない', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });

      HistoryManager.deleteHistoryItem('invalid');

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(1);
    });
  });

  // ========================================
  // 5. 全クリアテスト（clear）
  // ========================================

  describe('全履歴クリア（clear）', () => {

    test('全履歴がクリアされる', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });
      HistoryManager.add({ expression: '20 * 3', result: '60', mode: 'standard' });

      HistoryManager.clear();

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(0);
    });

    test('空の状態でclearしてもエラーにならない', () => {
      expect(() => {
        HistoryManager.clear();
      }).not.toThrow();

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(0);
    });

    test('LocalStorageもクリアされる', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });

      // LocalStorageに保存されていることを確認
      const storedBefore = localStorage.getItem('calc_history');
      expect(storedBefore).not.toBeNull();

      HistoryManager.clear();

      // LocalStorageもクリアされている
      const storedAfter = localStorage.getItem('calc_history');
      const parsed = JSON.parse(storedAfter);
      expect(parsed).toHaveLength(0);
    });
  });

  // ========================================
  // 6. 永続化テスト（LocalStorage）
  // ========================================

  describe('LocalStorage永続化', () => {

    test('追加時にLocalStorageに保存される', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });

      const stored = localStorage.getItem('calc_history');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].expression).toBe('10 + 5');
    });

    test('削除時にLocalStorageが更新される', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });
      HistoryManager.add({ expression: '20 * 3', result: '60', mode: 'standard' });

      HistoryManager.deleteHistoryItem(0);

      const stored = localStorage.getItem('calc_history');
      const parsed = JSON.parse(stored);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].expression).toBe('10 + 5');
    });

    test('全クリア時にLocalStorageが空配列になる', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });

      HistoryManager.clear();

      const stored = localStorage.getItem('calc_history');
      const parsed = JSON.parse(stored);
      expect(parsed).toHaveLength(0);
    });

    test('init時にLocalStorageから履歴を読み込む', () => {
      // LocalStorageに直接データを設定
      const mockHistory = [
        {
          expression: '10 + 5',
          result: '15',
          mode: 'standard',
          timestamp: new Date().toISOString()
        },
        {
          expression: '20 * 3',
          result: '60',
          mode: 'standard',
          timestamp: new Date().toISOString()
        }
      ];
      localStorage.setItem('calc_history', JSON.stringify(mockHistory));

      // 再初期化
      HistoryManager.init();

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(2);
      expect(history[0].expression).toBe('10 + 5');
      expect(history[1].expression).toBe('20 * 3');
    });

    test('LocalStorageに不正なデータがある場合は空配列になる', () => {
      localStorage.setItem('calc_history', 'invalid json');

      HistoryManager.init();

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(0);
    });

    test('LocalStorageに100件を超えるデータがある場合は100件に制限される', () => {
      const mockHistory = [];
      for (let i = 0; i < 150; i++) {
        mockHistory.push({
          expression: `${i} + 1`,
          result: `${i + 1}`,
          mode: 'standard',
          timestamp: new Date().toISOString()
        });
      }
      localStorage.setItem('calc_history', JSON.stringify(mockHistory));

      HistoryManager.init();

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(100);
    });

    test('LocalStorageが使えない場合でもエラーにならない', () => {
      // localStorage.setItem を一時的に無効化
      const originalSetItem = Storage.prototype.setItem;

      Storage.prototype.setItem = function() {
        throw new Error('QuotaExceededError');
      };

      expect(() => {
        HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });
      }).not.toThrow();

      // 元に戻す
      Storage.prototype.setItem = originalSetItem;
    });

    test('追加→保存→再読み込みでデータが保持される（統合テスト）', () => {
      // データ追加
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });
      HistoryManager.add({ expression: '20 * 3', result: '60', mode: 'scientific' });

      // 再初期化
      HistoryManager.init();

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(2);
      expect(history[0].expression).toBe('20 * 3');
      expect(history[0].mode).toBe('scientific');
      expect(history[1].expression).toBe('10 + 5');
      expect(history[1].mode).toBe('standard');
    });
  });

  // ========================================
  // 7. エッジケーステスト
  // ========================================

  describe('エッジケース', () => {

    test('100件の履歴を追加後、さらに1件追加すると最古の履歴が削除される', () => {
      // 100件追加
      for (let i = 0; i < 100; i++) {
        HistoryManager.add({
          expression: `${i} + 1`,
          result: `${i + 1}`,
          mode: 'standard'
        });
      }

      const historyBefore = HistoryManager.getAll();
      expect(historyBefore).toHaveLength(100);
      expect(historyBefore[99].expression).toBe('0 + 1'); // 最古

      // 1件追加
      HistoryManager.add({
        expression: '100 + 1',
        result: '101',
        mode: 'standard'
      });

      const historyAfter = HistoryManager.getAll();
      expect(historyAfter).toHaveLength(100);
      expect(historyAfter[0].expression).toBe('100 + 1'); // 最新
      expect(historyAfter[99].expression).toBe('1 + 1'); // '0 + 1' が削除された
    });

    test('LocalStorageに配列以外のデータがある場合は空配列になる', () => {
      localStorage.setItem('calc_history', JSON.stringify({ invalid: 'data' }));

      HistoryManager.init();

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(0);
    });

    test('タイムスタンプがISO 8601形式である', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });

      const history = HistoryManager.getAll();
      const timestamp = history[0].timestamp;

      // ISO 8601形式の正規表現チェック
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    test('削除後、再度追加すると正しい順序で追加される', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });
      HistoryManager.add({ expression: '20 * 3', result: '60', mode: 'standard' });

      HistoryManager.deleteHistoryItem(0);

      HistoryManager.add({ expression: '30 - 10', result: '20', mode: 'standard' });

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(2);
      expect(history[0].expression).toBe('30 - 10'); // 最新
      expect(history[1].expression).toBe('10 + 5');
    });
  });

  // ========================================
  // 8. 各種モード対応テスト
  // ========================================

  describe('各種モード対応', () => {

    test('standardモードの履歴が保存される', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });

      const history = HistoryManager.getAll();
      expect(history[0].mode).toBe('standard');
    });

    test('scientificモードの履歴が保存される', () => {
      HistoryManager.add({ expression: 'sin(30)', result: '0.5', mode: 'scientific' });

      const history = HistoryManager.getAll();
      expect(history[0].mode).toBe('scientific');
    });

    test('programmerモードの履歴が保存される', () => {
      HistoryManager.add({ expression: '0xFF + 0x1', result: '256', mode: 'programmer' });

      const history = HistoryManager.getAll();
      expect(history[0].mode).toBe('programmer');
    });

    test('異なるモードの履歴が混在して保存される', () => {
      HistoryManager.add({ expression: '10 + 5', result: '15', mode: 'standard' });
      HistoryManager.add({ expression: 'sin(30)', result: '0.5', mode: 'scientific' });
      HistoryManager.add({ expression: '0xFF', result: '255', mode: 'programmer' });

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(3);
      expect(history[0].mode).toBe('programmer');
      expect(history[1].mode).toBe('scientific');
      expect(history[2].mode).toBe('standard');
    });
  });
});
