"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const todo = document.querySelector('.todo__ul');
    const todoMarginTop = todo.getBoundingClientRect().top;
    const todoMarginTopInt = Math.floor(todoMarginTop);
    const todoLists = document.querySelectorAll('.todo__li');
    const gripDelay = 100;
    let startTimeMousedown;
    let endTimeMousedown;
    let startTimeTouch;
    let endTimeTouch;
    let startMouseX;
    let startMouseY;
    let startTouchX;
    let startTouchY;
    let startTop;
    let currentMouseX;
    let currentMouseY;
    let currentTouchX;
    let currentTouchY;
    const defaultStyle = (target) => {
        target.classList.remove('grip-start');
        target.classList.remove('grip');
        target.style.transform = '';
        target.style.left = '0px';
    };
    // 自リストより上にあるリストのheightをすべて足して返す(topになる値を返す)
    function positionTop(heightArray, index) {
        const listHeightBeforeArray = new Array();
        heightArray.forEach((height, me) => {
            if (index === me) {
                return;
            }
            listHeightBeforeArray.push(height);
        });
        const listHeightSum = listHeightBeforeArray.reduce((accu, curr) => {
            return accu + curr;
        }, 0);
        return listHeightSum;
    }
    // 与えられた数値を昇順にする関数
    function ascending(val1, val2) {
        if (val1 < val2) {
            return -1;
        }
        if (val1 > val2) {
            return 1;
        }
        return 0;
    }
    // 自リストがtopの値で上から何番目かを返す関数
    function listTopOrder(listTopArray, currentTop) {
        listTopArray.sort(ascending);
        let order = listTopArray.findIndex((value) => {
            return currentTop - 10 <= value && value <= currentTop + 10;
        });
        return order;
    }
    // 渡されたリストの配列をtopの値順にして新しい配列を返す関数
    function orderListArrayFn(listArray) {
        const orderListArray = new Array();
        let listTopArray = new Array();
        listArray.forEach((value) => {
            const list = value;
            const listTop = parseInt(list.style.top);
            listTopArray[listTop] = list;
        });
        for (let key in listTopArray) {
            orderListArray.push(listTopArray[key]);
        }
        return orderListArray;
    }
    // 渡されたリストの配列をtopの値順にしてDOMを書き換える関数
    function orderListDOM(listArray) {
        let orderListArray = new Array();
        let listTopMap = new Map();
        listArray.forEach((value) => {
            const list = value;
            const listTop = parseInt(list.style.top);
            listTopMap.set(listTop, list);
        });
        const newListTopMap = new Map([...listTopMap].sort((a, b) => a[0] - b[0]));
        newListTopMap.forEach((value) => {
            orderListArray.push(value);
        });
        orderListArray.forEach((value) => {
            todo.append(value);
        });
    }
    todoLists.forEach((list, index, listArray) => {
        let listArray2 = new Array();
        let listTopArray2 = new Array();
        list.addEventListener('touchstart', function (e) {
            e.preventDefault();
            const target = e.currentTarget;
            todo.style.position = 'relative';
            startTimeTouch = e.timeStamp;
            startTouchX = e.touches[0].clientX;
            startTouchY = e.touches[0].clientY;
            const listHeightArray = new Array();
            listArray.forEach((value, index, array) => {
                const list = value;
                const listTop = list.getBoundingClientRect().top;
                const listBottom = list.getBoundingClientRect().bottom;
                const listHeight = listBottom - listTop;
                listHeightArray.push(listHeight);
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
        list.addEventListener('touchmove', function (e) {
            listArray2 = [];
            listTopArray2 = [];
            currentTouchX = e.touches[0].clientX;
            currentTouchY = e.touches[0].clientY;
            const diffTouchX = currentTouchX - startTouchX;
            const diffTouchY = currentTouchY - startTouchY;
            const target = e.currentTarget;
            const currentTop = startTop + diffTouchY;
            const listTopArray = new Array();
            listArray.forEach((value) => {
                const list = value;
                const listTop = parseInt(list.style.top);
                listTopArray.push(listTop);
                listTopArray2.push(listTop);
            });
            listTopArray.sort(ascending);
            listTopArray2.sort(ascending);
            // 自リストのheightを返す関数
            function MyListHeight(list) {
                const listTop = list.getBoundingClientRect().top;
                const listBottom = list.getBoundingClientRect().bottom;
                const listHeight = listBottom - listTop;
                return listHeight;
            }
            const listHeightArray = new Array();
            orderListArrayFn(listArray).forEach((value, index) => {
                const list = value;
                const listTop = list.getBoundingClientRect().top;
                const listBottom = list.getBoundingClientRect().bottom;
                const listHeight = listBottom - listTop;
                listHeightArray.push(listHeight);
                list.style.top = `${positionTop(listHeightArray, index)}px`;
                // 掴んでいるリストが先頭(0番目)に位置しているとき
                if (listTopOrder(listTopArray, currentTop) === 0) {
                    const positionTopPlusFirstList = positionTop(listHeightArray, index) + MyListHeight(target);
                    list.style.top = `${positionTopPlusFirstList}px`;
                }
            });
            // リストを掴んだ状態でtouchmoveしてるとき
            if (target.classList.contains('grip')) {
                target.style.top = `${currentTop}px`;
                target.style.left = `${diffTouchX}px`;
            }
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
            // リストを掴んだ状態でmousemoveしてるとき
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
            orderListDOM(listArray);
        });
        list.addEventListener('mouseleave', function (e) {
            const target = e.currentTarget;
            defaultStyle(target);
        });
    });
});
