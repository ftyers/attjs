class ATT {
  constructor(t) { 
    console.log('ATT:' + t.length);
    this.t = t;
    this.compile();
    this.e = "@0@";
  }

  compile() { 
      // Our transition table is [in_state, in_char] → [out_state, out_char]
      console.log('compile:');
      this.states = new Set();
      this.transitions = {}; // TODO: Add weights
      this.finals = new Set(); // TODO: Add weights
      this.initial_state = 0;
   
      for(let i = 0; i < this.t.length; i++) 
      {
        let state = parseInt(this.t[i][0]);
        if(this.t[i].length == 2) 
        {
          this.finals.add(state);
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
//    if(this.finals.has(S)) 
//    { // Not sure about this, what happens if we hit a final before consuming all input?
//      return reached_states.add(S);
//    }

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
        this.new_output_pairs = this.state_output_pairs
        if(!(reached_state in this.new_output_pairs)) // We create a new s,o set
        { 
          this.state_output_pairs[reached_state] = new Set();
        }
        var pairs = Array.from(this.new_output_pairs[S].values());
        for(let pair of pairs) // For each of the current pairs we make a new pair
        { 
          
          console.log(pair[0] + " /// " + pair[1]);
          let output_pair = {0: pair[0] + output_symbol, 1: reached_state};
          console.log('[1] OP:');
          console.log(output_pair);
          this.new_output_pairs[reached_state].add(output_pair);
        }
        this.state_output_pairs = this.new_output_pairs;
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
        
        this.new_output_pairs = this.state_output_pairs;
        if(!(reached_state in this.new_output_pairs)) 
        {
          this.new_output_pairs[reached_state] = new Set();
        }

        for(let pair of this.new_output_pairs[S].values()) 
        {
          let output_pair = {0: pair[0] + output_symbol, 1: reached_state};
//          console.log('[2] OP:');
//          console.log(output_pair);
          this.new_output_pairs[reached_state].add(output_pair);
        }
        this.state_output_pairs = this.new_output_pairs;

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
    // A union function for two sets, because it isn't a JS builtin
    // NB: This is not the same as FST union
    let ab = new Set(a)
    for (let elem of b) {
      ab.add(elem)
    }
    return ab;
  }

  initialise() {
    this.state_output_pairs = {};
    this.state_output_pairs[0] = new Set();
    this.state_output_pairs[0].add({0: '', 1: 0});
    this.new_output_pairs = {};
  }

  lookup(s) { 
    console.log('lookup: ' + s);
    this.initialise();
    let accepting_output_pairs = new Set();    
    let current_states = new Set([0]);  // Set of states that the machine is in
    let input = s[0];  // To keep track of how much input has been consumed
    let i = 0; 
    while(i < s.length) 
    { 
      console.log('----------------------------------------------');
      console.log(this.state_output_pairs);
      let reached_states = new Set(); // States have we reached with this input
      this.new_output_pairs = this.state_output_pairs;
      for(let state of current_states) 
      {
        console.log('@ state: ' + state);
        if(!(state in this.new_output_pairs)) 
        {
          this.new_output_pairs[state] = new Set();
        }
        let reached = this.step(state, s[i]); // Step the transducer
        reached_states = this._union(reached_states, reached); 
        if(!(reached_states.has(state))) 
        {
          delete this.new_output_pairs[state];
        }
        this.state_output_pairs = this.new_output_pairs;
      }
      current_states = reached_states; 

      input += s[i]
      i++;
    }

    console.log('Accepting:');
    console.log(this.finals);
    for(let state of current_states) 
    {
      console.log('?');
      let output_pairs = this.state_output_pairs[state];
      console.log(state);
      console.log(output_pairs);
      if(this.finals.has(state))
      {
        for(let output_pair of output_pairs.values()) 
        {
          console.log('ACCEPT:' + output_pair[0]);
          accepting_output_pairs.add(output_pair[0]);
        }
      }
    }

    return accepting_output_pairs;
  }

  invert() { 
    console.log('invert:');
  }
}


