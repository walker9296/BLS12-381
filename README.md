# BLS12-381 library for BitcoinSV Smart Contract
[sCrypt](https://github.com/sCrypt-Inc/boilerplate) Library of BLS12-381 Zero-Knowledge Proofs support.

For platform-agnostic applications, the choice requires a tradeoff between performance (BN254) and security (BLS12-381). We recommend choosing BLS12-381 as it is more secure, still fast enough to be practical, but slower than BN254. 

Reference:
- [Groth16](https://2π.com/22/groth16/#verifying)
- [Efficient zk-SNARKs on Bitcoin: Technical Explainer](https://xiaohuiliu.medium.com/efficient-zk-snarks-on-bitcoin-technical-explainer-880fa04ee155)
- [BLS12-381 For The Rest Of Us](https://hackmd.io/@benjaminion/bls12-381)

Curve BLS12-381 is both **pairing-friendly** (making it efficient for digital signatures) and effective for constructing **zkSnarks**. The security target of BLS12-381 is 128 bits.

### The curves
BLS12-381 deals with two curves, 
- the simpler one is over the finite field $F_q$ , equation is<br>
$y^2 = x^3 + 4$, call this curve $E(F_q)$
- the other one is defined over an extension of $F_q$ to $F_{q^2}$ , equation is<br>
$y^2 = x^3 + 4(1 + i)$, call this curve $E^′(F_{q^2})$.

A pairing is a bilinear map, it takes as input two points, each from a group of the same order r. these two groups call $G_1$ and $G_2$ .

### Twists
BLS12-381 uses a twist, reduces the degree of the extension field by a factor of six. So $G_2$ on the twisted curve can be defined over $F_{q^2}$ instead of $F_{q^{12}}$ , which is a huge saving in complexity, doing arithmetic in $F_{q^{12}}$ is horribly complicated and inefficient.

Find a u such that $u^6 = (1+i)^{−1}$, 
then can define twisting transformation as<br>
&emsp; $(x, y)$ → $(x/u^2, y/u^3)$<br>
This transforms original curve<br>
&emsp; $E:y^2 = x^3 + 4$<br>
into the curve<br>
&emsp; $E^′:y^2 = x^3 + 4/u^6 = x^3 + 4(1 + i)$.

So these are the two groups we will be using:
- $G_1 ⊂ E(F_q)$ where $E:y^2 = x^3 + 4$
- $G_2 ⊂ E(F_{q^2})$ where $E^′:y^2 = x^3 + 4/u^6 = x^3 + 4(1 + i)$

### Final exponentiation
Calculation of a pairing has two parts: the Miller loop and the final exponentiation. Both are quite expensive, but there’s a nice hack can reduce the impact of the final exponentiation.

### Coordinate systems
Finding the inverse of a field element is an expensive operation, so implementations of elliptic curve arithmetic try to avoid it as much as possible. 

#### Affine coordinates
Affine coordinates are the traditional representation of points with just an $(x, y)$ pair of coordinates, where x and y satisfy the curve equation. This is what we normally use when storing and transmitting points.

The basic idea is to represent the coordinate using notional fractions, reducing the number of actual division operations needed. To do this, a third coordinate is introduced and use $(X, Y, Z)$ for the internal representation of a point. 
#### Jacobian coordinates
The Jacobian point $(X, Y, Z)$ represents the Affine point $(X/Z^2, Y/Z^3)$. The curve equation becomes<br>
&emsp; $Y^2 = X^3 + 4Z^6$

Note that, the easiest way to import the Affine point $(x, y)$ is to map it to $(x, y, 1)$.

### Montgomery form
A way to calculate modulo that doesn't require division is the so-called Montgomery multiplication. To calculate the modular multiplication operation,
1. convert the multiplier into Montgomery form,
2. use Montgomery multiplication,
3. convert the result from Montgomery form,<br>

although this process is more complicated, for the operation of calculating a large number of modular multiplications, it is only the initial process of entering and exiting the Montgomery form, but each calculation of Montgomery multiplication in the middle is faster than calculating the ordinary modular multiplication Save a lot of time by multiplying.

## 1. Prerequisites
1. [Visual Studio Code](https://code.visualstudio.com/download)
2. [VSCode Extension sCrypt IDE](https://scrypt-ide.readthedocs.io/en/latest/index.html) search sCrypt in the VS Code extensions marketplace
3. [Node.js ](https://nodejs.org/en/download/) require version >= 12

## 2. How to run locally
1. Run `npm install` to install deps
2. Run testcase from VSCode GUI, select `testcase0.scrypttest.js` file, right mouse button click at file edit window, select menu `Run sCrypt Test`

## 3. Library and API
### 3.1 Library
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
### 3.2 API
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

verifying formula：<br>
&emsp; $e(A, B) = e(α, β) * e(L, ϒ) * e(C, δ)$
### 3.3 Verifying Key and Proof data from snarkjs/Circom 
You can find azkSNARK snarkjs/Circom tutorials by [sCrypt.io](https://learn.scrypt.io/zh/courses/Build-a-zkSNARK-based-Battleship-Game-on-Bitcoin-630b1fe6c26857959e13e160/lessons/3/chapters/1)

#### ![zkSNARK](https://github.com/walker9296/BLS12-381/blob/main/res/zkSNARK.png)
From the `proof.json` file, obtain the ***A***, ***B***, ***C*** parameters, and from the `verification_key.json` file, obtain the ***α***, ***β***, ***ϒ***, ***δ*** parameters, use the ***ic*** item and the public inputs from the `public.json` file to calculate the ***L*** parameter:<br>
$$L = \sum_{i=0}^l w_i*IC_i$$
where public inputs $w = (1, w_1, …, w_i)$
#### 3.3.1 verification_key.json
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
#### 3.3.2 proof.json
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
#### 3.3.3 public.json
```json
[
 "91"
]
```