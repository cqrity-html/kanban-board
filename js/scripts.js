'use strict';

const taskboardList = document.querySelector(".taskboard");
const backlogTaskboard = document.querySelector(".taskboard__group--backlog");
const backlogTasks = backlogTaskboard.getElementsByClassName("task");
const processingTaskboard = document.querySelector(".taskboard__group--processing");
const processingTasks = processingTaskboard.getElementsByClassName("task");
const doneTaskboard = document.querySelector(".taskboard__group--done");
const doneTasks = doneTaskboard.getElementsByClassName("task");
const basketTaskboard = document.querySelector(".taskboard__group--basket");
const basketTasks = basketTaskboard.getElementsByClassName("task");
const basketList = basketTaskboard.querySelector(".taskboard__list--trash");
const addTaskInput = document.querySelector("#add-task");
const addTaskForm = document.querySelector(".add-task__form");
const emptyTasks = document.querySelectorAll(".task--empty");
const buttonClear = document.querySelector(".button--clear");

const initTaskList = function (tasksList) {
    for (let task of tasksList) {
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

    emptyTasks.forEach((task) => (task.style.display = "none"));
};

initTaskList(backlogTasks);
initTaskList(processingTasks);
initTaskList(doneTasks);
initTaskList(basketTasks);

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
    initTaskList(backlogTasks);
});

// Drag and Drop

taskboardList.addEventListener("dragstart", (evt) => {
    evt.target.classList.add("task--dragged");
});
taskboardList.addEventListener("dragend", (evt) => {
    evt.target.classList.remove("task--dragged");
});

const showEmptyList = function (activeList, activeTasks) {
    const emptyField = activeList.querySelector(".task--empty");
    if (activeTasks.length === 0) {
        emptyField.style.display = "block";
    } else {
        emptyField.style.display = "none";
    }
};

const refreshTaskClasses = function (activeElement) {
    activeElement.classList.remove(...activeElement.classList);
    activeElement.classList.add('taskboard__item');
    activeElement.classList.add('task');
}

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
    console.log(currentElement.querySelector(`p`));
    console.log(nextElement.querySelector(`p`));

    currentList
        .querySelector(".taskboard__list")
        .insertBefore(activeElement, nextElement);

    if (currentList.closest(".taskboard__group").classList.contains('taskboard__group--backlog')) {
        refreshTaskClasses(nextElement);
    }
    if (currentList.closest(".taskboard__group").classList.contains('taskboard__group--processing')) {
        refreshTaskClasses(activeElement);
        activeElement.classList.add('task--processing');
    }
    if (currentList.closest(".taskboard__group").classList.contains('taskboard__group--done')) {
        refreshTaskClasses(activeElement);
        activeElement.classList.add('task--done');
    }
    if (currentList.closest(".taskboard__group").classList.contains('taskboard__group--basket')) {
        refreshTaskClasses(activeElement);
        activeElement.classList.add('task--basket');
    }
    if (activeList !== backlogTaskboard) showEmptyList(activeList, activeTasks);
});

buttonClear.addEventListener('click', () => {
    basketList.innerHTML = '';
    basketTaskboard.querySelector(".task--empty-trash").style.display = "block";
    buttonClear.disabled = 'true';
}
);
