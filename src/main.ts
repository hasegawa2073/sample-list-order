document.addEventListener('DOMContentLoaded', function () {
  const todo = document.querySelector('.todo__ul');
  const todoLists = document.querySelectorAll('.todo__li');
  const gripDelay: number = 100;
  let startTimeMousedown: number;
  let endTimeMousedown: number;
  let startMouseX: number;
  let startMouseY: number;
  let currentMouseX: number;
  let currentMouseY: number;
  const defaultStyle = (target: HTMLElement) => {
    target.classList.remove('grip-start');
    target.classList.remove('grip');
    target.style.transform = '';
  };
  todoLists.forEach((list, index, listArray) => {
    list.addEventListener('touchstart', function (e) {
      e.preventDefault();
      const target = e.currentTarget as Element;
      target.classList.add('grip-start');
      const removeGripStart = new Promise((resolve, reject) => {
        setTimeout(() => {
          target.classList.remove('grip-start');
          resolve(target as Element);
        }, gripDelay);
      });
      // 一定時間(gripDelay)以上グリップしていたら本格的にグリップ開始
      removeGripStart.then((data) => {
        const target = data as Element;
        target.classList.add('grip');
      });
    });
    list.addEventListener('mousedown', function (e: any) {
      startTimeMousedown = e.timeStamp;
      startMouseX = e.clientX;
      startMouseY = e.clientY;
      const target = e.currentTarget as Element;
      // マウス押下時にgrip-startクラスを付与してマウス押下のリアクションを返す
      target.classList.add('grip-start');
      const removeGripStart = new Promise((resolve, reject) => {
        setTimeout(() => {
          target.classList.remove('grip-start');
          resolve(target as Element);
        }, gripDelay);
      });
      // 一定時間(gripDelay)以上グリップしていたら本格的にグリップ開始
      removeGripStart.then((data) => {
        const target = data as Element;
        target.classList.add('grip');
      });
    });
    list.addEventListener('mousemove', function (e: any) {
      currentMouseX = e.clientX;
      currentMouseY = e.clientY;
      const diffMouseX = currentMouseX - startMouseX;
      const diffMouseY = currentMouseY - startMouseY;
      const target = e.currentTarget as HTMLElement;
      listArray.forEach((value) => {
        const list = value as HTMLElement;
        const listY: string = String(
          Math.floor(value.getBoundingClientRect().top)
        );
        list.style.order = listY;
      });
      // リストを掴んだ状態mousemoveしてるとき
      if (target.classList.contains('grip')) {
        target.style.transform = `translate(${diffMouseX}px, ${diffMouseY}px)`;
      }
    });
    list.addEventListener('mouseup', function (e) {
      endTimeMousedown = e.timeStamp;
      let timeMousedown: number = endTimeMousedown - startTimeMousedown;
      let timeDiffDelay = gripDelay - timeMousedown;
      const target = e.currentTarget as HTMLElement;
      defaultStyle(target);
      // リストが浮き上がるアニメーションが始まる前にマウスの押下をやめたとき
      if (timeMousedown < gripDelay) {
        setTimeout(() => {
          defaultStyle(target);
        }, timeDiffDelay + 10);
      }
      const listOrderMap = new Map();
      const listOrderArray = new Array();
      listArray.forEach((value) => {
        const list = value as HTMLElement;
        const listOrder: number = Number(list.style.order);
        listOrderMap.set(list, listOrder);
        listOrderArray.push(listOrder);
      });
      const smallestOrder: number = Math.min(...listOrderArray);
      const biggestOrder: number = Math.max(...listOrderArray);
      listOrderMap.forEach((value, key) => {
        // orderが最小のリストはTodoのDOMの最初の要素にする
        if (value === smallestOrder) {
          todo?.prepend(key);
        }
        // orderが最大のリストはTodoのDOMの最後の要素にする
        if (value === biggestOrder) {
          todo?.append(key);
        }
      });
    });
    list.addEventListener('mouseleave', function (e) {
      const target = e.currentTarget as HTMLElement;
      defaultStyle(target);
    });
  });
});
