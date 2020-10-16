class ATT {
  constructor(t) { 
    console.log('ATT:' + t.length);
    this.t = t;
    this.compile();
  }

  compile() { 
      console.log('compile:');
      this.states = {};
      this.transitions = {};
      this.finals = {};
      this.initial_state = 0;
   
      for(let i = 0; i < this.t.length; i++) {
        if(this.t[i].length == 2) {
          console.log('F:' + this.t[i]);
          let state = this.t[i][0];
          this.finals[state] = [];
	  continue;
        }
        console.log('|' + this.t[i])
        let state = this.t[i][0];
        let inn = [this.t[i][0], this.t[i][2]];
        let out = [this.t[i][1], this.t[i][3]];
        if(!(state in this.states)) {
          this.states[state] = [];
        }
        if(!(inn in this.transitions)) {
          
          this.transitions[inn] = []
        }     
        this.transitions[inn].push(out);
      }
      console.log(this.states);
      console.log(this.transitions);
  }

  step(c) { 
    console.log('step:' + c);
  }

  closure() { 
    console.log('closure:');

  }

  _union(a,b) {
    au = {}; 
    for(let i = 0; i < a.length; i++) {
      au[a[i]] = "";
    }
    for(let i = 0; i < b.length; i++) {
      au[b[i]] = "";
    }
    return au;
  }

  lookup(s) { 
    console.log('lookup:' + s);
    let state_output_pairs = {};    
    let accepting_output_pairs = {};    
    let current_states = {0:""};
    let input = s;
    let i = 0;
    while(i < s.length) { 
      console.log('|' + i + " " + s[i] + " ||| " + current_states);
      let reached_states = {};
      for(let j = 0; j < current_states.length; j++) {
        state = current_states[j];
        if(!(state in state_output_pairs)) {
          state_output_pairs[state] = {}
        }
        let reached = step(state, s[i]);
        reached_states = this._union(reached_states, reached);
      }
      current_states = reached_states;

      input += s[i]
      i++;
    }
  }

  invert() { 
    console.log('invert:');
  }
}


