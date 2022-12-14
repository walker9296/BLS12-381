const { expect } = require('chai');

const { buildContractClass, Int, buildTypeClasses } = require('scryptlib');
const { compileContract } = require('../../helper');
// const { buildContractClass, Int, buildTypeClasses, compileContractAsync } = require('scryptlib');
// const { join } = require('path');

describe('Test sCrypt contract BLS12-381 In Javascript', () => {
  let vk, st;
  let proofA, inputsA; //testcaseA
  
  before(async () => {
    // const filePath = join(__dirname, '..', '..','contracts', 'ZKSNARK12381.scrypt')
    // const out = join(__dirname, 'out')
    // const desc = await compileContractAsync(filePath, { out: out });
    // Bls12381Test = buildContractClass(desc);

    const desc = compileContract('zksnark12381.scrypt');
    Bls12381Test = buildContractClass(desc);

    const {Proof, VerifyingKey3Point} = buildTypeClasses(Bls12381Test);

    proofA = new Proof({
      a: [new Int("0x191af7d0c883fe030c906df756e6538d4f0104402c68afed5fb1b9b025c2c0a38d8b0e5dc6fe2c3c8f10e5a6c9cec277"),
          new Int("0x15cd9c312c4cda1a439629576d5139e626215c8c2c955ff5089cf117d7737bae37a6eb833ae6f8351e7c7ac65be77961"),
          new Int(1)],
      b:[[new Int("0x12cc7c42224139677e8312fa2acab21834862fc55a1c704fabb0122e0f7809650cb2a4ab89d167ae578fb1a47a6a7dbf"),
          new Int("0x18e1e8f0f6a48e3043a9e7361f23b9e237af76c4ebaccd62dcada05bd363792793500058034acdcfeec1facb3354a019")],
         [new Int("0x1786dd3b7da42766bb90b4be72e4216c45fdb6ec76a015cee60860c26f40e7d79a96d80a5bbd9d36052c992d696b5ec0"),
          new Int("0x044d35423508f64859766ccdda5559406723344c12be67cb4e4d1274d78621625f35d1bbb3a2b26578832d3557117e58")],
         [new Int(1), new Int(0)]],
      c: [new Int("0x13aed2b52101ea4644cc5aaf3e69f8f0aeb6fe6d5d8a193cd4c386f24976227e80ca4624473b33cfee1a51b64cbf1e5a"),
          new Int("0x19f4437e994afa583729ed9c1892b9203185a595e8accf20e0055884988788a76436c63f3cbba4e7a33c2b96c6b9842c"),
          new Int(1)]
    });

    millerb1a1 = [
     [[new Int("0x020c581cbadc2d2be5a0a3406cef43a63171454a9920df0bb4298bf06970724aa5423fbaef995d2af1ee1a8ef70a2c68"),
       new Int("0x09d91a203b388ce0d797e12a0ce3195d2f8e973ea23620ba4581431ac8690df0dfbf8414b5f31b71acac1fa6419c80a1")],
      [new Int("0x147154278115aee946a84b1031e7550b4b504798616de424f0dc86ead467ef003de4587162c31a713403c6af6bcafab6"),
       new Int("0x139e423e338813e54359da8714f7514aac3481fbfdecb7feda859f9e9d8f8e357088b616c91058e94e78537217726389")],
      [new Int("0x051297ae9bda43b4c02f95e87fd6f905ee6d0f00c6e3bb853c50883d06461eed12bd3a279955e939b606d4dc6ef43119"),
       new Int("0x0e5d43efec7474cc4a8ca53c1a51e6bcae885b90726333f87eec2011191fed0f61becb08d1c833b1f78c01e13729e7d9")]],
     [[new Int("0x053a87a0aa0be06c0e753a9422027d56079c384f749c1e82ffded5c6277c56eccf639e730d44cce49cefd76231fded1f"),
       new Int("0x09ae321bd9eaf0bea4cc15d0bf7dbaa91ad6620e2af21907c0c8b70e7ba275bbe0b2c4fc08bdf9a6597e372211b31fb6")],
      [new Int("0x028f18c105144e9711d346a305af0d05d6e40211d641b1e7a285929ce306a3354a5776cbe5a9740eb543a23894a530c2"),
       new Int("0x040024f11127d4e7d9891d05b6979029187c7752e6eec1504cf95c6800b05d01b06e2ddacc031f659dc5faece30cabb2")],
      [new Int("0x1654f333db8c21105e314c4b8c4e8aed0b1977dabeee859e9eadc0480002e665cd6098bb629b40bc949fbc0448d3da2b"),
       new Int("0x00fa63b7fc081d5e0249bd143497ac15405560f41928640e988d1e9793cf56497bf24f643cb8b85d37e676a6f0a4bd89")]],
    ];

    vk = new VerifyingKey3Point({
        'millerb1a1': millerb1a1,
        'gamma': [[new Int("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"),
                   new Int("0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e")],
                  [new Int("0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801"),
                   new Int("0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be")],
                  [new Int(1), new Int(0)]],
        'delta': [[new Int("0x04bc7d1740524cf2a035fb09e83ec6a84c10b96425518359c2badaf6b4d7b0b90c0964d07639753c339f8a4921964c54"),
                   new Int("0x0b14086412fc04a481a603cb24e2927ee428c8d2aec822323644bafb07e712795cde53bce0fa399f64917926556c36a0")],
                  [new Int("0x1447994273c0b3e466b1e6c2f629a93895c7250662434e63a7d81fc41ceb6b4906799aab9a8239b2a81a7eda0a2b69fd"),
                   new Int("0x003c7b001f8745c755e51ab0520f772f78eaf62ceea30d2cee0e374c9549b68cc0db165e63fa2818b3bd95c8840732c8")],
                  [new Int(1), new Int(0)]],
        'ic':[[new Int("0x14aa1710533f1edeba1e570ae85090e80014871923a1e2b2e8cfb2f6386cb994931d9343804edf6dcceed4779ce4a7b2"),
               new Int("0x10d82a3617faa093037522674c51e8f402c3dd396f0d44d4fd4aaf0ab03523da73d794613ff8ba1312e1ba34cfcba927"),
               new Int(1)],
              [new Int("0x199b3ae3fde2b046ba57f0c1d258fcc453709c73d43323c92800fff978af09d7be2cc0b85a69277ed3550befca991df0"),
               new Int("0x15792bbcb518a4bdccdae4713986c4b8ae95d762db92aa36af2ba1cdd3faecd0e665d1fd36ff34824e8eb23d66cc84b7"),
               new Int(1)]]
    })

    inputsA = [new Int(91)];
        
    st = new Bls12381Test();
  });

  it('testcase A Verify3Point should return true', () => {
    result = st.testVerifyOptimized(inputsA, proofA, vk).verify();
    expect(result.success, result.error).to.be.true
  });

});