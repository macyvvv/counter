class CounterModule {
  constructor(imageElement, countElement, loopElement, maxCount) {
    this.image = imageElement;
    this.countElement = countElement;
    this.loopElement = loopElement;
    this.maxCount = maxCount;
    this.count = 0;
    this.loopCount = 0;

    this.image.addEventListener('click', () => {
      this.count++;
      this.countElement.textContent = this.count;

      if (this.count >= this.maxCount) {
        this.count = 0;
        this.loopCount++;
        this.loopElement.textContent = this.loopCount;

        // 周回上限を設定（ここでは5回とする）
        if (this.loopCount >= 5) {
          this.loopElement.textContent = '達成';
        }
      }
    });
  }
}

// HTMLの要素を取得
const modules = document.querySelectorAll('.module');

// 各モジュールに対してインスタンスを作成（上限値を配列で指定）
const maxCounts = [50, 10, 6, 4, 2]; // 各モジュールの上限値を配列で管理
modules.forEach((module, index) => {
  const image = module.querySelector('.image');
  const countElement = module.querySelector('.count');
  const loopElement = module.querySelector('.loop');
  new CounterModule(image, countElement, loopElement, maxCounts[index]);
});

// リセットボタンを取得
const resetButton = document.getElementById('resetButton');

// リセットボタンをクリックしたときの処理
resetButton.addEventListener('click', () => {
  modules.forEach(module => {
    const countElement = module.querySelector('.count');
    const loopElement = module.querySelector('.loop');
    countElement.textContent = 0;
    loopElement.textContent = 0;
  });
});
