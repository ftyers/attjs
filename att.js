class ATT {
  constructor(t) {
    // Our transition table is [in_state, in_char] → [out_state, out_char]
    this.states = new Set();
    this.transitions = {}; // TODO: Add weights
    this.finals = new Set(); // TODO: Add weights
    this.initial_state = 0;
    this.e = "@0@";

    this.compile(t);
  }

  add_transition(in_state, out_state, in_sym, out_sym, weight) {
    if (!(in_state in this.states)) {
      this.states.add(in_state);
    }
    let in_pair = [in_state, in_sym];
    let out_pair = [out_state, out_sym];
    if (!(in_pair in this.transitions)) {
      this.transitions[in_pair] = [];
    }
    this.transitions[in_pair].push(out_pair);
  }

  convert_symbol(sym) {
    if (sym == "@_EPSILON_SYMBOL_@" || sym == "@0@") {
      return this.e;
    } else if (sym == "@_SPACE_@") {
      return " ";
    } else if (sym == "@_TAB_@") {
      return "\t";
    } else {
      return sym;
    }
  }

  process_array(arr) {
    if (arr.length == 0) {
      return;
    }
    let state = parseInt(arr[0]);
    if (arr.length < 3) {
      let weight = (arr.length > 1 ? parseFloat(arr[1]) : 0.0);
      this.finals.add(state);
    } else {
      let out_state = parseInt(arr[1]);
      let in_sym = this.convert_symbol(arr[2]);
      let out_sym = this.convert_symbol(arr[3]);
      let weight = (arr.length > 4 ? parseFloat(arr[4]) : 0.0);
      this.add_transition(state, out_state, in_sym, out_sym, weight);
    }
  }

  compile(arr) {
    console.log('compile:');
    if (Array.isArray(arr)) {
      arr.forEach(this.process_array.bind(this));
    } else {
      arr.split('\n')
        .map(s => s.trim().split('\t'))
        .forEach(this.process_array.bind(this));
    }
    console.log(this.states);
    console.log(this.transitions);
    console.log(this.finals);
  }

  epsilon_closure(S) {
    let ret = {};
    ret[S] = [''];
    let todo = new Set();
    todo.add(S);
    let next_todo = new Set();
    while (todo.length > 0) {
      for (let cur_state of todo) {
        let cur_pair = [cur_state, this.e];
        if (cur_pair in this.transitions) {
          this.transitions[cur_pair].forEach(function(trg) {
            if (!(trg[0] in ret)) {
              let s = ret[trg[0]];
              if (trg[1] != this.e) {
                s += trg[1];
              }
              if (!(trg[0] in ret)) {
                ret[trg[0]] = [];
              }
              ret[trg[0]].push(s);
              next_todo.push(trg[0]);
            }
          });
        }
      }
      todo = next_todo;
      next_todo.clear();
    }
    return ret;
  }

  step_state(S, c) {
    console.log('   > step_state: ' + S + " ||| " + c);
    let trans = [S, c];
    let ret = {};
    if (trans in this.transitions) {
      for (let target of this.transitions[trans]) {
        let close = this.epsilon_closure(target[0]);
        console.log("epsilon closure", close);
        let pre = (target[1] == this.e ? "" : target[1]);
        for (let dest in close) {
          if (!(dest in ret)) {
            ret[dest] = [];
          }
          close[dest].map(o => pre + o).forEach(o => ret[dest].push(o));
        }
      }
    }
    console.log("step_state return", ret);
    return ret;
  }

  _product(pref, suf) {
    return pref.map(a => suf.map(b => a + b)).flat();
  }

  step(ctx, c) {
    let ret = {};
    for (let S in ctx) {
      let pth = this.step_state(S, c);
      for (let dest in pth) {
        if (!(dest in ret)) {
          ret[dest] = [];
        }
        console.log("stepping from", S, "to", dest, ctx[S], pth[dest], this._product(ctx[S], pth[dest]));
        ret[dest] = ret[dest].concat(this._product(ctx[S], pth[dest]));
      }
    }
    return ret;
  }

  lookup(s) {
    console.log('lookup: ' + s);
    let ctx = {};
    ctx[this.initial_state] = [''];
    for (let c of s) {
      ctx = this.step(ctx, c);
    }

    let ret = new Set();

    for (let state in ctx) {
      if (this.finals.has(parseInt(state))) {
        ctx[state].forEach(o => ret.add(o));
      }
    }
    return ret;
  }

  invert() {
    console.log('invert:');
  }
}
