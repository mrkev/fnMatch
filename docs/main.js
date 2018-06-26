
/** Setup editor */
const editor = CodeMirror.fromTextArea(document.getElementById('fsm_src'), {
  lineWrapping: true,
  lineNumbers: true,
  mode: 'javascript',
  styleActiveLine: true,
});

const log_pre = document.getElementById('errors'); // For error messages

/** Run */
d3.select('#run_button').on('click', () => {
  repl_console.clear();
  run_script(editor.getValue());
});

d3.select('#clear_button').on('click', () => {
  repl_console.clear();
});

const repl_console = {
  clear() {
    log_pre.textContent = '';
  },
  log(...args) {
    log_pre.textContent = log_pre.textContent + args.join(' ') + '\n';
  },
  error(err) {
    this.log(err.message);
  },
};

const __CONSOLE = console;
const { match, func } = fnMatch;

const run_script = (s) => {
  const f = new Function('console', s)
  f(repl_console)
};