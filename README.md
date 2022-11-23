# BLS12-381 library for BitcoinSV Smart Contract
[sCrypt](https://github.com/sCrypt-Inc/boilerplate) library of BLS12-381 Zero-Knowledge Proofs support.


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

#### function parameter(3-pairs and 1 preCompute-pair)：
- a0 : ***A***, b0 : ***B***
- millerb1a1 : preCompute miller(***α***, ***β***)
- a2 : ***L***, b2 : ***ϒ***
- a3 : ***C***, b3 : ***δ***

| PointG1 | PointG2 |
| ------- | ------- |
| a0  | b0  |
| a1  | b1  |
| a2  | b2  |
| a3  | b3  |

| PointG1 | PointG2 |
| ------- | ------- |
| ***A***  | ***B***  |
| ***α***  | ***β***  |
| ***L***  | ***ϒ***  |
| ***C***  | ***δ***  |
#### verifying formula： ![formula](https://github.com/walker9296/BLS12-381/blob/main/res/formula.png)

### 3.3 Verifying Key and Proof data from snarkjs/Circom 
zkSNARK snarkjs/Circom tutorial by [sCrypt.io](https://learn.scrypt.io/zh/courses/Build-a-zkSNARK-based-Battleship-Game-on-Bitcoin-630b1fe6c26857959e13e160/lessons/3/chapters/1)

#### ![zkSNARK](https://github.com/walker9296/BLS12-381/blob/main/res/zkSNARK.png)
From the verification_key.json file, directly obtain the α, β, ϒ, and δ parameters, and use the ic item in it and the public inputs in the public.json file to calculate the L parameter:
##### ![formulaL.png](https://github.com/walker9296/BLS12-381/blob/main/res/formulaL.png)
public inputs w=(1,w_1,…,w_i) from public.json
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