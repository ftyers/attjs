# attjs

JavaScript library for ATT format finite-state transducers.

Convert the transducer to JavaScript:
```bash
hfst-fst2txt bas_AGLC-bas_MP.autoconv.hfst | sed 's/^/[/g' | sed 's/\t/,/1' | sed 's/\t/,"/1'  | sed 's/\t/","/1' | sed 's/\t/",/1' | sed 's/$/],/g'
```

