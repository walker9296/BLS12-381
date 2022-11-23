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
├─ contracts
│    ├─ bls12381.scrypt          # bls12-381 library
│    ├─ bls12381pairing3.scrypt  # bls12-381 ZKP library(Optimized 3-pairs)
│    └─ zksnark12381.scrypt      # zk-SNARKs verifier contract example
└─ tests
     └─ js
        ├─ testcase0.scrypttest.js     # simple testcase for quickstart
        └─ zksnark12381.scrypttest.js  # zk-SNARKs verifier API example

2. API
static function pairCheck3Point(
            PointG1 a0, PointG2 b0,
            fe12 millerb1a1,
            PointG1 a2, PointG2 b2,
            PointG1 a3, PointG2 b3) : bool
![formula](https://github.com/walker9296/BLS12-381/res/formula.png)
Parameter：
- a0 : A, b0 : B
- millerb1a1 : miller(α, β)
- a2 : L, b2 : ϒ
- a3 : C, b3 : δ
