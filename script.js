let columnId = 3;
let draggedNote = null;
let draggedColumn = null;
//Обработка создании карточки заметки
const columnProcess = (item) => {
  console.log(item);
  const addNote = item.querySelector("[data-action-addnote]");
  addNote.addEventListener("click", () => {
    //class="note" draggable="true" data-note-id="1"
    const note = document.createElement("div");
    note.classList.add("note");
    note.setAttribute("draggable", "true");
    note.setAttribute("id", 8);

    item.querySelector("[data-notes]").append(note);
    columnChange(note);

    note.setAttribute("contenteditable", "true");
    note.focus();
  });

  const columnHeader = item.querySelector(".column-header");
  columnChange(columnHeader);

  item.addEventListener("dragstart", function (event) {
    draggedColumn = event.target;
    draggedColumn.classList.add("dragged");
  });

  item.addEventListener("dragend", function (event) {
    draggedColumn = null;
    event.target.classList.remove("dragged");
  });

  item.addEventListener("dragenter", function (event) {
    if (event.target === draggedColumn) {
      return;
    }
  });

  item.addEventListener("dragover", function (event) {
    event.preventDefault();
  });
  item.addEventListener("drop", function (event) {
    if (draggedNote) {
      return item.querySelector("[data-notes]").append(draggedNote);
    } else if (event.target.parentElement === draggedColumn.parentElement) {
      const column = item;
      console.log(column);
    }
  });
};

//Клик карточки
const columnChange = (item) => {
  item.addEventListener("dblclick", (event) => {
    item.setAttribute("contenteditable", "true");
    item.removeAttribute("draggable");
    item.closest(".column").removeAttribute("draggable");
    item.focus();
  });
  item.addEventListener("blur", () => {
    item.removeAttribute("contenteditable");
    item.setAttribute("draggable", "true");
    item.closest(".column").setAttribute("draggable", "true");
    if (!item.textContent.trim().length) {
      item.remove();
    }
  });

  item.addEventListener("dragstart", function (event) {
    draggedNote = event.target;
    draggedNote.classList.add("dragged");
    // draggedNote.style.cursor = "grabbing";
  });
  item.addEventListener("dragend", function (event) {
    draggedNote = null;
    event.target.classList.remove("dragged");

    document
      .querySelectorAll(".note")
      .forEach((item) => item.classList.remove("under"));
  });
  //если перетащили на какой-то элемент
  item.addEventListener("dragenter", function (event) {
    if (event.target === draggedNote) {
      return;
    }
    event.target.classList.add("under");
  });
  item.addEventListener("dragover", function (event) {
    event.preventDefault();
    if (event.target === draggedNote) {
      return;
    }
  });
  //если покинули какой-то элемент
  item.addEventListener("dragleave", function (event) {
    if (event.target === draggedNote) {
      return;
    }
    event.target.classList.remove("under");
  });
  item.addEventListener("drop", function (event) {
    event.stopPropagation();
    if (draggedNote === event.target) {
      return;
    }
    //если отличаются родители

    if (event.target.parentElement === draggedNote.parentElement) {
      const note = Array.from(
        event.target.parentElement.querySelectorAll(".note")
      );
      const indexA = note.indexOf(event.target);
      const indexB = note.indexOf(draggedNote);
      if (indexA < indexB) {
        event.target.parentElement.insertBefore(draggedNote, event.target);
      } else {
        event.target.parentElement.insertBefore(
          draggedNote,
          event.target.nextElementSibling
        );
      }
    } else {
      event.target.parentElement.insertBefore(draggedNote, event.target);
    }
  });
};

//ищем все колонки и обрабатываем клик
const columns = document.querySelectorAll(".column").forEach(columnProcess);

//создаем колонку принажатии
document
  .querySelector("[data-action-addColumn]")
  .addEventListener("click", () => {
    const column = document.createElement("div");
    column.classList.add("column");
    column.setAttribute("draggable", "true");
    columnId++;
    column.setAttribute("id", columnId);

    column.innerHTML = `
        <p class="column-header" contenteditable="true">В плане</p>
            <div data-notes></div>
            <p class="column-footer">
            <span data-action-addNote class="action"
                >+ Добавить карточку</span
            >
        </p>`;
    document.querySelector(".columns").append(column);
    columnProcess(column);
  });

document.querySelectorAll(".note").forEach(columnChange);
