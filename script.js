class CounterModule {
  constructor(imageElement, countElement, loopElement, totalClicksElement, addClickButton, maxCount, moduleIndex) {
    this.module = imageElement.closest('.module');
    this.countElement = countElement;
    this.loopElement = loopElement;
    this.totalClicksElement = totalClicksElement;
    this.addClickButton = addClickButton;
    this.imageElement = imageElement;
    this.maxCount = maxCount;
    this.moduleIndex = moduleIndex;

    this.achievedMessage = document.createElement("p");
    this.achievedMessage.classList.add("achieved-message");
    this.achievedMessage.textContent = "達成！";
    this.achievedMessage.style.display = "none";
    this.module.insertBefore(this.achievedMessage, this.module.querySelector(".control-area"));

    const savedData = this.loadData();
    this.count = savedData.count;
    this.loopCount = savedData.loopCount;
    this.totalClicks = savedData.totalClicks;
    this.isAchieved = savedData.isAchieved || false;

    this.updateDisplay();

    this.imageElement.closest('.click-area').addEventListener('click', this.handleClick.bind(this));
    this.addClickButton.addEventListener('click', this.correctClick.bind(this));
  }

  loadData() {
    const savedData = JSON.parse(localStorage.getItem(`module-${this.moduleIndex}`));
    return savedData || { count: this.maxCount, loopCount: 1, totalClicks: 0, isAchieved: false };
  }

  saveData() {
    localStorage.setItem(
      `module-${this.moduleIndex}`,
      JSON.stringify({
        count: this.count,
        loopCount: this.loopCount,
        totalClicks: this.totalClicks,
        isAchieved: this.isAchieved
      })
    );
  }

  updateDisplay() {
    this.countElement.querySelector('span').textContent = this.count;
    this.loopElement.textContent = `${this.loopCount}周目`;
    this.totalClicksElement.querySelector('span').textContent = this.totalClicks;

    if (this.isAchieved) {
      this.displayCompletion();
    } else {
      this.module.classList.remove("completed");
      this.achievedMessage.style.display = "none";
      this.module.querySelectorAll('.click-area p').forEach(el => el.style.display = 'block');
    }
  }

  handleClick() {
    if (this.isAchieved) return;

    this.count--;
    this.totalClicks++;

    if (this.count === 0) {
      this.loopCount++;
      this.count = this.maxCount;
    }

    if (this.loopCount > 5) {
      this.displayCompletion();
    } else {
      this.updateDisplay();
      this.saveData();
    }
  }

  correctClick() {
    if (this.isAchieved) {
      // 達成状態を解除し、達成直前の状態をロード
      this.isAchieved = false;
      this.module.classList.remove("completed");
      this.achievedMessage.style.display = "none";

      const savedData = this.loadData();
      this.count = savedData.count;
      this.loopCount = savedData.loopCount;
      this.totalClicks = savedData.totalClicks;

      this.module.querySelectorAll('.click-area p').forEach(el => el.style.display = 'block');
      this.updateDisplay();
      this.saveData();
      return;
    }

    if (this.count < this.maxCount) {
      this.count++;
    }
    this.totalClicks--;
    this.updateDisplay();
    this.saveData();
  }

  displayCompletion() {
    this.isAchieved = true;
    this.module.classList.add("completed");
    this.achievedMessage.style.display = "block";
    this.module.querySelectorAll('.click-area p').forEach(el => el.style.display = 'none');
    this.saveData();
  }

  reset() {
    this.count = this.maxCount;
    this.loopCount = 1;
    this.totalClicks = 0;
    this.isAchieved = false;

    this.module.classList.remove("completed");
    this.achievedMessage.style.display = "none";
    this.module.querySelectorAll('.click-area p').forEach(el => el.style.display = 'block');

    this.updateDisplay();
    this.saveData();
  }
}

const modules = document.querySelectorAll('.module');
const maxCounts = [50, 10, 6, 4, 2];
const moduleInstances = [];

modules.forEach((module, index) => {
  const elements = {
    image: module.querySelector('.image'),
    count: module.querySelector('.count'),
    loop: module.querySelector('.loop'),
    totalClicks: module.querySelector('.total-clicks'),
    button: module.querySelector('.add-click-button'),
  };

  const instance = new CounterModule(elements.image, elements.count, elements.loop, elements.totalClicks, elements.button, maxCounts[index], index);
  moduleInstances.push(instance);
});

document.getElementById('resetButton').addEventListener('click', () => {
  moduleInstances.forEach(instance => instance.reset());
});
