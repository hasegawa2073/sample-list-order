document.addEventListener('DOMContentLoaded', function () {
  const todoLists = document.querySelectorAll('.todo__li');
  const gripDelay: number = 100;
  let startTimeMousedown: number;
  let endTimeMousedown: number;
  let startMouseX: number;
  let startMouseY: number;
  let currentMouseX: number;
  let currentMouseY: number;
  const defaultStyle = (target: Element) => {
    target.classList.remove('grip-start');
    target.classList.remove('grip');
  };
  todoLists.forEach((list) => {
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
      // リストを掴んだ状態mousemoveしてるとき
      if (target.classList.contains('grip')) {
        target.style.transform = `translateY(${diffMouseY}px)`;
      }
    });
    list.addEventListener('mouseup', function (e) {
      endTimeMousedown = e.timeStamp;
      let timeMousedown: number = endTimeMousedown - startTimeMousedown;
      let timeDiffDelay = gripDelay - timeMousedown;
      const target = e.currentTarget as HTMLElement;
      defaultStyle(target);
      target.style.transform = '';
      // リストが浮き上がるアニメーションが始まる前にマウスの押下をやめたとき
      if (timeMousedown < gripDelay) {
        setTimeout(() => {
          defaultStyle(target);
        }, timeDiffDelay + 10);
      }
    });
    list.addEventListener('mouseleave', function (e) {
      const target = e.currentTarget as HTMLElement;
      defaultStyle(target);
      target.style.transform = '';
    });
  });
});
