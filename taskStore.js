// This code was written by Francesco Serangeli (@aerusW on Github)
//
// The only thing in Facta that talks to localStorage about tasks.
// Design notes and the full API reference: docs/taskStore.md

const taskStore = (() => {
  // The localStorage key. Private: declared in here, so only load/save can see
  // it and the name can change without touching anything outside this file.
  const KEY = 'task-list';

  // Reads list and creates a new one if missing or corrupted
  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  };

  // Saves the list to localStorage
  const save = (tasks) => localStorage.setItem(KEY, JSON.stringify(tasks));

  // Everything below this line is the public surface. Anything not listed here
  // is unreachable from outside the file.
  return {
    // Returns all tasks
    getAll() {
      return load();
    },

    // Appends a new task and returns it, so the caller can use the id
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

    // Flips the done flag. Returns the task, or null if the id matched nothing
    toggle(id) {
      const tasks = load();
      const task = tasks.find(t => t.id === id);
      if (task) { task.done = !task.done; save(tasks); }
      return task ?? null;
    },

    // Replaces the text of one task. Returns the task, or null if not found
    update(id, text) {
      const tasks = load();
      const task = tasks.find(t => t.id === id);
      if (task) { task.text = text.trim(); save(tasks); }
      return task ?? null;
    },

    // Deletes one task. Returns whether there was anything there to delete
    remove(id) {
      const tasks = load();
      const idx = tasks.findIndex(t => t.id === id);
      if (idx === -1) return false;   // nothing matched, so nothing is written
      tasks.splice(idx, 1);
      save(tasks);
      return true;
    },

    // Deletes all tasks
    clear() {
      save([]);
    },
  };
})();
