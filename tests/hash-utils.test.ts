import { assert, describe, test } from "matchstick-as";
import {
  serializeClearTxData,
  computeHash,
  serializeEncryptedTxData,
  objectToJsonString,
} from "../src/hash-utils";

describe("objectToJsonString", () => {
  test("keeps sorted array", () => {
    assert.stringEquals(
      '{"a":"3","b":"2","c":"1"}',
      objectToJsonString(["a", "b", "c"], ["3", "2", "1"]),
    );
  });
  test("sorts reversed array", () => {
    assert.stringEquals(
      '{"a":"3","b":"2","c":"1"}',
      objectToJsonString(["c", "b", "a"], ["1", "2", "3"]),
    );
  });
  test("sorts array 1", () => {
    assert.stringEquals(
      '{"a":"3","b":"2","c":"1"}',
      objectToJsonString(["a", "c", "b"], ["3", "1", "2"]),
    );
  });
  test("sorts array 2", () => {
    assert.stringEquals(
      '{"a":"3","b":"2","c":"1"}',
      objectToJsonString(["b", "c", "a"], ["2", "1", "3"]),
    );
  });
});

describe("clearTxDataToString", () => {
  test("serialize clear data", () => {
    assert.stringEquals(
      '{"data":"{\\"data\\":{\\"name\\":\\"create\\",\\"parameters\\":{\\"currency\\":{\\"type\\":\\"iso4217\\",\\"value\\":\\"usd\\"},\\"expectedamount\\":\\"1000\\",\\"payee\\":{\\"type\\":\\"ethereumaddress\\",\\"value\\":\\"0x627306090abab3a6e1400e9345bc60c78a8bef57\\"},\\"payer\\":{\\"type\\":\\"ethereumaddress\\",\\"value\\":\\"0xf17f52151ebef6c7334fad080c5704d77216b732\\"},\\"extensionsdata\\":[],\\"timestamp\\":1701173554},\\"version\\":\\"2.0.3\\"},\\"signature\\":{\\"method\\":\\"ecdsa\\",\\"value\\":\\"0x0406ef3942dd1a3ffcc8cd5134d35f46417942b77d068e37b719dd419b063bc4278501e1141172d29e6a2e910e15b00b521d7615d33e022b437accf10fb599091b\\"}}"}',
      serializeClearTxData(
        '{"data":{"name":"create","parameters":{"currency":{"type":"ISO4217","value":"USD"},"expectedAmount":"1000","payee":{"type":"ethereumAddress","value":"0x627306090abab3a6e1400e9345bc60c78a8bef57"},"payer":{"type":"ethereumAddress","value":"0xf17f52151ebef6c7334fad080c5704d77216b732"},"extensionsData":[],"timestamp":1701173554},"version":"2.0.3"},"signature":{"method":"ecdsa","value":"0x0406ef3942dd1a3ffcc8cd5134d35f46417942b77d068e37b719dd419b063bc4278501e1141172d29e6a2e910e15b00b521d7615d33e022b437accf10fb599091b"}}',
      ),
    );
  });
});

