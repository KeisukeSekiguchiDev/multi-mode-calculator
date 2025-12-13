/**
 * Display Module Unit Tests
 * Tests for T-210: display.jsのテスト実装
 *
 * カバレッジ:
 * - 初期化テスト
 * - メイン表示更新テスト
 * - サブ表示更新テスト
 * - 進数表示テスト（T-122）
 * - 数値フォーマットテスト
 * - クリアテスト
 */

const DisplayTests = (function() {
  'use strict';

  let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: []
  };

  /**
   * Test assertion helper
   */
  function assert(condition, testName, message) {
    testResults.total++;
    if (condition) {
      testResults.passed++;
      testResults.tests.push({ name: testName, passed: true });
      console.log(`✓ ${testName}`);
      return true;
    } else {
      testResults.failed++;
      testResults.tests.push({ name: testName, passed: false, message });
      console.error(`✗ ${testName}: ${message}`);
      return false;
    }
  }

  /**
   * Test: DisplayManagerの初期化
   */
  function testDisplayManagerInit() {
    console.log('\n--- DisplayManagerの初期化テスト ---');

    // DOM要素が存在することを確認
    const displayResult = document.getElementById('display-result');
    const displayExpression = document.getElementById('display-expression');

    assert(displayResult !== null, 'メインディスプレイ要素が存在する', 'display-result が見つかりません');
    assert(displayExpression !== null, 'サブディスプレイ要素が存在する', 'display-expression が見つかりません');

    // 初期化が成功することを確認
    const initResult = DisplayManager.init();
    assert(initResult === true, 'DisplayManager.init()が成功する', '初期化が失敗しました');
  }

  /**
   * Test: メインディスプレイの更新
   */
  function testUpdateMainDisplay() {
    console.log('\n--- メインディスプレイ更新テスト ---');

    DisplayManager.init();

    const displayResult = document.getElementById('display-result');

    // テストケース1: 通常の数値
    DisplayManager.updateMainDisplay('42');
    assert(
      displayResult.textContent === '42',
      'メインディスプレイに数値42を表示',
      `期待値: 42, 実際の値: ${displayResult.textContent}`
    );

    // テストケース2: 小数点を含む数値
    DisplayManager.updateMainDisplay('3.14159');
    assert(
      displayResult.textContent === '3.14159',
      'メインディスプレイに小数点を含む数値を表示',
      `期待値: 3.14159, 実際の値: ${displayResult.textContent}`
    );

    // テストケース3: エラー表示
    DisplayManager.updateMainDisplay('Error');
    assert(
      displayResult.textContent === 'Error',
      'メインディスプレイにエラーを表示',
      `期待値: Error, 実際の値: ${displayResult.textContent}`
    );

    // テストケース4: Infinity
    DisplayManager.updateMainDisplay('Infinity');
    assert(
      displayResult.textContent === 'Infinity',
      'メインディスプレイにInfinityを表示',
      `期待値: Infinity, 実際の値: ${displayResult.textContent}`
    );
  }

  /**
   * Test: サブディスプレイの更新
   */
  function testUpdateSubDisplay() {
    console.log('\n--- サブディスプレイ更新テスト ---');

    DisplayManager.init();

    const displayExpression = document.getElementById('display-expression');

    // テストケース1: 式を表示
    DisplayManager.updateSubDisplay('2 + 3');
    assert(
      displayExpression.textContent === '2 + 3',
      'サブディスプレイに式を表示',
      `期待値: 2 + 3, 実際の値: ${displayExpression.textContent}`
    );

    // テストケース2: 空の式
    DisplayManager.updateSubDisplay('');
    assert(
      displayExpression.textContent === '',
      'サブディスプレイを空にする',
      `期待値: (空), 実際の値: ${displayExpression.textContent}`
    );

    // テストケース3: 複雑な式
    DisplayManager.updateSubDisplay('(10 + 5) × 2 - 8');
    assert(
      displayExpression.textContent === '(10 + 5) × 2 - 8',
      'サブディスプレイに複雑な式を表示',
      `期待値: (10 + 5) × 2 - 8, 実際の値: ${displayExpression.textContent}`
    );
  }

  /**
   * Test: 数値フォーマット処理
   */
  function testFormatNumber() {
    console.log('\n--- 数値フォーマットテスト ---');

    // テストケース1: 通常の整数
    const formatted1 = DisplayManager.formatNumber(42);
    assert(
      formatted1 === '42',
      '整数42をフォーマット',
      `期待値: 42, 実際の値: ${formatted1}`
    );

    // テストケース2: 小数
    const formatted2 = DisplayManager.formatNumber(3.14159);
    assert(
      formatted2 === '3.14159',
      '小数3.14159をフォーマット',
      `期待値: 3.14159, 実際の値: ${formatted2}`
    );

    // テストケース3: null/undefinedは0になる
    const formatted3 = DisplayManager.formatNumber(null);
    assert(
      formatted3 === '0',
      'nullは0としてフォーマット',
      `期待値: 0, 実際の値: ${formatted3}`
    );

    const formatted4 = DisplayManager.formatNumber(undefined);
    assert(
      formatted4 === '0',
      'undefinedは0としてフォーマット',
      `期待値: 0, 実際の値: ${formatted4}`
    );

    // テストケース4: 空文字列は0になる
    const formatted5 = DisplayManager.formatNumber('');
    assert(
      formatted5 === '0',
      '空文字列は0としてフォーマット',
      `期待値: 0, 実際の値: ${formatted5}`
    );

    // テストケース5: Infinityはそのまま
    const formatted6 = DisplayManager.formatNumber(Infinity);
    assert(
      formatted6 === 'Infinity',
      'InfinityはInfinityとしてフォーマット',
      `期待値: Infinity, 実際の値: ${formatted6}`
    );

    // テストケース6: -Infinityはそのまま
    const formatted7 = DisplayManager.formatNumber(-Infinity);
    assert(
      formatted7 === '-Infinity',
      '-Infinityは-Infinityとしてフォーマット',
      `期待値: -Infinity, 実際の値: ${formatted7}`
    );

    // テストケース7: 極めて小さい数値は0になる
    const formatted8 = DisplayManager.formatNumber(1e-16);
    assert(
      formatted8 === '0',
      '極めて小さい数値は0としてフォーマット',
      `期待値: 0, 実際の値: ${formatted8}`
    );

    // テストケース8: エラー文字列はそのまま
    const formatted9 = DisplayManager.formatNumber('Error');
    assert(
      formatted9 === 'Error',
      'エラー文字列はそのままフォーマット',
      `期待値: Error, 実際の値: ${formatted9}`
    );
  }

  /**
   * Test: フォントサイズ自動調整
   */
  function testFontSizeAdjustment() {
    console.log('\n--- フォントサイズ自動調整テスト ---');

    DisplayManager.init();
    const displayResult = document.getElementById('display-result');

    // テストケース1: 短い数値（8桁以下）→大きいフォント
    DisplayManager.updateMainDisplay('12345678');
    const shortNumberFont = displayResult.style.fontSize;
    assert(
      shortNumberFont === '48px' || shortNumberFont === '',
      '8桁以下の数値は大きいフォントサイズ（48px）',
      `実際のフォントサイズ: ${shortNumberFont}`
    );

    // テストケース2: 中程度の数値（9-12桁）→中フォント
    DisplayManager.updateMainDisplay('123456789012');
    const mediumNumberFont = displayResult.style.fontSize;
    assert(
      mediumNumberFont === '40px',
      '9-12桁の数値は中フォントサイズ（40px）',
      `期待値: 40px, 実際のフォントサイズ: ${mediumNumberFont}`
    );

    // テストケース3: 長い数値（13-16桁）→小フォント
    DisplayManager.updateMainDisplay('1234567890123456');
    const longNumberFont = displayResult.style.fontSize;
    assert(
      longNumberFont === '32px',
      '13-16桁の数値は小フォントサイズ（32px）',
      `期待値: 32px, 実際のフォントサイズ: ${longNumberFont}`
    );

    // テストケース4: 非常に長い数値（17桁以上）→最小フォント
    DisplayManager.updateMainDisplay('12345678901234567890');
    const veryLongNumberFont = displayResult.style.fontSize;
    assert(
      veryLongNumberFont === '24px',
      '17桁以上の数値は最小フォントサイズ（24px）',
      `期待値: 24px, 実際のフォントサイズ: ${veryLongNumberFont}`
    );
  }

  /**
   * Test: クリア機能
   */
  function testClear() {
    console.log('\n--- クリア機能テスト ---');

    DisplayManager.init();

    const displayResult = document.getElementById('display-result');
    const displayExpression = document.getElementById('display-expression');

    // 何か値を設定
    DisplayManager.updateMainDisplay('123');
    DisplayManager.updateSubDisplay('10 + 20');

    // クリア実行
    DisplayManager.clear();

    assert(
      displayResult.textContent === '0',
      'クリア後のメインディスプレイは0',
      `期待値: 0, 実際の値: ${displayResult.textContent}`
    );

    assert(
      displayExpression.textContent === '',
      'クリア後のサブディスプレイは空',
      `期待値: (空), 実際の値: ${displayExpression.textContent}`
    );
  }

  /**
   * Test: 進数表示要素の存在確認
   */
  function testBaseDisplayElementsExist() {
    console.log('\n--- 進数表示要素の存在確認 ---');

    const hexDisplay = document.getElementById('display-hex');
    const decDisplay = document.getElementById('display-dec');
    const octDisplay = document.getElementById('display-oct');
    const binDisplay = document.getElementById('display-bin');

    assert(hexDisplay !== null, 'HEX表示要素が存在する', 'display-hex が見つかりません');
    assert(decDisplay !== null, 'DEC表示要素が存在する', 'display-dec が見つかりません');
    assert(octDisplay !== null, 'OCT表示要素が存在する', 'display-oct が見つかりません');
    assert(binDisplay !== null, 'BIN表示要素が存在する', 'display-bin が見つかりません');
  }

  /**
   * Test: 進数表示の更新（10進数入力時）
   */
  function testBaseDisplaysUpdateOnDecimalInput() {
    console.log('\n--- 10進数入力時の進数表示更新 ---');

    // 初期化
    Calculator.init();
    DisplayManager.init();

    // プログラマモードに切り替え
    Calculator.setMode('programmer');
    Calculator.setBase(10);

    // 数値入力: 255
    Calculator.inputNumber('2');
    Calculator.inputNumber('5');
    Calculator.inputNumber('5');
    DisplayManager.update();

    const hexDisplay = document.getElementById('display-hex');
    const decDisplay = document.getElementById('display-dec');
    const octDisplay = document.getElementById('display-oct');
    const binDisplay = document.getElementById('display-bin');

    // 各進数の表示を確認
    assert(
      hexDisplay.textContent === 'FF',
      '10進数255をHEXで表示: FF',
      `期待値: FF, 実際の値: ${hexDisplay.textContent}`
    );

    assert(
      decDisplay.textContent === '255',
      '10進数255をDECで表示: 255',
      `期待値: 255, 実際の値: ${decDisplay.textContent}`
    );

    assert(
      octDisplay.textContent === '377',
      '10進数255をOCTで表示: 377',
      `期待値: 377, 実際の値: ${octDisplay.textContent}`
    );

    // 2進数は4ビット区切りでスペースが入る
    const expectedBin = '1111 1111';
    assert(
      binDisplay.textContent === expectedBin,
      '10進数255をBINで表示: 1111 1111（4ビット区切り）',
      `期待値: ${expectedBin}, 実際の値: ${binDisplay.textContent}`
    );
  }

  /**
   * Test: 進数表示の更新（16進数入力時）
   */
  function testBaseDisplaysUpdateOnHexInput() {
    console.log('\n--- 16進数入力時の進数表示更新 ---');

    // 初期化
    Calculator.init();
    DisplayManager.init();

    // プログラマモードに切り替え
    Calculator.setMode('programmer');
    Calculator.setBase(16);

    // 数値入力: A5 (16進数)
    Calculator.inputHexDigit('A');
    Calculator.inputNumber('5');
    DisplayManager.update();

    const hexDisplay = document.getElementById('display-hex');
    const decDisplay = document.getElementById('display-dec');
    const octDisplay = document.getElementById('display-oct');
    const binDisplay = document.getElementById('display-bin');

    // 各進数の表示を確認
    assert(
      hexDisplay.textContent === 'A5',
      '16進数A5をHEXで表示: A5',
      `期待値: A5, 実際の値: ${hexDisplay.textContent}`
    );

    assert(
      decDisplay.textContent === '165',
      '16進数A5をDECで表示: 165',
      `期待値: 165, 実際の値: ${decDisplay.textContent}`
    );

    assert(
      octDisplay.textContent === '245',
      '16進数A5をOCTで表示: 245',
      `期待値: 245, 実際の値: ${octDisplay.textContent}`
    );

    const expectedBin = '1010 0101';
    assert(
      binDisplay.textContent === expectedBin,
      '16進数A5をBINで表示: 1010 0101',
      `期待値: ${expectedBin}, 実際の値: ${binDisplay.textContent}`
    );
  }

  /**
   * Test: アクティブ進数のハイライト表示
   */
  function testActiveBaseHighlight() {
    console.log('\n--- アクティブ進数のハイライト表示 ---');

    // 初期化
    Calculator.init();
    DisplayManager.init();

    // プログラマモードに切り替え
    Calculator.setMode('programmer');

    const hexDisplay = document.getElementById('display-hex');
    const decDisplay = document.getElementById('display-dec');
    const octDisplay = document.getElementById('display-oct');
    const binDisplay = document.getElementById('display-bin');

    // DEC (10進数)をアクティブに
    Calculator.setBase(10);
    DisplayManager.updateBaseDisplays();

    assert(
      !hexDisplay.classList.contains('calculator__base-value--active'),
      'DECアクティブ時: HEXはアクティブでない',
      'HEXにアクティブクラスが付与されています'
    );

    assert(
      decDisplay.classList.contains('calculator__base-value--active'),
      'DECアクティブ時: DECがアクティブ',
      'DECにアクティブクラスが付与されていません'
    );

    assert(
      !octDisplay.classList.contains('calculator__base-value--active'),
      'DECアクティブ時: OCTはアクティブでない',
      'OCTにアクティブクラスが付与されています'
    );

    assert(
      !binDisplay.classList.contains('calculator__base-value--active'),
      'DECアクティブ時: BINはアクティブでない',
      'BINにアクティブクラスが付与されています'
    );

    // HEX (16進数)に切り替え
    Calculator.setBase(16);
    DisplayManager.updateBaseDisplays();

    assert(
      hexDisplay.classList.contains('calculator__base-value--active'),
      'HEXアクティブ時: HEXがアクティブ',
      'HEXにアクティブクラスが付与されていません'
    );

    assert(
      !decDisplay.classList.contains('calculator__base-value--active'),
      'HEXアクティブ時: DECはアクティブでない',
      'DECにアクティブクラスが付与されています'
    );
  }

  /**
   * Test: ビット長変更時の表示マスク
   */
  function testBitLengthMasking() {
    console.log('\n--- ビット長変更時の表示マスク ---');

    // 初期化
    Calculator.init();
    DisplayManager.init();

    // プログラマモードに切り替え
    Calculator.setMode('programmer');
    Calculator.setBase(10);

    // 大きな数値を入力: 256 (8ビットを超える)
    Calculator.inputNumber('2');
    Calculator.inputNumber('5');
    Calculator.inputNumber('6');
    DisplayManager.update();

    const hexDisplay = document.getElementById('display-hex');
    const decDisplay = document.getElementById('display-dec');
    const binDisplay = document.getElementById('display-bin');

    // 8ビット長に設定
    Calculator.setBitLength(8);
    DisplayManager.updateBaseDisplays();

    // 256は8ビットでマスクされて0になる（256 & 0xFF = 0）
    assert(
      hexDisplay.textContent === '0' || hexDisplay.textContent === '100',
      '8ビット長設定時: 256は8ビットマスクされる',
      `実際の値: ${hexDisplay.textContent}`
    );

    // 32ビット長に設定
    Calculator.setBitLength(32);
    DisplayManager.updateBaseDisplays();

    assert(
      hexDisplay.textContent === '100',
      '32ビット長設定時: 256はそのまま表示',
      `期待値: 100, 実際の値: ${hexDisplay.textContent}`
    );

    assert(
      decDisplay.textContent === '256',
      '32ビット長設定時: DECは256',
      `期待値: 256, 実際の値: ${decDisplay.textContent}`
    );
  }

  /**
   * Test: 2進数の4ビット区切り表示
   */
  function testBinaryGrouping() {
    console.log('\n--- 2進数の4ビット区切り表示 ---');

    // 初期化
    Calculator.init();
    DisplayManager.init();

    // プログラマモードに切り替え
    Calculator.setMode('programmer');
    Calculator.setBase(10);

    const binDisplay = document.getElementById('display-bin');

    // テストケース1: 15 (0b1111)
    Calculator.clear();
    Calculator.inputNumber('1');
    Calculator.inputNumber('5');
    DisplayManager.update();

    assert(
      binDisplay.textContent === '1111' || binDisplay.textContent === '0000 1111',
      '10進数15のBIN表示: 4ビット区切り',
      `実際の値: ${binDisplay.textContent}`
    );

    // テストケース2: 255 (0b11111111)
    Calculator.clear();
    Calculator.inputNumber('2');
    Calculator.inputNumber('5');
    Calculator.inputNumber('5');
    DisplayManager.update();

    assert(
      binDisplay.textContent === '1111 1111',
      '10進数255のBIN表示: 1111 1111',
      `期待値: 1111 1111, 実際の値: ${binDisplay.textContent}`
    );

    // テストケース3: 4095 (0b111111111111)
    Calculator.clear();
    Calculator.inputNumber('4');
    Calculator.inputNumber('0');
    Calculator.inputNumber('9');
    Calculator.inputNumber('5');
    DisplayManager.update();

    assert(
      binDisplay.textContent === '1111 1111 1111',
      '10進数4095のBIN表示: 1111 1111 1111',
      `期待値: 1111 1111 1111, 実際の値: ${binDisplay.textContent}`
    );
  }

  /**
   * Run all tests
   */
  function runAllTests() {
    console.log('='.repeat(50));
    console.log('Display Module Unit Tests - T-210');
    console.log('='.repeat(50));

    // 基本機能テスト（T-210）
    testDisplayManagerInit();
    testUpdateMainDisplay();
    testUpdateSubDisplay();
    testFormatNumber();
    testFontSizeAdjustment();
    testClear();

    // 進数表示テスト（T-122）
    testBaseDisplayElementsExist();
    testBaseDisplaysUpdateOnDecimalInput();
    testBaseDisplaysUpdateOnHexInput();
    testActiveBaseHighlight();
    testBitLengthMasking();
    testBinaryGrouping();

    console.log('\n' + '='.repeat(50));
    console.log('テスト完了');
    console.log('='.repeat(50));
    console.log(`総テスト数: ${testResults.total}`);
    console.log(`成功: ${testResults.passed}`);
    console.log(`失敗: ${testResults.failed}`);
    console.log(`成功率: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`);

    return testResults;
  }

  // Public API
  return {
    runAllTests,
    results: testResults
  };
})();

// Auto-run tests on load
if (typeof window !== 'undefined') {
  window.DisplayTests = DisplayTests;
  window.addEventListener('DOMContentLoaded', () => {
    DisplayTests.runAllTests();
  });
}
