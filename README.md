# BLS12-381 library for BitcoinSV smart contract
sCrypt library of BLS12-381 Zero-Knowledge Proofs support.

[sCrypt projet](https://github.com/sCrypt-Inc/boilerplate)

## Prerequisites
1. [Visual Studio Code](https://code.visualstudio.com/download)
2. [VSCode Extension sCrypt IDE](https://scrypt-ide.readthedocs.io/en/latest/index.html) search sCrypt in the VS Code extensions marketplace
3. [Node.js ](https://nodejs.org/en/download/) require version >= 12

## How to run locally
1. Run `npm install` to install deps
2. Run testcase from VSCode GUI, select `testcase0.scrypttest.js` file, at file edit window click mouse right button, select menu `Run sCrypt Test`

## Library and API
1. Library
<pre>
├─ contracts
│    ├─ bls12381.scrypt          # bls12-381 library
│    ├─ bls12381pairing3.scrypt  # bls12-381 ZKP lib(Optimized 3-pairs)
│    └─ zksnark12381.scrypt      # zk-SNARKs verifier contract example
└─ tests
     └─ js
        ├─ testcase0.scrypttest.js     # simple testcase for quickstart
        └─ zksnark12381.scrypttest.js  # zk-SNARKs verifier API example
</pre>
2. API
```js
static function pairCheck3Point(
            PointG1 a0, PointG2 b0,
            fe12 millerb1a1,
            PointG1 a2, PointG2 b2,
            PointG1 a3, PointG2 b3) : bool
```

Parameter(3-pairs and 1 preCompute-pair)：
- a0 : A, b0 : B
- millerb1a1 : preCompute miller(α, β)
- a2 : L, b2 : ϒ
- a3 : C, b3 : δ

![formula](https://github.com/walker9296/BLS12-381/blob/main/res/formula.png)

3. Verifying Key and Proof data from snarkjs/Circom 
<pre>
snarkjs/Circom tutorial from [sCrypt.io](https://learn.scrypt.io/zh/courses/Build-a-zkSNARK-based-Battleship-Game-on-Bitcoin-630b1fe6c26857959e13e160/lessons/3/chapters/1)
verification_key.json</pre>
```json
{
 "protocol": "groth16",
 "curve": "bls12381",
 "nPublic": 1,
 "vk_alpha_1": [
  "32346008969010706098099582......",
  "76049043384175647750527948......",
  "1"
 ],
 "vk_beta_2": [
  [
   "6273519154370206315470602......",
   "3791946046381181804610386......"
  ],
  [
   "9460677876231521042461267......",
   "2990618629272669949054147......"
  ],
  [
   "1",
   "0"
  ]
 ],
 "vk_gamma_2": [
  [
   "3527010695874666181871391......",
   "3059144344244213709971259......"
  ],
  [
   "1985150602287291935568054......",
   "9275536654923324557472019......"
  ],
  [
   "1",
   "0"
  ]
 ],
 "vk_delta_2": [
  [
   "18955925536035496175100435......",
   "33805703456343192442446792......"
  ],
  [
   "17933818585896026470874437......",
   "31969977675675040825107847......"
  ],
  [
   "1",
   "0"
  ]
 ],
 "vk_alphabeta_12": [
  [
   [
    "29062082199832428590193266......",
    "29798557291243592499969274......"
   ],
   [
    "20107026956616444393738084......",
    "32289268603827469753471862......"
   ],
   [
    "37794026319284592346289528......",
    "20272682142916263712539484......"
   ]
  ],
  [
   [
    "11743275386962450858622313......",
    "32259555688411219769696279......"
   ],
   [
    "30689582621397702880031329......",
    "26992620205415957362265008......"
   ],
   [
    "75601830939387596427979121......",
    "26615242825680481419516490......"
   ]
  ]
 ],
 "IC": [
  [
   "179858356000600931711646127......",
   "109449849836785617237435633......",
   "1"
  ],
  [
   "341669953409364640506707154......",
   "269567940512467612709833828......",
   "1"
  ]
 ]
}
```
<pre>proof.json</pre>
```json
{
 "pi_a": [
  "386406607244204461706511455......",
  "335581415929813519000207633......",
  "1"
 ],
 "pi_b": [
  [
   "28933956745182175549507014......",
   "38297612061563005391669484......"
  ],
  [
   "36211079726457248706711194......",
   "66207589835138125701493128......"
  ],
  [
   "1",
   "0"
  ]
 ],
 "pi_c": [
  "302947598381396417530586627......",
  "399471004527677222502458913......",
  "1"
 ],
 "protocol": "groth16",
 "curve": "bls12381"
}
```