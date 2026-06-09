// This code was written by Francesco Serangeli (@aerusW on Github)

const taskStore = (() => {
  const KEY = 'task-list';

  // Reads list and creates a new one if missing or corrupted
  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  };

  // Saves the list to localStorage
  const save = (tasks) => localStorage.setItem(KEY, JSON.stringify(tasks));

  return {
    // Returns all tasks
    getAll() {
      return load();
    },

    add(text) {
      const tasks = load();
      const task = {
        id: Date.now(),           // used as a unique identifier
        text: text.trim(),
        done: false,
        createdAt: new Date().toISOString(),
      };
      tasks.push(task);
      save(tasks);
      return task;
    },

    toggle(id) {
      const tasks = load();
      const task = tasks.find(t => t.id === id);
      if (task) { task.done = !task.done; save(tasks); }
      return task ?? null;
    },

    update(id, text) {
      const tasks = load();
      const task = tasks.find(t => t.id === id);
      if (task) { task.text = text.trim(); save(tasks); }
      return task ?? null;
    },

    remove(id) {
      const tasks = load();
      const idx = tasks.findIndex(t => t.id === id);
      if (idx === -1) return false;
      tasks.splice(idx, 1); // splice instead of filter to avoid rewriting the whole array reference
      save(tasks);
      return true;
    },

    // Replaces the entire task list with a new one (used for import)
    replaceAll(newTasks) {
        save(newTasks);
    },

    // Deletes all tasks
    clear() {
      save([]);
    },
  };
})();