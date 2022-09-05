"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const todo = document.querySelector('.todo__ul');
    const todoLists = document.querySelectorAll('.todo__li');
    const gripDelay = 100;
    let startTimeMousedown;
    let endTimeMousedown;
    let startTimeTouch;
    let endTimeTouch;
    let startMouseX;
    let startMouseY;
    let currentMouseX;
    let currentMouseY;
    const defaultStyle = (target) => {
        target.classList.remove('grip-start');
        target.classList.remove('grip');
        target.style.transform = '';
    };
    todoLists.forEach((list, index, listArray) => {
        list.addEventListener('touchstart', function (e) {
            e.preventDefault();
            startTimeTouch = e.timeStamp;
            const target = e.currentTarget;
            // タッチ時にgrip-startクラスを付与してリアクションを返す
            target.classList.add('grip-start');
            const removeGripStart = new Promise((resolve, reject) => {
                setTimeout(() => {
                    target.classList.remove('grip-start');
                    resolve(target);
                }, gripDelay);
            });
            // 一定時間(gripDelay)以上グリップしていたら本格的にグリップ開始
            removeGripStart.then((data) => {
                const target = data;
                target.classList.add('grip');
            });
        });
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
            // 一定時間(gripDelay)以上グリップしていたら本格的にグリップ開始
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
            listArray.forEach((value) => {
                const list = value;
                const listY = String(Math.floor(value.getBoundingClientRect().top));
                list.style.order = listY;
            });
            // リストを掴んだ状態mousemoveしてるとき
            if (target.classList.contains('grip')) {
                target.style.transform = `translate(${diffMouseX}px, ${diffMouseY}px)`;
            }
        });
        list.addEventListener('mouseup', function (e) {
            endTimeMousedown = e.timeStamp;
            let timeMousedown = endTimeMousedown - startTimeMousedown;
            let timeDiffDelay = gripDelay - timeMousedown;
            const target = e.currentTarget;
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
                const list = value;
                const listOrder = Number(list.style.order);
                listOrderMap.set(list, listOrder);
                listOrderArray.push(listOrder);
            });
            const smallestOrder = Math.min(...listOrderArray);
            const biggestOrder = Math.max(...listOrderArray);
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
            const timeTouch = endTimeTouch - startTimeTouch;
            const timeDiffDelay = gripDelay - timeTouch;
            if (timeTouch < gripDelay) {
                setTimeout(() => {
                    defaultStyle(target);
                }, timeDiffDelay + 50);
            }
            const target = e.currentTarget;
            defaultStyle(target);
        });
        list.addEventListener('mouseleave', function (e) {
            const target = e.currentTarget;
            defaultStyle(target);
        });
    });
});
