'use strict';

const taskboardList = document.querySelector('.taskboard');
const backlogTaskboard = document.querySelector('.taskboard__group--backlog');
const backlogTasks = backlogTaskboard.getElementsByClassName('task');
const processingTaskboard = document.querySelector('.taskboard__group--processing');
const processingTasks = processingTaskboard.querySelectorAll('.task:not(.task--empty)');
const doneTaskboard = document.querySelector('.taskboard__group--done');
const doneTasks = doneTaskboard.querySelectorAll('.task:not(.task--empty)');
const basketTaskboard = document.querySelector('.taskboard__group--basket');
const basketTasks = basketTaskboard.querySelectorAll('.task:not(.task--empty)');
const addTaskInput = document.querySelector('#add-task');
const addTaskForm = document.querySelector('.add-task__form');

const initTaskList = function (tasksList) {
    for (let task of tasksList) {
        task.draggable = true;
        const taskInput = task.querySelector('.task__input');
        const taskText = task.querySelector('.task__view');
        const taskEditButton = task.querySelector('.task__edit');
        const isEnterKey = function (evt) {
            if (evt.key === 'Enter') {
                taskText.textContent = taskInput.value;
                task.classList.remove('task--active');
                if (taskInput.value === '') {
                    taskInput.setCustomValidity('Введите название задачи!');
                    task.classList.add('task--active');
                    taskInput.reportValidity();
                } else {
                    taskText.textContent = taskInput.value;
                    task.classList.remove('task--active');
                }
            }
        }
        const setActiveTask = function () {
            for (let task of tasksList) {
                task.classList.remove('task--active');
            }
            window.setTimeout(() => taskInput.focus(), 0);
            task.classList.toggle('task--active');
        }
        taskEditButton.addEventListener('click', setActiveTask)
        taskInput.addEventListener('keydown', isEnterKey);
    }
}

initTaskList(backlogTasks);
initTaskList(processingTasks);
initTaskList(doneTasks);
initTaskList(basketTasks);

addTaskForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    backlogTaskboard.insertAdjacentHTML('beforeend', `
    <div class="taskboard__item task" draggable="true">
        <div class="task__body">
            <p class="task__view">${addTaskInput.value}</p>
            <input class="task__input" type="text" value="${addTaskInput.value}" required/>
        </div>
        <button class="task__edit" type="button" aria-label="Изменить"></button>
    </div>
    `);
    addTaskForm.reset();
    initTaskList(backlogTasks);
});

// Drag and Drop

taskboardList.addEventListener('dragstart', (evt) => {
    evt.target.classList.add('task--dragged');
});
taskboardList.addEventListener('dragend', (evt) => {
    evt.target.classList.remove('task--dragged');
});

const setTaskListDraggable = function (taskboard) {
    taskboard.addEventListener(`dragover`, (evt) => {
        evt.preventDefault();
        const activeElement = taskboard.querySelector(`.task--dragged`);
        const currentElement = evt.target;
        const isMoveable = activeElement !== currentElement && currentElement.classList.contains(`task`);
        if (!isMoveable) return;
        const nextElement = (currentElement === activeElement.nextElementSibling) ? currentElement.nextElementSibling : currentElement;
        taskboard.querySelector('.taskboard__list').insertBefore(activeElement, nextElement);
    });
}

setTaskListDraggable(backlogTaskboard);
setTaskListDraggable(processingTaskboard);
setTaskListDraggable(doneTaskboard);
setTaskListDraggable(basketTaskboard);
