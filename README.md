```
                ;                                                                             ,                                  ;                                                                         
                ED.                                                                 :         Et                          :      ED.                                                                       
                E#Wi                          ,;L.                                 t#,        E#t                  .,    t#,     E#Wi                 ,;                                               .   
                E###G.                      f#i EW:        ,ft                    ;##W.       E##t                ,Wt   ;##W.    E###G.             f#i        t                    t                 ,W   
             .. E#fD#W;                   .E#t  E##;       t#E GEEEEEEEL         :#L:WE       E#W#t              i#D.  :#L:WE    E#fD#W;          .E#t         EE.                  EE.              i##   
            ;W, E#t t##L     t      .DD. i#W,   E###t      t#E ,;;L#K;;.        .KG  ,#D      E#tfL.            f#f   .KG  ,#D   E#t t##L        i#W,          :KW;           :     :KW;            f###   
           j##, E#t  .E#K,   EK:   ,WK. L#D.    E#fE#f     t#E    t#E           EE    ;#f     E#t             .D#i    EE    ;#f  E#t  .E#K,     L#D.             G#j         G#j      G#j          G####   
          G###, E#t    j##f  E#t  i#D :K#Wfff;  E#t D#G    t#E    t#E          f#.     t#i ,ffW#Dffj.        :KW,    f#.     t#i E#t    j##f  :K#Wfff;            j#D.     .E#G#G      j#D.      .K#Ki##   
        :E####, E#t    :E#K: E#t j#f  i##WLLLLt E#t  f#E.  t#E    t#E          :#G     GK   ;LW#ELLLf.       t#f     :#G     GK  E#t    :E#K: i##WLLLLt        itttG#K,   ,W#; ;#E. itttG#K,    ,W#D.,##   
       ;W#DG##, E#t   t##L   E#tL#i    .E#L     E#t   t#K: t#E    t#E           ;#L   LW.     E#t             ;#G     ;#L   LW.  E#t   t##L    .E#L            E##DDDDG: i#K:   :WW:E##DDDDG:  i##E,,i##,  
      j###DW##, E#t .D#W;    E#WW,       f#E:   E#t    ;#W,t#E    t#E            t#f f#:      E#t              :KE.    t#f f#:   E#t .D#W;       f#E:          E#E       :WW:   f#D.E#E       ;DDDDDDE##DGi
     G##i,,G##, E#tiW#G.     E#K:         ,WW;  E#t     :K#D#E    t#E             f#D#;       E#t               .DW:    f#D#;    E#tiW#G.         ,WW;         E#E        .E#; G#L  E#E              ,##   
   :K#K:   L##, E#K##i       ED.           .D#; E#t      .E##E    t#E              G#t        E#t                 L#,    G#t     E#K##i            .D#;        E##EEEEEEt   G#K#j   E##EEEEEEt       ,##   
  ;##D.    L##, E##D.        t               tt ..         G#E     fE               t         E#t                  jt     t      E##D.               tt        tffffffffft   j#;    tffffffffft      .E#   
  ,,,      .,,  E#t                                         fE      :                         ;#t                                E#t                                                                   t   
                L:                                           ,                                 :;                                L:                                                                        

```

# Advent of Code with Bun
A template repository for solving Advent of Code and experimenting with Bun runtime.

## Getting started
1. Make sure you have installed [Bun](https://bun.sh/docs/installation#installing).
2. Install dependencies:
```bash
bun install
```
3. Create `.env` file based on `.env.example`.
4. Set your session token with environment variables to automatically fetch your input. You can obtain the session token from the AoC session cookie.

## Running the Code
To run any solution you have to run the `solve` script. It will create all directories and files for a day, and also it can fetch your input file. Besides that, it watches all the changes you make and shows a result in a terminal.

### Example usage
To run a solution for the first day:
```bash
bun solve 1
```
To run tests in watch mode:
```bash
bun test --watch 
```
## Structure
For each day a directory in `src` is created with the following structure:
```bash
📂 01
├── 📜 01.ts
├── 📜 01.test.ts
├── 📜 example.txt
└── 📜 input.txt
```
