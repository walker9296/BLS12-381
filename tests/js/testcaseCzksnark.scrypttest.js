const { expect } = require('chai');

const { buildContractClass, Int, buildTypeClasses } = require('scryptlib');
const { compileContract } = require('../../helper');

describe('Test sCrypt contract BLS12-381 In Javascript', () => {
  let vk, st;
  let proofC, inputsC; //testcaseC

  before(async () => {
    const desc = compileContract('zksnark12381.scrypt');
    Bls12381Test = buildContractClass(desc);

    const {Proof, VerifyingKey3Point} = buildTypeClasses(Bls12381Test);

    proofC = new Proof({
      a: [new Int("2075626938315935991723945304267293035922733530603424992662140707751157809535751306580194671145028222665057550999294"),
          new Int("349801231889877714168434391520869664165899739671037400615525367270362278897001489973722771572997955598694464826391"),
          new Int(1)],
      b:[[new Int("804705963382948390049190702595951506273165232960850925305059594110325887726433361153230328730917374321775730519551"),
          new Int("2131814829092741313787472713566757110251591015505832377029949428596206754532487192989041834673717698272353228376254")],
         [new Int("2514433939098370582198522491336640343267109199433037592587556210201287810292076302280028801549962698379150996826239"),
          new Int("1878603911745254906578293596026776055424702010801548121986960161715958365448257882823404444429393141329288030180034")],
         [new Int(1), new Int(0)]],
      c: [new Int("2982073455340243844492713124439798269378951970406958046697300287252159292488377090651785663612739730173210415163600"),
          new Int("2721711788688008614620995843079331824456717610246977640633535595439745273317247676475893752906127802445202203120888"),
          new Int(1)]
    });

    millerb1a1 = [
     [[new Int("0x0c59c2364b4dd46230857e71738f4bc38f984f87cdd8de9b4d8a38aebf939aa8f7c09b046c800694f4b1be84a25ada2c"),
       new Int("0x0d79fcde49bde6cffc46a38255dcb205b0f0336579393a93cdefddb1d778e6dc310be5e0019df7fa5ca9e8ee7d3eb191")],
      [new Int("0x18f755733667140065f55bf3458e93dabc8809cb94a70d18f4bad0e39f328bd0fc7ae380f411efc4cd3871c3bfbd8418"),
       new Int("0x050777d588165bd4e7b6f0b8bab2fcb7a6b6f1f2532b312a6affceb34f12eab2c0b0aa71b4f0be0273dc36b6875c3889")],
      [new Int("0x0845cdf2351b0602a5adf1a9381722d7e17646fa068d034f21ab0cddfe7d8b342fdc86a4ce09b3fc0dd74e8b7140d1e8"),
       new Int("0x17660d1ec5ad8667e15a8b009f92e4e52274e4de9e5e58a294f2b74913c8247953a4b15569fcb29fd7d0be0605eb4920")]],
     [[new Int("0x0c9388771bc784c1c0f4037c6cfc2c8fc98f205919077b8626b3cbbc93bd32dff748249c0922eb4d9ca4c726956efa87"),
       new Int("0x107d2588c4013f59d4c4982f17ebf339c7c60cc4f505bee58f9cfcf678eff384f3d17ba07a364e0a1fc7ac44fd1adb64")],
      [new Int("0x0304b4ecf29d9161c8cd082d89de079db14081dc887904a597ea0d0ee6d53bc2fb21a6ebde0af70b716e9aace45c7897"),
       new Int("0x074f13f218e72a02721f319b2963fffc800fd788a3f0f78441f698c77e32ac26bc79fca061a4752ee38f95d69dbab7bc")],
      [new Int("0x0358a87a839d8a39fbba10f2e3caee0c5545a031b570f4e7189602575ecc3a3a1c9b295efae239f3858fb2c8d2e53b76"),
       new Int("0x079fcb16a9fe59ec5e4409fe730ae13e37d6a1de63df93cd812f94d190eccc16cc8eb13a52573c7811e1383b70fcf11e")]],
    ];

    vk = new VerifyingKey3Point({
        'millerb1a1': millerb1a1,
        'gamma': [[new Int("352701069587466618187139116011060144890029952792775240219908644239793785735715026873347600343865175952761926303160"),
                   new Int("3059144344244213709971259814753781636986470325476647558659373206291635324768958432433509563104347017837885763365758")],
                  [new Int("1985150602287291935568054521177171638300868978215655730859378665066344726373823718423869104263333984641494340347905"),
                   new Int("927553665492332455747201965776037880757740193453592970025027978793976877002675564980949289727957565575433344219582")],
                  [new Int(1), new Int(0)]],
        'delta': [[new Int("1895592553603549617510043535305846420252337506323665453460381914827385162151672460630166698068249753317198049076367"),
                   new Int("3380570345634319244244679237401875667804054801569183706410524561353553639968027906354166435771814676319131616959613")],
                  [new Int("17933818585896026470874437266825035307854324208754439657197071525205410162065023986589680186601539779142205089915"),
                   new Int("3196997767567504082510784753146232734562918456369289130991119990131243586010456886340221366283869619631758727987807")],
                  [new Int(1), new Int(0)]],
        'ic':[[new Int("1798583560006009317116461270717315219794521310484697707152322138859190724031537049410592423779045298931384155087723"),
               new Int("1094498498367856172374356338985900865277853839502354658766448177287307009005412037322931420831718258599752843260085"),
               new Int(1)],
              [new Int("3416699534093646405067071542640936900858855221814212428712154897944091825154197939227793224991236438116740840483984"),
               new Int("2695679405124676127098338280805970706049038199894647025229687736067233382073630661406474399061642670229704936182805"),
               new Int(1)]]
    })

    inputsC = [new Int(8)];
        
    st = new Bls12381Test();
  });

  it('testcase C Verify3Point should return true', () => {
    result = st.testVerifyOptimized(inputsC, proofC, vk).verify();
    expect(result.success, result.error).to.be.true
  });

});