describe("encryptedTxDataToString", () => {
  test("serialize the first tx of a channel", () => {
    // {
    //   encryptedData: '04ijCiPLRZW+EAE9NENV8WOCjVhOMn4wtIkS+IDLlZaLNqm7NED0sV9LZuQbmubJLJduRCZ9wYvOjPwu4kFaqD7rOFKqN2tFi++iEgPLADGnIoeNXBFo5eS0ekTFqVuV0M3iHFlxmfvWLYOnDwbyheFcrk/nqF1M0quqQdtt1S839wZL9n6Torz6zHhDto52whIX9Y3PNt4uKO+bGHaixKTn8DylHDUuwrCDjSQHDWmZndNwe+EEk+6NefAfD19NJX74pMEcrZw7d2bQKl0eGyFYkG1g6ISZiZxDCodUSjV5kCJJwm3ha7eTr9J/g97EePJSc+e5dXt8aVCtm17BpHBGOTPqHKiLGL79LS3wZyk6JXUD92j13aaGSR9j/xUjErxp1v3o3SR098CmTSfRO4khLykcV51FY8wsz3GhBHoCvN00aNl95YN+KpmuwyRVYbtLnYqPMk2hVRAgxq1zaZK3mLb/tjAGl5i3A1lcY504JRUAvb2Ye/Rg6XW/GAwN7gVw1+0Q3afdBrKJbaiKnnUD7cPFIb+3Na/D+0s3dd003TzY/ESJOn+J44ItsOL8deKnlKaNVmnEbJN/dvovYFQ+zFU6paO5oqsM3Ea/6hPUBQwyzr/YGnWPSC+y3awQBtbAq8XsUHWOWm94KVhDR64OjWaYjvoXCmtFWDzvG1ACMvKv3f2CcNTz4JcDFCB3cjmJOXbp99ywHyAM6EtkMfNS4w01ZfA+X9UgjY',
    //   keys: {
    //     '20af083f77f1ffd54218d91491afd06c9296eac3ce': '02d23775d7cabbc6a3895e1f4be4d522f00237c9c4f8b3623f57e76e6608ab6f0d0f683b878d7e755fcb95fdd56b9f69c0ca8edc6f8a6350dbae9f4698046470b6784a208e4c6039f93dda00f33b4eec6bdbfa1ffb4bd6b4dff145149564336bd6768dfb22986cfb883959c529205b4192def31c40324fc06aad462c3585f4409cd6'
    //   },
    //   encryptionMethod: 'ecies-aes256-gcm'
    // }
    assert.stringEquals(
      '{"encrypteddata":"04ijciplrzw+eae9nenv8wocjvhomn4wtiks+idllzalnqm7ned0sv9lzuqbmubjljdurcz9wyvojpwu4kfaqd7rofkqn2tfi++iegpladgnioenxbfo5es0ektfqvuv0m3ihflxmfvwlyondwbyhefcrk/nqf1m0quqqdtt1s839wzl9n6torz6zhhdto52whix9y3pnt4uko+bghaixktn8dylhduuwrcdjsqhdwmzndnwe+eek+6nefafd19njx74pmecrzw7d2bqkl0egyfykg1g6iszizxdcodusjv5kcjjwm3ha7etr9j/g97eepjsc+e5dxt8avctm17bphbgotpqhkilgl79ls3wzyk6jxud92j13aagsr9j/xujerxp1v3o3sr098cmtsfro4khlykcv51fy8wsz3ghbhocvn00anl95yn+kpmuwyrvybtlnyqpmk2hvragxq1zazk3mlb/tjagl5i3a1lcy504jruavb2ye/rg6xw/gawn7gvw1+0q3afdbrkjbaiknnud7cpfib+3na/d+0s3dd003tzy/esjon+j44itsol8deknlkanvmnebjn/dvovyfq+zfu6pao5oqsm3ea/6hpubqwyzr/ygnwpsc+y3awqbtbaq8xsuhwowm94kvhdr64ojwayjvoxcmtfwdzvg1acmvkv3f2ccntz4jcdfcb3cjmjoxbp99ywhyam6etkmfns4w01zfa+x9ugjy","encryptionmethod":"ecies-aes256-gcm","keys":{"20af083f77f1ffd54218d91491afd06c9296eac3ce":"02d23775d7cabbc6a3895e1f4be4d522f00237c9c4f8b3623f57e76e6608ab6f0d0f683b878d7e755fcb95fdd56b9f69c0ca8edc6f8a6350dbae9f4698046470b6784a208e4c6039f93dda00f33b4eec6bdbfa1ffb4bd6b4dff145149564336bd6768dfb22986cfb883959c529205b4192def31c40324fc06aad462c3585f4409cd6"}}',
      serializeEncryptedTxData(
        "04ijCiPLRZW+EAE9NENV8WOCjVhOMn4wtIkS+IDLlZaLNqm7NED0sV9LZuQbmubJLJduRCZ9wYvOjPwu4kFaqD7rOFKqN2tFi++iEgPLADGnIoeNXBFo5eS0ekTFqVuV0M3iHFlxmfvWLYOnDwbyheFcrk/nqF1M0quqQdtt1S839wZL9n6Torz6zHhDto52whIX9Y3PNt4uKO+bGHaixKTn8DylHDUuwrCDjSQHDWmZndNwe+EEk+6NefAfD19NJX74pMEcrZw7d2bQKl0eGyFYkG1g6ISZiZxDCodUSjV5kCJJwm3ha7eTr9J/g97EePJSc+e5dXt8aVCtm17BpHBGOTPqHKiLGL79LS3wZyk6JXUD92j13aaGSR9j/xUjErxp1v3o3SR098CmTSfRO4khLykcV51FY8wsz3GhBHoCvN00aNl95YN+KpmuwyRVYbtLnYqPMk2hVRAgxq1zaZK3mLb/tjAGl5i3A1lcY504JRUAvb2Ye/Rg6XW/GAwN7gVw1+0Q3afdBrKJbaiKnnUD7cPFIb+3Na/D+0s3dd003TzY/ESJOn+J44ItsOL8deKnlKaNVmnEbJN/dvovYFQ+zFU6paO5oqsM3Ea/6hPUBQwyzr/YGnWPSC+y3awQBtbAq8XsUHWOWm94KVhDR64OjWaYjvoXCmtFWDzvG1ACMvKv3f2CcNTz4JcDFCB3cjmJOXbp99ywHyAM6EtkMfNS4w01ZfA+X9UgjY",
        "ecies-aes256-gcm",
        ["20af083f77f1ffd54218d91491afd06c9296eac3ce"],
        [
          "02d23775d7cabbc6a3895e1f4be4d522f00237c9c4f8b3623f57e76e6608ab6f0d0f683b878d7e755fcb95fdd56b9f69c0ca8edc6f8a6350dbae9f4698046470b6784a208e4c6039f93dda00f33b4eec6bdbfa1ffb4bd6b4dff145149564336bd6768dfb22986cfb883959c529205b4192def31c40324fc06aad462c3585f4409cd6",
        ],
      ),
    );
  });

  test("serialize a subsequent tx in a channel", () => {
    // {
    //   encryptedData: '046n4mpAtKtnmPVNRsui3XWFhifV0Rp4Bw+o0ydt7JVVIj81s9eDuSqZD4ALFvoHFHikKXKO0QZKieoLA3izvIGRvQbWboFwkpYDtlIw6FOQEbBl53l5R5WsdNpDsA1lzX2ipYbXnjva+YEXbddDMObAMdP7+8Xv4lsfukEHsUx556qxXEzAxCrl0DiWxpNFFc/SFkatyWvqdZ9H6blqkozaMYe+xMsiKf5h2PLD5WC23f8R+xJk5e11oEw1921gwO7vDix631Lsbf8KOAvdm04qCbk/I/EG/nLSKTdAUoUv+RcvqU9ybTc8VfHtrW3Fy2IOWbtFT8HGc+XTJIs2+oaygBUQ6DqqKjgXPhXDC1kIejQoWvqCD1TJ5BNRsUU5pV5EtxhYppe6JfDJ984iDYOwiAax+l05HkTxx8vHe84x3aOT875E32M1RtLB/8G6WniHA5abQ1LCyqN0ok/kiZoz6wxdaqmltCFRyIpyc9w89+CiFcgO5dLKp7zfngDfdnXlcdz1+z3Hh04+o6JMm7'
    // }
    assert.stringEquals(
      '{"encrypteddata":"046n4mpatktnmpvnrsui3xwfhifv0rp4bw+o0ydt7jvvij81s9edusqzd4alfvohfhikkxko0qzkieola3izvigrvqbwbofwkpydtliw6foqebbl53l5r5wsdnpdsa1lzx2ipybxnjva+yexbdddmobamdp7+8xv4lsfukehsux556qxxezaxcrl0diwxpnffc/sfkatywvqdz9h6blqkozamye+xmsikf5h2pld5wc23f8r+xjk5e11oew1921gwo7vdix631lsbf8koavdm04qcbk/i/eg/nlsktdauouv+rcvqu9ybtc8vfhtrw3fy2iowbtft8hgc+xtjis2+oaygbuq6dqqkjgxphxdc1kiejqowvqcd1tj5bnrsuu5pv5etxhyppe6jfdj984idyowiaax+l05hktxx8vhe84x3aot875e32m1rtlb/8g6wniha5abq1lcyqn0ok/kizoz6wxdaqmltcfryipyc9w89+cifcgo5dlkp7zfngdfdnxlcdz1+z3hh04+o6jmm7"}',
      serializeEncryptedTxData(
        "046n4mpAtKtnmPVNRsui3XWFhifV0Rp4Bw+o0ydt7JVVIj81s9eDuSqZD4ALFvoHFHikKXKO0QZKieoLA3izvIGRvQbWboFwkpYDtlIw6FOQEbBl53l5R5WsdNpDsA1lzX2ipYbXnjva+YEXbddDMObAMdP7+8Xv4lsfukEHsUx556qxXEzAxCrl0DiWxpNFFc/SFkatyWvqdZ9H6blqkozaMYe+xMsiKf5h2PLD5WC23f8R+xJk5e11oEw1921gwO7vDix631Lsbf8KOAvdm04qCbk/I/EG/nLSKTdAUoUv+RcvqU9ybTc8VfHtrW3Fy2IOWbtFT8HGc+XTJIs2+oaygBUQ6DqqKjgXPhXDC1kIejQoWvqCD1TJ5BNRsUU5pV5EtxhYppe6JfDJ984iDYOwiAax+l05HkTxx8vHe84x3aOT875E32M1RtLB/8G6WniHA5abQ1LCyqN0ok/kiZoz6wxdaqmltCFRyIpyc9w89+CiFcgO5dLKp7zfngDfdnXlcdz1+z3Hh04+o6JMm7",
        null,
        null,
        null,
      ),
    );
  });

  test("serialize multiple keys in non-alphabetical order", () => {
    assert.stringEquals(
      '{"encrypteddata":"abcd","encryptionmethod":"xx","keys":{"aa":"zz","bb":"xx"}}',
      serializeEncryptedTxData("abcd", "xx", ["bb", "aa"], ["xx", "zz"]),
    );
  });
});

