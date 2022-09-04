"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const todoLists = document.querySelectorAll('.todo__li');
    const gripDelay = 300;
    let startTimeMousedown;
    let endTimeMousedown;
    const defaultStyle = (target) => {
        target.classList.remove('grip-start');
        target.classList.remove('grip');
    };
    todoLists.forEach((list) => {
        list.addEventListener('mousedown', function (e) {
            startTimeMousedown = e.timeStamp;
            const target = e.currentTarget;
            target.classList.add('grip-start');
            const removeGripStart = new Promise((resolve, reject) => {
                setTimeout(() => {
                    target.classList.remove('grip-start');
                    resolve(target);
                }, gripDelay);
            });
            removeGripStart.then((data) => {
                const target = data;
                target.classList.add('grip');
            });
        });
        list.addEventListener('mouseup', function (e) {
            endTimeMousedown = e.timeStamp;
            let timeMousedown = endTimeMousedown - startTimeMousedown;
            let timeDiffDelay = gripDelay - timeMousedown;
            const target = e.currentTarget;
            defaultStyle(target);
            // リストが浮き上がるアニメーションが始まる前にマウスの押下をやめたとき
            if (timeMousedown <= gripDelay) {
                setTimeout(() => {
                    defaultStyle(target);
                }, timeDiffDelay + 10);
            }
        });
        list.addEventListener('mouseleave', function (e) {
            const target = e.currentTarget;
            defaultStyle(target);
        });
    });
});
