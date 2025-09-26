console.log('app.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM ready');

  const form = document.getElementById('todoForm');
  const input = document.getElementById('todoInput');
  const list = document.getElementById('todoList');

  if (!form || !input || !list) {
    console.error('Elements not found:', { form, input, list });
    return;
  }

  const STORAGE_KEY = 'todo-items';

  function loadTodos() {
    const raw = localStorage.getItem(STORAGE_KEY);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Bad storage data, resetting', e);
      return [];
    }
  }

  function saveTodos(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function render(items) {
    list.innerHTML = '';
    items.forEach((item, index) => {
      const li = document.createElement('li');

      const span = document.createElement('span');
      span.textContent = item.text;
      if (item.done) {
        span.style.textDecoration = 'line-through';
        span.style.opacity = '0.7';
      }

      const actions = document.createElement('div');

      const doneBtn = document.createElement('button');
      doneBtn.type = 'button';
      doneBtn.textContent = item.done ? 'Cofnij' : 'Gotowe';
      doneBtn.addEventListener('click', () => {
        items[index].done = !items[index].done;
        saveTodos(items);
        render(items);
      });

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = 'Usuń';
      removeBtn.addEventListener('click', () => {
        items.splice(index, 1);
        saveTodos(items);
        render(items);
      });

      actions.appendChild(doneBtn);
      actions.appendChild(removeBtn);

      li.appendChild(span);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  let todos = loadTodos();
  render(todos);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    todos.push({ text, done: false });
    saveTodos(todos);
    render(todos);
    input.value = '';
    input.focus();
  });

  console.log('Storage init OK');
});