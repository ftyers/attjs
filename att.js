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
      this.transitions = {}; // Add weights
      this.finals = new Set(); // Add weights
      this.initial_state = 0;
   
      for(let i = 0; i < this.t.length; i++) 
      {
        let state = parseInt(this.t[i][0]);
        if(this.t[i].length == 2) 
        {
          this.finals.add(state); // = this.t[i][1];
	  continue;
        }
        let inn = [parseInt(this.t[i][0]), this.t[i][2]];
        let out = [parseInt(this.t[i][1]), this.t[i][3]];
        if(!(state in this.states)) 
        {
          this.states.add(state);
        }
        if(!(inn in this.transitions)) 
        {
          this.transitions[inn] = []
        }     
        this.transitions[inn].push(out);
      }
      console.log(this.states);
      console.log(this.transitions);
      console.log(this.finals);
  }

  step(S, c) { 
    console.log('   > step: ' + S + " ||| " + c);
    // Set up a new set of states that we reach from this step
    let reached_states = new Set();
    if(S in this.finals) 
    { // Not sure about this, what happens if we hit a final before consuming all input?
      return reached_states.add(S);
    }

    // Our transition is [in_state, in_char] → [out_state, out_char]
    let transition = [S, c];
    if(transition in this.transitions) 
    {
//      console.log('   # ' + transition);
      for(let target of this.transitions[transition]) 
      {
        let reached_state = parseInt(target[0]);
        let output_symbol = target[1];
        console.log("    " + reached_state + " ||| " + output_symbol);
        reached_states = this.closure(reached_state, reached_states);
        reached_states.add(reached_state);
        console.log('    [1]   Reached:');
        console.log(reached_states);
        if(!(reached_state in this.state_output_pairs)) // We create a new s,o set
        { 
          this.state_output_pairs[reached_state] = new Set();
        }
        for(let pair of this.state_output_pairs[S].values()) // For each of the current pairs we make a new pair
        { 
          
          console.log(pair[0] + " /// " + pair[1]);
          let output_pair = {0: pair[0] + output_symbol, 1: reached_state};
          console.log('[1] OP:');
          console.log(output_pair);
          this.state_output_pairs[reached_state].add(output_pair);
          console.log(JSON.stringify(output_pair));
          console.log(JSON.stringify(this.state_output_pairs));
        }
        this.closure(reached_state, reached_states);
      }
    }
    console.log('   < step: ' + reached_states + ' Reached:');
    console.log(reached_states);
    console.log(JSON.stringify(this.state_output_pairs));
    console.log('   ----');
    return reached_states;
  }

  closure(S, reached_states) { 
//    console.log('   > closure: ' + S);
    if(!(S in this.state_output_pairs)) 
    {
      this.state_output_pairs[S] = new Set();
    }
    let transition = [S, this.e];
    if(transition in this.transitions) 
    {
//      console.log('    trans: ' + transition);
      for(let target of transitions[transition]) 
      {
        let reached_state = parseInt(target[0]);
        let output_symbol = target[1];
//        console.log('    state: ' + reached_state);
//        console.log('    output_sym: ' + reached_state);
        reached_states.add(reached_state);
        
        if(!(reached_state in this.state_output_pairs)) 
        {
          this.state_output_pairs[reached_state] = new Set();
        }

        for(let pair of this.state_output_pairs[S].values()) 
        {
          let output_pair = {0: pair[0] + output_symbol, 1: reached_state};
//          console.log('[2] OP:');
//          console.log(output_pair);
          this.state_output_pairs[reached_state].add(output_pair);
        }

        this.closure(state[0], reached_states);
      }
    }
//    console.log('   < closure: ' + reached_states.size + ' Reached:');
//    console.log(reached_states);
//    console.log(this.state_output_pairs);
//    console.log('   ----');
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
    console.log('lookup: ' + s);
    this.state_output_pairs = {};
    this.state_output_pairs[0] = new Set();
    this.state_output_pairs[0].add({0: '', 1: 0});
    let accepting_output_pairs = new Set();    
    let current_states = new Set([0]); 
    let input = s;
    let i = 0;
    while(i < s.length) 
    { 
      console.log('----------------------------------------------');
      console.log(JSON.stringify(this.state_output_pairs));
//      console.log('| ' + i + " " + s[i] + " ||| " + current_states.size);
      let reached_states = new Set();
      for(let state of current_states) 
      {
        console.log('@ state: ' + state);
        if(!(state in this.state_output_pairs)) 
        {
          this.state_output_pairs[state] = {}
        }
        let reached = this.step(state, s[i]);
        reached_states = this._union(reached_states, reached);
        delete this.state_output_pairs[state];
      }
      console.log(reached_states);
      current_states = reached_states;

      input += s[i]
      i++;
    }

    console.log('Accepting:');
    console.log(this.finals);
    for(let state of current_states) 
    {
      console.log('?');
      let output_pair = this.state_output_pairs[state];
      console.log(state);
      console.log(output_pair);
      console.log(output_pair[0]);
      console.log(output_pair[1]);
      if(this.finals.has(output_pair[1]))
      {
        console.log('ACCEPT:' + output_pair[0]);
        accepting_output_pairs.add(output_pair[0]);
      }
    }

    return accepting_output_pairs;
  }

  invert() { 
    console.log('invert:');
  }
}


