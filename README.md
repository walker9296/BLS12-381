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
│    ├─ bls12381pairing3.scrypt  # bls12-381 ZKP library(Optimized 3-pairs)
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

Parameter：
- a0 : A, b0 : B
- millerb1a1 : miller(α, β)
- a2 : L, b2 : ϒ
- a3 : C, b3 : δ

![formula](https://github.com/walker9296/BLS12-381/blob/main/res/formula.png)

3. struct
```js
struct VerifyingKey3Point {
    fe12 millerb1a1;
    PointG2 gamma;
    PointG2 delta;
    PointG1[2] ic;
}

struct Proof {
    PointG1 a;
    PointG2 b;
    PointG1 c;
}
```

4. proof from snarkjs/Circom 
```json
{
 "pi_a": [
  "3864066072442044617065114552833466584042085701738353220164544584145751029539402978131016273009314132150769427595895",
  "3355814159298135190002076333739339178050040399175773924788564537314826497450614138800531167328973602284194463447393",
  "1"
 ],
 "pi_b": [
  [
   "2893395674518217554950701443229224177489767268958883288202234645730855163899540609327650775482511602222528677445055",
   "3829761206156300539166948423649641077984800399236642826996509414942600520883657558642169662935637571201305391964185"
  ],
  [
   "3621107972645724870671119401731521393129268399467683781133691676929348754474430192129852854560460487015138553716416",
   "662075898351381257014931284262317806493258333997811326084727919914234359614329656930791469314234668194751038193240"
  ],
  [
   "1",
   "0"
  ]
 ],
 "pi_c": [
  "3029475983813964175305866272217773353246124571532119347143042601933526621188482009919399467966544521724299619278426",
  "3994710045276772225024589135609692709389375051369642700070481270018000659515185268757404721625054279542057314386988",
  "1"
 ],
 "protocol": "groth16",
 "curve": "bls12381"
}
```