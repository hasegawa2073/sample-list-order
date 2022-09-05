document.addEventListener('DOMContentLoaded', function () {
  const todo = document.querySelector('.todo__ul') as HTMLElement;
  const todoMarginTop: number = todo.getBoundingClientRect().top;
  const todoMarginTopInt: number = Math.floor(todoMarginTop);
  const todoLists = document.querySelectorAll('.todo__li');
  const gripDelay: number = 100;
  let startTimeMousedown: number;
  let endTimeMousedown: number;
  let startTimeTouch: number;
  let endTimeTouch: number;
  let startMouseX: number;
  let startMouseY: number;
  let startTouchX: number;
  let startTouchY: number;
  let startTop: number;
  let currentMouseX: number;
  let currentMouseY: number;
  let currentTouchX: number;
  let currentTouchY: number;
  const defaultStyle = (target: HTMLElement) => {
    target.classList.remove('grip-start');
    target.classList.remove('grip');
    target.style.transform = '';
    target.style.left = '0px';
  };
  todoLists.forEach((list, index, listArray) => {
    list.addEventListener('touchstart', function (e: any) {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      todo.style.position = 'relative';
      startTimeTouch = e.timeStamp;
      startTouchX = e.touches[0].clientX;
      startTouchY = e.touches[0].clientY;
      const listHeightArray: Array<number> = new Array();
      listArray.forEach((value, index, array) => {
        const list = value as HTMLElement;
        const listTop: number = list.getBoundingClientRect().top;
        const listBottom: number = list.getBoundingClientRect().bottom;
        const listHeight = listBottom - listTop;
        listHeightArray.push(listHeight);
        // 自リストより上にあるリストのheightをすべて足して返す(topになる値を返す)
        function positionTop(heightArray: Array<number>, index: number) {
          const listHeightBeforeArray: Array<number> = new Array();
          heightArray.forEach((height: number, me) => {
            if (index === me) {
              return;
            }
            listHeightBeforeArray.push(height);
          });
          const listHeightSum: number = listHeightBeforeArray.reduce(
            (accu, curr) => {
              return accu + curr;
            },
            0
          );
          return listHeightSum;
        }
        list.style.position = 'absolute';
        list.style.width = '90%';
        list.style.top = `${positionTop(listHeightArray, index)}px`;
        startTop = parseInt(target.style.top);
      });
      // タッチ時にgrip-startクラスを付与してリアクションを返す
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
    list.addEventListener('touchmove', function (e: any) {
      currentTouchX = e.touches[0].clientX;
      currentTouchY = e.touches[0].clientY;
      const diffTouchX = currentTouchX - startTouchX;
      const diffTouchY = currentTouchY - startTouchY;
      const target = e.currentTarget as HTMLElement;
      const currentTop = startTop + diffTouchY;
      const listTopArray: Array<number> = new Array();
      listArray.forEach((value) => {
        const list = value as HTMLElement;
        const listTop: number = parseInt(list.style.top);
        listTopArray.push(listTop);
      });
      // リストを掴んだ状態でtouchmoveしてるとき
      if (target.classList.contains('grip')) {
        target.style.top = `${currentTop}px`;
        target.style.left = `${diffTouchX}px`;
      }
      // 与えられた数値を昇順にする関数
      function ascending(val1: number, val2: number) {
        if (val1 < val2) {
          return -1;
        }
        if (val1 > val2) {
          return 1;
        }
        return 0;
      }
      listTopArray.sort(ascending);
      // 自リストがtopの値で上から何番目かを返す関数
      function listTopOrder(listTopArray: Array<number>, currentTop: number) {
        listTopArray.sort(ascending);
        let order = listTopArray.findIndex((value) => {
          return currentTop - 10 <= value && value <= currentTop + 10;
        });
        return order;
      }
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
      // リストを掴んだ状態でmousemoveしてるとき
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
    list.addEventListener('touchend', function (e) {
      endTimeTouch = e.timeStamp;
      const timeTouch: number = endTimeTouch - startTimeTouch;
      const timeDiffDelay: number = gripDelay - timeTouch;
      if (timeTouch < gripDelay) {
        setTimeout(() => {
          defaultStyle(target);
        }, timeDiffDelay + 50);
      }
      const target = e.currentTarget as HTMLElement;
      defaultStyle(target);
    });
    list.addEventListener('mouseleave', function (e) {
      const target = e.currentTarget as HTMLElement;
      defaultStyle(target);
    });
  });
});
