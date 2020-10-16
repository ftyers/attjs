class ATT {
  constructor(t) { 
    console.log('ATT:' + t.length);
    this.t = t;
    this.compile();
    this.e = "@0@";
  }

  compile() { 
      console.log('compile:');
      this.states = new Set();
      this.transitions = {};
      this.finals = {};
      this.initial_state = 0;
   
      for(let i = 0; i < this.t.length; i++) {
        if(this.t[i].length == 2) {
          console.log('F:' + this.t[i]);
          let state = this.t[i][0];
          this.finals[state] = this.t[i][1];
	  continue;
        }
        //console.log('|' + this.t[i])
        let state = this.t[i][0];
        let inn = [this.t[i][0], this.t[i][2]];
        let out = [this.t[i][1], this.t[i][3]];
        if(!(state in this.states)) {
          this.states.add(state);
        }
        if(!(inn in this.transitions)) {
          
          this.transitions[inn] = []
        }     
        this.transitions[inn].push(out);
      }
      console.log(this.states);
      console.log(this.transitions);
  }

  step(S, c) { 
    console.log('   > step: ' + S + " ||| " + c);
    let reached_states = new Set();
//    if(S in this.finals) {
//      return reached_states.add(S);
//    }
    let transition = [S, c];
    if(transition in this.transitions) {
      console.log('   # ' + transition);
      for(let target of this.transitions[transition]) {
        this.closure(target[0], reached_states);
        reached_states.add(target[0]);
        console.log('[1]   Reached:');
        console.log(reached_states);
        if(!(target[0] in this.state_output_pairs)) {
          this.state_output_pairs[target[0]] = new Set();
        }
        for(let pair of this.state_output_pairs[target[0]]) {
          this.state_output_pairs[target[0]].add([pair[1], target[0]]);
        }
        this.closure(target[0], reached_states);
      }
    }
    console.log('   < step: ' + reached_states + ' Reached:');
    console.log(reached_states);
    console.log('   ----');
    return reached_states;
  }

  closure(S, reached_states) { 
    console.log('   > closure: ' + S);

    if(!(S in this.state_output_pairs)) {
      this.state_output_pairs[S] = new Set();
    }
    let transition = [S, this.e];
    console.log('   %: ' + transition);
    if(transition in this.transitions) {
      console.log('    trans: ' + transition);
      for(let state in transitions[transition]) {
        console.log('    state: ' + state);
        reached_states.add(state[0]);
        
        if(!(state[1] in this.state_output_pairs)) {
          this.state_output_pairs[state[0]] = new Set();
        }

        for(let pair of this.state_output_pairs[state]) {
          this.state_output_pairs[state[0]].add([pair[0] + state[0], state[1]]);
        }

        this.closure(state[0], reached_states);
      }
    }
    console.log('   < closure: ' + reached_states.size + ' Reached:');
    console.log(reached_states);
    console.log('   ----');
    return reached_states;
  }


  _union(a, b) {
    let ab = new Set(a)
    for (let elem of b) {
      ab.add(elem)
    }
    return ab;
  }

  lookup(s) { 
    console.log('lookup:' + s);
    this.state_output_pairs = {};    
    this.state_output_pairs[0] = new Set([['', 0]]); 
    let accepting_output_pairs = {};    
    let current_states = new Set([0]); 
    let input = s;
    let i = 0;
    while(i < s.length) { 
      console.log('----------------------------------------------');
      console.log('| ' + i + " " + s[i] + " ||| " + current_states.size);
      let reached_states = new Set();
      for(let state of current_states) {
        console.log(this.state_output_pairs);
        console.log('@ state: ' + state);
        if(!(state in this.state_output_pairs)) {
          this.state_output_pairs[state] = {}
        }
        let reached = this.step(state, s[i]);
        reached_states = this._union(reached_states, reached);
      }
      console.log('& ' + i + " " + s[i] + " ||| " + reached_states.size);
      console.log(reached_states);
      current_states = reached_states;

      input += s[i]
      i++;
    }
  }

  invert() { 
    console.log('invert:');
  }
}


