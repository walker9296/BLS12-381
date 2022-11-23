const { expect } = require('chai');
const { buildContractClass, Bytes } = require('scryptlib');
const { compileContract } = require('../../helper');

describe('Test sCrypt contract BLS12-381 In Javascript', () => {
  before(async () => {
    const contra = compileContract('testcase0.scrypt');
    Bls12381Test = buildContractClass(contra);
    st = new Bls12381Test();
  });

  it('testMod should return true', () => {
    result = st.testMod().verify();
    expect(result.success, result.error).to.be.true
  });

  it('testToMont_FromMont should return true', () => {
    result = st.testToMont_FromMont().verify();
    expect(result.success, result.error).to.be.true
  });

//   it('testModInverseEGCD should return true', () => {
//     result = st.testModInverseEGCD().verify();
//     expect(result.success, result.error).to.be.true
//   });

  it('testMulScalarG1 should return true', () => {
    result = st.testMulScalarG1().verify();
    expect(result.success, result.error).to.be.true
  });

});