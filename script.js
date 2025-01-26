class CounterModule {
  constructor(imageElement, countElement, loopElement, maxCount, moduleIndex) {
    this.module = imageElement.closest('.module');
    this.countElement = countElement;
    this.loopElement = loopElement;
    this.imageElement = imageElement;
    this.maxCount = maxCount;
    this.moduleIndex = moduleIndex;

    // ローカルストレージからデータを取得
    const savedData = this.loadData();

    this.count = savedData.count;
    this.loopCount = savedData.loopCount;

    // 初期表示
    this.updateDisplay();

    // タッチイベントとクリックイベントを追加
    this.module.addEventListener('touchstart', this.handleClick.bind(this));
    this.module.addEventListener('click', this.handleClick.bind(this));
  }

  // データをローカルストレージから取得
  loadData() {
    const savedData = JSON.parse(localStorage.getItem(`module-${this.moduleIndex}`));
    return savedData || { count: this.maxCount, loopCount: 1 }; // データがなければ初期値を返す
  }

  // データをローカルストレージに保存
  saveData() {
    localStorage.setItem(
      `module-${this.moduleIndex}`,
      JSON.stringify({ count: this.count, loopCount: this.loopCount })
    );
  }

  // カウントと表示の更新処理
  updateDisplay() {
    this.countElement.textContent = this.count;
    this.loopElement.textContent = `${this.loopCount}周目`; // 表記を「n周目」に変更

    // 達成状態の場合のスタイル適用
    if (this.loopCount >= 5) {
      this.displayCompletion();
    }
  }

  // カウントをリセット
  reset() {
    this.count = this.maxCount; // カウントを初期値に戻す
    this.loopCount = 1; // 周回数を初期値に戻す

    // 隠していた要素を再表示し、クリックを有効化
    this.module.classList.remove('completed');
    this.module.style.pointerEvents = 'auto';

    this.updateDisplay(); // 表示を更新
    this.saveData(); // ローカルストレージを更新
  }

  // クリック時の処理
  handleClick() {
    // 「達成！」状態ではクリックを無効化
    if (this.module.classList.contains('completed')) {
      return;
    }

    if (this.count > 0) {
      this.count--; // カウントダウン
    }

    // カウントが0になったときの処理
    if (this.count === 0) {
      this.loopCount++;
      this.count = this.maxCount; // カウントをリセット

      // 周回数の上限をチェック
      if (this.loopCount >= 5) {
        this.displayCompletion(); // 達成の表示に切り替える
        return;
      }
    }

    this.updateDisplay(); // 表示を更新
    this.saveData(); // データを保存
  }

  // 「達成！」表示に切り替える
  displayCompletion() {
    this.module.classList.add('completed'); // CSSで表示を切り替え
    this.module.style.pointerEvents = 'none'; // クリック無効化
    this.saveData(); // データを保存
  }
}

// HTMLの要素を取得
const modules = document.querySelectorAll('.module');

// 各モジュールに対してインスタンスを作成（開始値と上限値を配列で指定）
const maxCounts = [50, 10, 6, 4, 2];
const moduleInstances = []; // CounterModuleのインスタンスを格納する配列

modules.forEach((module, index) => {
  const image = module.querySelector('.image');
  const countElement = module.querySelector('.count');
  const loopElement = module.querySelector('.loop');
  const instance = new CounterModule(image, countElement, loopElement, maxCounts[index], index);
  moduleInstances.push(instance);
});

// リセットボタンを取得
const resetButton = document.getElementById('resetButton');

// リセットボタンをクリックしたときの処理
resetButton.addEventListener('click', () => {
  moduleInstances.forEach(instance => {
    instance.reset(); // 各モジュールをリセット
  });
});
