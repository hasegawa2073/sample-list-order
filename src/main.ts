document.addEventListener('DOMContentLoaded', function () {
  const todoLists = document.querySelectorAll('.todo__li');
  const gripDelay: number = 300;
  let startTimeMousedown: number;
  let endTimeMousedown: number;
  const defaultStyle = (target: Element) => {
    target.classList.remove('grip-start');
    target.classList.remove('grip');
  };
  todoLists.forEach((list) => {
    list.addEventListener('mousedown', function (e) {
      startTimeMousedown = e.timeStamp;
      const target = e.currentTarget as Element;
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
    list.addEventListener('mouseup', function (e) {
      endTimeMousedown = e.timeStamp;
      let timeMousedown: number = endTimeMousedown - startTimeMousedown;
      let timeDiffDelay = gripDelay - timeMousedown;
      const target = e.currentTarget as Element;
      defaultStyle(target);
      // リストが浮き上がるアニメーションが始まる前にマウスの押下をやめたとき
      if (timeMousedown <= gripDelay) {
        setTimeout(() => {
          defaultStyle(target);
        }, timeDiffDelay + 10);
      }
    });
    list.addEventListener('mouseleave', function (e) {
      const target = e.currentTarget as Element;
      defaultStyle(target);
    });
  });
});
