"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const todoLists = document.querySelectorAll('.todo__li');
    const gripDelay = 200;
    let startTimeMousedown;
    let endTimeMousedown;
    let startMouseX;
    let startMouseY;
    let currentMouseX;
    let currentMouseY;
    const defaultStyle = (target) => {
        target.classList.remove('grip-start');
        target.classList.remove('grip');
    };
    todoLists.forEach((list) => {
        list.addEventListener('mousedown', function (e) {
            startTimeMousedown = e.timeStamp;
            startMouseX = e.clientX;
            startMouseY = e.clientY;
            const target = e.currentTarget;
            // マウス押下時にgrip-startクラスを付与してマウス押下のリアクションを返す
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
        list.addEventListener('mousemove', function (e) {
            currentMouseX = e.clientX;
            currentMouseY = e.clientY;
            const diffMouseX = currentMouseX - startMouseX;
            const diffMouseY = currentMouseY - startMouseY;
            const target = e.currentTarget;
            // リストを掴んだ状態mousemoveしてるとき
            if (target.classList.contains('grip')) {
                target.style.transform = `translateY(${diffMouseY}px)`;
            }
        });
        list.addEventListener('mouseup', function (e) {
            endTimeMousedown = e.timeStamp;
            let timeMousedown = endTimeMousedown - startTimeMousedown;
            let timeDiffDelay = gripDelay - timeMousedown;
            const target = e.currentTarget;
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
            const target = e.currentTarget;
            defaultStyle(target);
            target.style.transform = '';
        });
    });
});