describe("computeHash", () => {
  test("clear transaction", () => {
    assert.stringEquals(
      "0x09c043a7cb846a048c2e665b832add72046fd9913e05f0c20e7f4f360ce62a8d",
      computeHash(
        '{"data":"{\\"data\\":{\\"name\\":\\"create\\",\\"parameters\\":{\\"currency\\":{\\"type\\":\\"iso4217\\",\\"value\\":\\"usd\\"},\\"expectedamount\\":\\"1000\\",\\"payee\\":{\\"type\\":\\"ethereumaddress\\",\\"value\\":\\"0x627306090abab3a6e1400e9345bc60c78a8bef57\\"},\\"payer\\":{\\"type\\":\\"ethereumaddress\\",\\"value\\":\\"0xf17f52151ebef6c7334fad080c5704d77216b732\\"},\\"extensionsdata\\":[],\\"timestamp\\":1701173554},\\"version\\":\\"2.0.3\\"},\\"signature\\":{\\"method\\":\\"ecdsa\\",\\"value\\":\\"0x0406ef3942dd1a3ffcc8cd5134d35f46417942b77d068e37b719dd419b063bc4278501e1141172d29e6a2e910e15b00b521d7615d33e022b437accf10fb599091b\\"}}"}',
      ),
    );
  });

  test("encrypted transaction", () => {
    assert.stringEquals(
      "0x3e4bc69070baf9ed30ef58b87b454fd19841f18dd83f7dbe8b311bb32befc483",
      computeHash(
        '{"encrypteddata":"04ijciplrzw+eae9nenv8wocjvhomn4wtiks+idllzalnqm7ned0sv9lzuqbmubjljdurcz9wyvojpwu4kfaqd7rofkqn2tfi++iegpladgnioenxbfo5es0ektfqvuv0m3ihflxmfvwlyondwbyhefcrk/nqf1m0quqqdtt1s839wzl9n6torz6zhhdto52whix9y3pnt4uko+bghaixktn8dylhduuwrcdjsqhdwmzndnwe+eek+6nefafd19njx74pmecrzw7d2bqkl0egyfykg1g6iszizxdcodusjv5kcjjwm3ha7etr9j/g97eepjsc+e5dxt8avctm17bphbgotpqhkilgl79ls3wzyk6jxud92j13aagsr9j/xujerxp1v3o3sr098cmtsfro4khlykcv51fy8wsz3ghbhocvn00anl95yn+kpmuwyrvybtlnyqpmk2hvragxq1zazk3mlb/tjagl5i3a1lcy504jruavb2ye/rg6xw/gawn7gvw1+0q3afdbrkjbaiknnud7cpfib+3na/d+0s3dd003tzy/esjon+j44itsol8deknlkanvmnebjn/dvovyfq+zfu6pao5oqsm3ea/6hpubqwyzr/ygnwpsc+y3awqbtbaq8xsuhwowm94kvhdr64ojwayjvoxcmtfwdzvg1acmvkv3f2ccntz4jcdfcb3cjmjoxbp99ywhyam6etkmfns4w01zfa+x9ugjy","encryptionmethod":"ecies-aes256-gcm","keys":{"20af083f77f1ffd54218d91491afd06c9296eac3ce":"02d23775d7cabbc6a3895e1f4be4d522f00237c9c4f8b3623f57e76e6608ab6f0d0f683b878d7e755fcb95fdd56b9f69c0ca8edc6f8a6350dbae9f4698046470b6784a208e4c6039f93dda00f33b4eec6bdbfa1ffb4bd6b4dff145149564336bd6768dfb22986cfb883959c529205b4192def31c40324fc06aad462c3585f4409cd6"}}',
      ),
    );
  });
});
