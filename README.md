# BLS12-381 library for BitcoinSV
[sCrypt](https://github.com/sCrypt-Inc/boilerplate) BLS12-381 Library for Bitcoin Zero-Knowledge Proofs Smart Contract support. The current sCrypt zero-knowledge proof library is based on BN256, the BLS12-381 Library for Bitcoin is the first implementation of BLS12-381 curve pairing verification on Bitcoin. Now you can choose to use BN256 or BLS12-381 to implement zero-knowledge proof applications.

For platform-agnostic applications, the choice requires a tradeoff between performance (BN254) and security (BLS12-381). We recommend choosing BLS12-381 as it is more secure, still fast enough to be practical, but slower than BN254. 

・ BN254 (254bit, 32byte P):
$\Tiny{P = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47}$<br>
$\Tiny{x = 0x44e992b44a6909f1}$<br>
$\Tiny{q = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001}$

・ BLS12-381 (381bit, 48byte P):
$\Tiny{P = 0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab}$
$\Tiny{x = 0xd201000000010000}$<br>
$\Tiny{q = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001}$

Reference:
- [Groth16](https://2π.com/22/groth16/#verifying)
- [Efficient zk-SNARKs on Bitcoin: Technical Explainer](https://xiaohuiliu.medium.com/efficient-zk-snarks-on-bitcoin-technical-explainer-880fa04ee155)
- [BLS12-381 For The Rest Of Us](https://hackmd.io/@benjaminion/bls12-381)

## Table of Contents
1. [The curves](#11-the-curves)
1. [Twists](#12-twists)
1. [Efficient Pairing](#13-efficient-pairing)
1. [Coordinate systems](#14-coordinate-systems)
1. [Montgomery form](#15-montgomery-form)
1. [Prerequisites](#2-prerequisites)
1. [How to run locally](#3-how-to-run-locally)
1. [Library](#41-library)
1. [API](#42-api)
1. [Verifying Key and Proof data](#43-verifying-key-and-proof-data-from-snarkjscircom)
1. [Test](#5-testcase)

## 1. Curve BLS12-381
Curve BLS12-381 is both **pairing-friendly** (making it efficient for digital signatures) and effective for constructing **zkSnarks**. The security target of BLS12-381 is 128 bits.

### 1.1 The curves
BLS12-381 deals with two curves, 
- the simpler one is over the finite field $F_q$ , equation is<br>
$y^2 = x^3 + 4$, call this curve $E(F_q)$
- the other one is defined over an extension of $F_q$ to $F_{q^2}$ , equation is<br>
$y^2 = x^3 + 4(1 + i)$, call this curve $E^′(F_{q^2})$.

A pairing is a bilinear map, it takes as input two points, each from a group of the same order r. these two groups call $G_1$ and $G_2$ .

### 1.2 Twists
BLS12-381 uses a twist, reduces the degree of the extension field by a factor of six. So $G_2$ on the twisted curve can be defined over $F_{q^2}$ instead of $F_{q^{12}}$ , which is a huge saving in complexity, doing arithmetic in $F_{q^{12}}$ is horribly complicated and inefficient.

Find a u such that $u^6 = (1+i)^{−1}$, 
then can define twisting transformation as
$$(x, y) → (x/u^2, y/u^3)$$
This transforms original curve
$$E:y^2 = x^3 + 4$$
into the curve
$$E^′:y^2 = x^3 + 4/u^6 = x^3 + 4(1 + i)$$

So these are the two groups we will be using:
- $G_1 ⊂ E(F_q)$ where $E:y^2 = x^3 + 4$
- $G_2 ⊂ E(F_{q^2})$ where $E^′:y^2 = x^3 + 4/u^6 = x^3 + 4(1 + i)$

### 1.3 Efficient Pairing
Calculation of a pairing has two parts: 
- Miller loop: compute an intermediate function of the two input points $f(pointG1, pointG2)$ recursively
- Final exponentiation: raise $f$ to a large power c

equation 1:
$$e(pointG1, pointG2) = f(pointG1, pointG2)^c$$
where $c = (q^{12} - 1)/r$ <br>
Both are quite expensive, but there’s a nice hack can reduce the impact of both of them.

#### 1.3.1 Reduce to 3 pairings
verifying equation 2：
$$e(A, B) = e(α, β) * e(L, ϒ) * e(C, δ)$$
where α and β are known at setup, so we can precompute the second pairing e(α, β) and replace α and β with it as part of the verification key, saving one pairing.

#### 1.3.2 One single final exponentiation
Eq.2 can be rewritten as:
$$e(α, β) * e(L, ϒ) * e(C, δ) * e(A, B)^{-1} = 1$$
e is bilinear，move the exponent (-1) into the bracket.
$$e(α, β) * e(L, ϒ) * e(C, δ) * e(-A, B) = 1$$
Plugging in Eq.1, we get:
$$(f(α, β) * f(L, ϒ) * f(C, δ) * f(-A, B))^c = 1$$
Instead of calculating final exponentiation 4 times, which are computationally intensive, we only have to do it once in the end.

Note that, the output file of `verification_key.json` from ***snarkjs/circom***, there is a `vk_alphabeta_12` item precomputed, but you can't use it for precomputed $f(α, β)$, this data is calculated by miller loop and finanl exponentiation $f(α, β)^c$ . You can run 
`testcase1.scrypt` contract in debug mode to get precomputed $f(α, β)$ data.

### 1.4 Coordinate systems
Finding the inverse of a field element is an expensive operation, so implementations of elliptic curve arithmetic try to avoid it as much as possible. 

#### 1.4.1 Affine coordinates
Affine coordinates are the traditional representation of points with just an $(x, y)$ pair of coordinates, where x and y satisfy the curve equation. This is what we normally use when storing and transmitting points.

The basic idea is to represent the coordinate using notional fractions, reducing the number of actual division operations needed. To do this, a third coordinate is introduced and use $(X, Y, Z)$ for the internal representation of a point. 
#### 1.4.2 Jacobian coordinates
The Jacobian point $(X, Y, Z)$ represents the Affine point $(X/Z^2, Y/Z^3)$. The curve equation becomes
$$Y^2 = X^3 + 4Z^6$$

Note that, the easiest way to import the Affine point $(x, y)$ is to map it to $(x, y, 1)$.

### 1.5 Montgomery form
A way to calculate modulo that doesn't require division is the so-called Montgomery multiplication. To calculate the modular multiplication operation,
1. convert the multiplier into Montgomery form,
2. use Montgomery multiplication,
3. convert the result from Montgomery form,<br>


## 2. Prerequisites
- [Visual Studio Code(VSC)](https://code.visualstudio.com/download)
- [VSC Extension sCrypt IDE](https://scrypt-ide.readthedocs.io/en/latest/index.html) search sCrypt in the VSC extensions marketplace
- [Node.js ](https://nodejs.org/en/download/) require version >= 12
- PC CPU >= 2.6GHz, Memory >= 24GB
## 3. How to run locally
1. Run `npm install` to install deps
2. Run testcase from VSCode GUI, select `testcase0.scrypttest.js` file, right mouse button click at file edit window, select menu `Run sCrypt Test`

## 4. Library and API
### 4.1 Library
<pre>
├─ contracts
│    ├─ bls12381.scrypt          # bls12-381 library
│    ├─ bls12381pairing.scrypt   # bls12-381 ZKP lib(Optimized 3-pairs)
│    └─ zksnark12381.scrypt      # zk-SNARKs verifier contract example
└─ tests
     └─ js
        ├─ testcase0.scrypttest.js        # simple testcase
        ├─ testcaseAzksnark.scrypttest.js # testcase A
        ├─ testcaseBzksnark.scrypttest.js # testcase B
        ├─ testcaseCzksnark.scrypttest.js # testcase C
        └─ testcaseDzksnark.scrypttest.js # testcase D
</pre>
### 4.2 API
```js
static function pairCheck3Point(
            PointG1 a0, PointG2 b0,
            fe12 millerb1a1,
            PointG1 a2, PointG2 b2,
            PointG1 a3, PointG2 b3) : bool
```
parameter(3-pairs and 1 preCompute-pair)：
- a0 : ***A***, b0 : ***B***
- millerb1a1 : preCompute miller(***α***, ***β***)
- a2 : ***L***, b2 : ***ϒ***
- a3 : ***C***, b3 : ***δ***

| PointG1 | PointG2 | PointG1 | PointG2 |
| ------- | ------- | ------- | ------- |
| a0  | b0  | ***A***  | ***B***  |
| a1  | b1  | ***α***  | ***β***  |
| a2  | b2  | ***L***  | ***ϒ***  |
| a3  | b3  | ***C***  | ***δ***  |

verifying equation 2：
$$e(A, B) = e(α, β) * e(L, ϒ) * e(C, δ)$$
#### 4.2.1 Verifying Key and Proof data from snarkjs/Circom 
![zkSNARK](https://github.com/walker9296/BLS12-381/blob/main/res/zkSNARK.png)

You can find zkSNARK snarkjs/Circom tutorials by [sCrypt.io](https://learn.scrypt.io/zh/courses/Build-a-zkSNARK-based-Battleship-Game-on-Bitcoin-630b1fe6c26857959e13e160/lessons/3/chapters/1)

You need to select the ***bls12381*** curve command line option when executing the ***snarkjs/Circom*** command, because the default is the `bn128` curve.
E.g,
- when compile circuit<br>
`circom ../work_circom/factor.circom --r1cs --wasm --prime bls12381`
- when start a new powers of tau ceremony<br>
`snarkjs powersoftau new bls12-381 12 pot12_0000.ptau`

Then you can confirm that there is a `"curve": "bls12381"` item in the output `verification_key.json` and `proof.json` files instead of `"curve": "bn128"` item.

From the `proof.json` file obtain the ***A***, ***B***, ***C*** parameters, and from the `verification_key.json` file obtain the ***α***, ***β***, ***ϒ***, ***δ*** parameters, use the ***ic*** item and the public inputs from the `public.json` file to calculate the ***L*** parameter:
$$L = \sum_{i=0}^n w_i*IC_i$$
where public inputs $w = (1, w_1, …, w_i)$
#### 4.2.2 verification_key.json
[testcase B verification_key.json](https://github.com/walker9296/BLS12-381/blob/main/tests/snarkjs_output_json/caseB/verification_key.json)
```json
{
 "protocol": "groth16",
 "curve": "bls12381",
 "nPublic": 1,
 "vk_alpha_1": ["32346008969010......", "760490433841......", "1"],
 "vk_beta_2": [["62735191543702......", "379194604638......"],
               ["94606778762315......", "299061862927......"],
               ["1", "0"]],
 "vk_gamma_2": [["3527010695874......", "305914434424......"],
                ["1985150602287......", "927553665492......"],
                ["1", "0"]],
 "vk_delta_2": [["1895592553603......", "338057034563......"],
                ["1793381858589......", "319699776756......"],
                ["1", "0"]],
 "vk_alphabeta_12": [
      [["29062082199832......", "29798557291243......"],
       ["20107026956616......", "32289268603827......"],
       ["37794026319284......", "20272682142916......"]],
      [["11743275386962......", "32259555688411......"],
       ["30689582621397......", "26992620205415......"],
       ["75601830939387......", "26615242825680......"]]],
 "IC": [
      ["179858356000600......", "10944984983678......", "1"],
      ["341669953409364......", "26956794051246......", "1"]]
}
```
#### 4.2.3 proof.json
[testcase A proof.json](https://github.com/walker9296/BLS12-381/blob/main/tests/snarkjs_output_json/caseA/proof.json)
```json
{
 "pi_a": ["386406607244204......", "3355814159298......", "1"],
 "pi_b": [["28933956745182......", "3829761206156......"],
          ["36211079726457......", "6620758983513......"],
          ["1", "0"]],
 "pi_c": ["302947598381396......", "3994710045276......", "1"],
 "protocol": "groth16",
 "curve": "bls12381"
}
```
#### 4.2.4 public.json
[testcase A public.json](https://github.com/walker9296/BLS12-381/blob/main/tests/snarkjs_output_json/caseB/public.json)
```json
[
 "13221"
]
```

## 5. Testcase
### 5.1 Design a circuit
Implement a circuit in the Circom language. For example, this simple  proves that people know to factor the integer n into two integers without revealing the integers. The circuit has two private inputs named p and q and one public input named n.
```c
// p and q are factorizations of n
pragma circom 2.0.0;

template Factor() {
    // Private Inputs:
    signal input p;
    signal input q;
    // Public Inputs:
    signal output n;

    assert(p > 1);
    assert(q > 1);

    n <== p * q;
}

component main = Factor();
```

### 5.2 Testcase A, B, C, D
Two private inputs p and q, and one public input n.
| Testcase | p | q | n |
| ------- | ------- | ------- | ------- |
| A  | 7  | 13  | 91  |
| B  | 117  | 112  | 13221  |
| C  | 2  | 4  | 8  |
| D  | 353457875866834523  | 95829357230752351385  | 33871641052465802932898657193367175168 |

### 5.3 Testnet deploy
#### Contract
[zksnark12381deploy.scrypt](https://github.com/walker9296/BLS12-381/blob/main/contracts/zksnark12381deploy.scrypt)
#### Deploy and unlock()
![deploy_unlock](https://github.com/walker9296/BLS12-381/blob/main/res/deploy_unlock.png)

#### Testnet - DeployTx
![testnet_tx](https://github.com/walker9296/BLS12-381/blob/main/res/testnet_tx.png)
https://test.whatsonchain.com/tx/eba34263bbede27fd1e08a84459066fba7eb10510a3bb1d92d735c067b8309dd
