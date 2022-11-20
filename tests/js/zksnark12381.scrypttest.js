const { expect } = require('chai');
const { buildContractClass } = require('scryptlib');
const { compileContract } = require('../../helper');

// const { buildContractClass, compileContractAsync } = require('scryptlib');
// const { join } = require('path');

describe('Test sCrypt contract BLS12-381 In Javascript', () => {
  before(async () => {
    // const filePath = join(__dirname, '..', '..','contracts', 'ZKSNARK12381.scrypt')
    // const out = join(__dirname, 'out')
    // const desc = await compileContractAsync(filePath, { out: out });
    // Bls12381Test = buildContractClass(desc);

    const contra = compileContract('zksnark12381.scrypt');
    Bls12381Test = buildContractClass(contra);
 
    st = new Bls12381Test();
  });

  it('testVerify3Point should return true', () => {
    result = st.testVerify3Point().verify();
    expect(result.success, result.error).to.be.true
  }).timeout(3600000);
});