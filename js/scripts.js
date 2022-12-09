"use strict";

const tasks = document.getElementsByClassName("task");
const taskboardList = document.querySelector(".taskboard");
const taskLists = document.querySelectorAll(".taskboard__group");
const backlogTaskboard = document.querySelector(".taskboard__group--backlog");
const basketTaskboard = document.querySelector(".taskboard__group--basket");
const basketTasks = basketTaskboard.getElementsByClassName("task");

const addTaskInput = document.querySelector("#add-task");
const addTaskForm = document.querySelector(".add-task__form");
const emptyTasks = document.querySelectorAll(".task--empty");
const buttonClear = document.querySelector(".button--clear");

emptyTasks.forEach((task) => (task.style.display = "none"));

const initTaskList = function (tasksList) {
    for (let task of tasksList) {
        if (!task.classList.contains("task--empty")) {
            task.draggable = true;
            const taskInput = task.querySelector(".task__input");
            const taskText = task.querySelector(".task__view");
            const taskEditButton = task.querySelector(".task__edit");
            const isEnterKey = function (evt) {
                if (evt.key === "Enter") {
                    taskText.textContent = taskInput.value;
                    task.classList.remove("task--active");
                    if (taskInput.value === "") {
                        taskInput.setCustomValidity("Введите название задачи!");
                        task.classList.add("task--active");
                        taskInput.reportValidity();
                    } else {
                        taskText.textContent = taskInput.value;
                        task.classList.remove("task--active");
                    }
                }
            };
            const setActiveTask = function () {
                for (let task of tasksList) {
                    task.classList.remove("task--active");
                }
                window.setTimeout(() => taskInput.focus(), 0);
                task.classList.toggle("task--active");
            };

            taskEditButton.addEventListener("click", setActiveTask);
            taskInput.addEventListener("keydown", isEnterKey);
        }
    }
};

initTaskList(tasks);

addTaskForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    backlogTaskboard.insertAdjacentHTML(
        "beforeend",
        `
    <div class="taskboard__item task" draggable="true">
        <div class="task__body">
            <p class="task__view">${addTaskInput.value}</p>
            <input class="task__input" type="text" value="${addTaskInput.value}" required/>
        </div>
        <button class="task__edit" type="button" aria-label="Изменить"></button>
    </div>
    `
    );
    addTaskForm.reset();
    initTaskList(tasks);
    if (basketTasks.length === 0)
        basketTaskboard.querySelector(".task--empty-trash").style.display = "block";
});

// Drag and Drop

taskboardList.addEventListener("dragstart", (evt) => {
    evt.target.classList.add("task--dragged");
});
taskboardList.addEventListener("dragend", (evt) => {
    evt.target.classList.remove("task--dragged");
});

taskboardList.addEventListener(`dragover`, (evt) => {
    evt.preventDefault();
    const activeElement = taskboardList.querySelector(`.task--dragged`);
    const currentElement = evt.target;
    const activeList = activeElement.closest(".taskboard__group");
    const activeTasks = activeList.getElementsByClassName("task");
    const currentList = currentElement.closest(".taskboard__group");
    const isMoveable =
        activeElement !== currentElement &&
        currentElement.classList.contains(`task`);
    if (!isMoveable) return;

    const nextElement =
        currentElement === activeElement.nextElementSibling
            ? currentElement.nextElementSibling
            : currentElement;

    currentList
        .querySelector(".taskboard__list")
        .insertBefore(activeElement, nextElement);

    taskboardList.addEventListener(`dragend`, (evt) => {
        evt.preventDefault();

        const emptyField = activeList.querySelector(".task--empty");
        if (activeTasks.length === 1) {
            emptyField.style.display = "block";
        } else {
            emptyField.style.display = "none";
        }

        if (activeList === basketTaskboard && basketTasks.length === 1) {
            buttonClear.disabled = true;
        }

        if (currentList === basketTaskboard && basketTasks.length > 1) {
            buttonClear.disabled = false;
            currentList.querySelector(".task--empty").style.display = "none";
        }

        taskLists.forEach((list) => {
            if (currentList.classList.contains(`taskboard__group--${list.id}`)) {
                activeElement.classList.remove(...activeElement.classList);
                activeElement.classList.add("taskboard__item");
                activeElement.classList.add("task");
                activeElement.classList.add(`task--${list.id}`);
            }
        });
    });
});

buttonClear.addEventListener("click", () => {
    document.querySelector('.taskboard__list--trash').innerHTML = '';
    document.querySelector('.taskboard__list--trash').insertAdjacentHTML('afterbegin',
        `<div class="taskboard__item task task--empty task--empty-trash">
        <p>Корзина пуста</p>
    </div>`);
    buttonClear.disabled = true;
    basketTaskboard.querySelector(".task--empty-trash").style.display = "block";
});
