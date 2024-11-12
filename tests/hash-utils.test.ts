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

  test("serialize keys as JSON.stringfy", () => {
    assert.stringEquals(
      // prettier-ignore
      '{"encrypteddata":"04qfefm3xb7msdaywlqevnyxi221ieaq1owdnwujxpunfsljralsfb6grqyb3jlx9vh7beqbvzqh1yntfzmhhai2keg5hx87z2afaat2nqqudk94ocqouvnydawdiarv2mb7velskt/zgevjmgk7+qfxywgclzqr6llvxg8iuqo3otje2u6cv79qgy7ihg8cs8pj1o60csytbfy2jpluxj5bnos4lf724rqtckftukbag/unuk1kgy6dl0qau/med9ymuvg04ycyioga8xspvlecbtvuwcae2clrogcze5vbhovs+nzpmydszss7pvnzmhmiadj2b64irgomveipgcmqxxktsgnrr4easxxk0cu09sl2umeml1dad0r+a2decptrvzmyfb1saarjsnmrdcpspl0ulz3cezr93jnoltw4rxbsamegqwygilg37hgrd128ifczo7tfyp9ypopcqlichg0vciu6x+zxt3l9vjcugvq+phb8l00hh6w9ce5k/bfim+zog4jpfdh+5kmzklrz9roziirlbmb1krzinrflq6+jnf9zgbgrq0xfbx0s+w15gmeqehdvutjxrspcloverjvozv5aaixyijiqq28yquzfhkkw0pugaqkt+n15oy1ae3cbihjgojftqld+uyvray2cuqjmde+qxqyhskjmrg0kd+bh+7wnietj54xzfprby1gedu6a7h6oktpig9ad/4ufaytseojjvr7qpgrod3anhztu2zwf7q4ofk5b2fp1gospmbcrib8vsb1l1+y1ihz/f6fgqhsrfuhyvhtdxhqg4c928vwuaswdvgkgrsgacdp3sbqsdurpt5akz7qh7jxfcxsx5ql/b4yzts0sbpgoyqflkxi2sbzy+imwa25hcb5sml2bnmkxfklp/acxlwewbyfbeltmbeoxo0l5jbqhgrqqk+t7k6g+b8nek9r0j38ioccpnj/dx9dnrwlj3l/p0a0q5xporaur7wukyv7ido4jytmb30pcs3twvqfhzdlif8hxouewj3m/dfuldzprxbe+dbbcj/oipup/bbpxwilis0wqdn3psjit55cfadfc0kpy+guup9zeiihyvcautbsqpm4sruyazfcat1mizffrjakbwhn3grgurjkj0vrfeyo3jhqsbvhwzdsxsnpdwsayc2nz8zzzkvbpe6pv6qmdkqaqmu2zfhisq8770=","encryptionmethod":"kms-aes256-gcm","keys":{"0xa6efd3b90030c922ebc5130fde477b27ed7fe6ef":"05{\\\"ciphertext\\\":\\\"ld1tygbuilyx6ll1dpbxfvz4qrf5wajx7uksmgk+ra82ag6gw0fuju4yh/tulrzqxkwmntj+vw5uvbhlutgyabtizth9cfay6up7u/urqvgtowe+jjmztievbcvitoqrbckjv7jljwrul5ftadhezhgjxnz1yce+pngu1ztqag==\\\",\\\"datatoencrypthash\\\":\\\"98032a673081e760a026588dfca7dc5f23f00121a48d8e4d225851e6e63fbdca\\\"}","0xa84e89c163a066ab62787567b6964a10517eaaeb":"05{\\\"ciphertext\\\":\\\"ld1tygbuilyx6ll1dpbxfvz4qrf5wajx7uksmgk+ra82ag6gw0fuju4yh/tulrzqxkwmntj+vw5uvbhlutgyabtizth9cfay6up7u/urqvgtowe+jjmztievbcvitoqrbckjv7jljwrul5ftadhezhgjxnz1yce+pngu1ztqag==\\\",\\\"datatoencrypthash\\\":\\\"98032a673081e760a026588dfca7dc5f23f00121a48d8e4d225851e6e63fbdca\\\"}"}}',

      serializeEncryptedTxData(
        "04QfefM3Xb7mSdaywlQeVnyxi221ieAQ1OWdnwuJxPuNfSLJRAlSfb6GRqyb3JLx9vH7beQbvzQh1yntfZmHHAI2KEG5Hx87Z2AFaaT2NQQuDK94ocQoUVnydAWDIaRv2Mb7veLsKT/ZgeVJMgk7+QFXyWgclzqR6llvxg8Iuqo3oTJe2u6CV79qGY7Ihg8CS8pj1O60csYtbfY2jpLuxJ5bnoS4LF724RQtcKfTUKbaG/UNUK1kGY6DL0qaU/meD9ymuvG04YCyiogA8XspVlecbTVUwCae2ClRoGCzE5VbHOVS+NZPmYdsZsS7pvNzMhMiaDj2B64IrGoMVeIPgcmQxXkTsgNRR4EaSXXK0cu09sl2UMeMl1daD0r+a2DECPTRVZmYfb1SAARJsnmrdcPSpl0uLZ3Cezr93JNoLtW4rxbSaMEGqwyGIlg37HgrD128IFCZo7tFyP9yPopCQLICHG0vCiU6x+zxT3L9vJcuGvq+Phb8L00Hh6w9Ce5K/bFIM+ZoG4JPFdH+5kmZKLrZ9RoZIirLBMb1kRzInRflq6+jNF9ZgbGrQ0XFBx0s+w15GmeQeHdVuTJXRSpClOvERjvoZv5aaIxyiJiQQ28YQuzFHKkW0PugAQkT+n15Oy1Ae3CbiHjGojftQLD+uyVrAY2cuqJMde+qxqyhSKJmrG0Kd+bh+7WNIEtJ54xZFPRBY1Gedu6A7h6oKtPIg9ad/4UfAYtSEOJJvR7qpGRod3anhZtU2ZwF7q4ofk5B2fp1GOSpmbcrIb8VsB1L1+y1iHZ/F6FGqhsRFUHyvHtDxHqG4C928vwUaswdVGkgRsgAcDp3sBQsDUrPt5AKz7Qh7JXFCxsX5QL/b4yZTs0sBPgOyQflKxi2sBZy+IMWa25HCB5sML2BNMKxfkLp/AcXlWEWBYFBEltmBEoxO0L5jBqHgRqQk+T7K6g+B8Nek9r0j38IoccPNJ/dx9dnRwLJ3L/p0a0q5XPorAUr7wukyV7Ido4JYTmb30pCS3twVqfhZDLif8HXOUewJ3m/dfUlDzpRXBe+dbBCJ/OipuP/BbpXWilIS0wqdn3psJiT55CFadfC0kPy+GuUp9zeiIHYVcauTbSqPm4sruyAZFCat1miZFFRjaKBwhn3GRGUrjkj0vrFeyO3jHQsBvHwZdsXsnPDwSAyc2Nz8zzzKVBPE6Pv6qMDKQAqMu2zFHIsq8770=",
        "kms-aes256-gcm",
        [
          "0xA6eFD3b90030C922EbC5130fde477b27ed7Fe6Ef",
          "0xa84E89c163a066Ab62787567B6964a10517EAaEB",
        ],
        [
          '05{"ciphertext":"lD1tyGbUIlYx6ll1DpBxFvz4QRF5WaJx7uksMgK+rA82AG6Gw0FujU4yH/tulrZQxkwMnTJ+vw5UVBhLUTgYABTIZth9cFAy6uP7u/URqVgtowe+JJmZTIeVBcVItOQrBCKjV7jlJWRuL5FtAdHEZhGJxnz1Yce+pngu1ztQAg==","dataToEncryptHash":"98032a673081e760a026588dfca7dc5f23f00121a48d8e4d225851e6e63fbdca"}',
          '05{"ciphertext":"lD1tyGbUIlYx6ll1DpBxFvz4QRF5WaJx7uksMgK+rA82AG6Gw0FujU4yH/tulrZQxkwMnTJ+vw5UVBhLUTgYABTIZth9cFAy6uP7u/URqVgtowe+JJmZTIeVBcVItOQrBCKjV7jlJWRuL5FtAdHEZhGJxnz1Yce+pngu1ztQAg==","dataToEncryptHash":"98032a673081e760a026588dfca7dc5f23f00121a48d8e4d225851e6e63fbdca"}',
        ],
      ),
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

  test("encrypted transaction with keys JSON objects", () => {
    assert.stringEquals(
      "0x78020fbb0610e4a7dfd7215d742121670d942378a7a227d56c69844625b365a3",
      computeHash(
        // prettier-ignore
        '{"encrypteddata":"04csx1vl5zmaodsltdmf8m7fvfeopam2kzdwecoqc9vgx5fyf5czklrc0agy7tkb6k+o+hik4j39yhagvmqha1wvbpqbxhkoapacsjq9cx5v+jtleefdq+s/vhbxf5et/ej9fciyjdr8qqkb45m1becu9bnlvgv1mgeezbqkcxxluwhvwsj/r1qhpwagt28efk6m4rtbsozlazra7ugtlrjobgnr8urkwwp46atbiunkaacfnraqafwqc5vja3sqk6zhxtskxxfr7is+ljbs1qxoc0hlbehdl59kroja7rnkzmed9bgemzhyftyyyj8flkp8cz6druuznrcy0sqhawpm038kgpzv/3wyfcg4sv91ybqgtvvh4thzflaib4hxhacy9h/scsdkd/+dw5zf83lpnmgshob3+m0i8a/nurgudvmxmhejfs7utal9ffutykfszyya4ylruuhwvvejfdrmvknrucfzsynisdjh2x7nzxoznkkjae0v5rn85stau5s5/9my/zbglmnjkljfk2w0d56wfcfkcdguqamzidzeqjmekp7vgu/x4xpxuonvsl88kp4aqvdz6ent6lgdvv/iwkevkvu9j+rjrda/najzbazn+yc2xtveyjyqwhjvyeiyjwbwmocqehjiw3fva0e0/vfw+l/+bfybwhdeks2jdjym9bnr/xot9dlvzzls6+m8ck+n304utp/x35uy7uhwad/pbwxjdoczcmxxz0rc6o0o69egl2cuczk5qfueg7knkofbqo7tycwdp2lhtbz/syf9cz61y809+ahenuui2eju7hielyqvll9redmzq2pr9ye2pwbimflrb7mchqa6flxdld4fzs50ip2+u61wzm50gupmhg4urcrlfxgyvst74fg+l/opsv2nxwjx4vn4pcrrfy6d1g+gfg+u6ewabqlbtyor31yzzcujusza7a8+ppqtnjcdws3ai9xdh1gyha+kyupe9rw0qdekwg5nyqsv/bgy/fzjnwmp7iomqryxcjdefb6bgwx8a25fa0i+1i0jdgpoxymvr1fbswkpk7z1857o2ekqdvvuxael+vqwlewpb87jzmj6uekmjitx3rskxs9fcbcrmn7ckybahxzqhsynfisxigh2ealkor7adwkcjhknfnknwvwskvn2f1l3h1t5vh9qy2p5dw5flkk8mre/8yzm4lndr4mivsd0y=","encryptionmethod":"kms-aes256-gcm","keys":{"0xa6efd3b90030c922ebc5130fde477b27ed7fe6ef":"05{\\\"ciphertext\\\":\\\"t8wwo11hy/4uv8vdhjy8klaxdktvtli478fsplihtzvdj2p3ecgdolqeycq9pgau2a7fmiljnfj6djqrsnexgx9ughthrhnvywcmurl4hpgtbvlobpnr3cgpjhrdg2ohmhtgg0tvrqnikckuqrdyismjmvyjopjqpxxulcivag==\\\",\\\"datatoencrypthash\\\":\\\"7a95a2ac8d437c51311d6743b461daffb3ebef17989e6e7ca5da4d89fee57224\\\"}","0xa84e89c163a066ab62787567b6964a10517eaaeb":"05{\\\"ciphertext\\\":\\\"t8wwo11hy/4uv8vdhjy8klaxdktvtli478fsplihtzvdj2p3ecgdolqeycq9pgau2a7fmiljnfj6djqrsnexgx9ughthrhnvywcmurl4hpgtbvlobpnr3cgpjhrdg2ohmhtgg0tvrqnikckuqrdyismjmvyjopjqpxxulcivag==\\\",\\\"datatoencrypthash\\\":\\\"7a95a2ac8d437c51311d6743b461daffb3ebef17989e6e7ca5da4d89fee57224\\\"}"}}',
      ),
    );
  });
});
