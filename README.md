# Smart Task List

A lightweight browser-based task manager built with HTML, CSS, and vanilla JavaScript.

## Features
- Add, edit, complete, and delete tasks
- Filter all, completed, and incomplete tasks
- Persist tasks in browser `localStorage`
- Completion progress indicator and live clock
- Keyboard support for adding, editing, and activating task editing
- Safe text rendering with `textContent` to avoid interpreting task text as HTML

## Run locally
No build tools or backend are required. Open `index.html` in a modern browser, or serve the folder with a local static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Manual test checklist
- Add a task using the button and Enter.
- Try adding whitespace only; no empty task should be created.
- Complete a task and verify the progress bar and counter.
- Switch between All, Completed, and Incomplete filters.
- Double-click a task or focus it and press Enter to edit it.
- Save an edit with the button or Enter; cancel with the button or Escape.
- Delete a task while viewing each filter.
- Refresh the page and confirm tasks remain.
- Enter text such as `<img src=x onerror=alert(1)>`; it must display as text, not execute.

## Technical notes
- Tasks have stable IDs rather than relying on array positions.
- Invalid or unavailable local storage is handled without crashing the app.
- The counter always reflects all tasks, not only the currently filtered subset.
- This is a frontend learning project. It does not synchronize across devices and has no authentication, server persistence, automated browser tests, or multi-user support.
