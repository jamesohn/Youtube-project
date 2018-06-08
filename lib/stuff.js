// Norway: $55.49 (playback-based CPM) / $43.16 (CPM)
// Algeria: $50.00 / $25.00
// Germany: $38.88 (both remained the same)
// Moldova: $30.00
// South Korea: $17.04
// Sweden: $18.28 /
// Finland: $19.15 / $15.16
// United Kingdom: $19.00 / $14.16
// Canada: $14.76 / $13.83
// United States: $15.58 / $13.18
// Peru: $10.00
// Israel: $10.68 / $9.27
// Spain: $12.38 / $8.43
// Netherlands: $10.66 / $7.72
// Australia: $12.49 / $7.03
// Japan: $7.51 / $6.26
// Taiwan: $5.85
// India: $5.83
// Italy: $8.55 / $5.29
// United Arab Emirates: $6.10 / $4.88
// France: $6.06 / $4.47
// Poland: $5.58 / $4.18
// Chile: $5.88 / $3.92
// Belgium: $4.89 / $3.91
// Thailand: $2.97
// Ireland: $3.47 / $2.78
// Estonia: $4.57 / $2.36
// Latvia: $3.22 / $1.89
// Russia: $2.50 / $1.85
// Greece: $2.83 / $1.61
// Brazil: $2.20 / $1.54
// Ukraine: $1.91 / 1.22
// Belarus: $2.02 / $1.17
// Romania: $1.52 / $1.02
// Portugal: $1.31 / $0.88
// Lithuania: $1.57 / $0.87
// Bulgaria: $1.10 / $0.63
// Czechia: $0.86 / $0.56
// Kazakhstan: $0.45
// Mexico: $0.32 / $0.21
// Slovakia: $0.27 / $0.14
// Unknown region: $0.12 / $0.06
// Georgia: $0.01
// Hungary: $0.01
const collector = require('./collector'),
      countryCpm = {'미국': 3, '한국': 0.7, '일본': 1.5, '인도네시아': 0.2, '태국': 0.2, '필리핀': 0.2, '베트남':0.2, '인도': 1.2, '영국': 3, '프랑스': 1.5},
      languageLocale = {'kor': '한국', 'jpn': '일본', 'ind': '인도네시아', 'fil': '필리핀', 'vie': '베트남', 'taw': '태국', 'hin': '인도', 'san': '인도', 'ben': '인도', 'tel': '인도', 'mar': '인도',
      'tam': '인도', 'urd': '인도', 'guj': '인도', 'rus': '러시아', 'ukr': '우크라이나', 'pol': '폴란드', 'ces': '체코', 'fin': '핀란드', 'est': '에스토니아', 'ekk': '에스토니아',
      'deu': '독일', 'por': '포르투갈', 'mon': '몽골', 'tur': '터키', 'kaz': '카자흐스탄'}

module.exports = class Stuff extends collector {

  cpm(obj) {
    let value = 0;
    for(let obj_key of Object.keys(obj)){
      for(let cpm_key of Object.keys(countryCpm)){
        if (obj_key == cpm_key){
          value = value + obj[obj_key]*countryCpm[cpm_key]*10 // 10 converts 100 percentile to 1000, which is needed due to definition of cpm(cost per 1000 impression)
        }
      }
    }
    return value
  }

  ratio(obj) {
    let new_obj = {};
    if(typeof obj === 'object' && obj != null){
      // If all typeof values in obj is 'number', convert the count to ratio.
      if(Object.values(obj).map(value=>{return typeof value}).filter(function(value){return value==='number'}).length == Object.keys(obj).length){
        let total = Object.keys(obj).map(key=>{return obj[key]}).reduce(function(a,b){return a+b},0);
        for(let key of Object.keys(obj)){
          new_obj[key] = obj[key]/total
        }
        return new_obj
      } else {
        for(let key of Object.keys(obj)){
          // If one of values has typeof !number, then do it for deeper data.
          new_obj[key] = this.ratio(obj[key])
        }
      }
    }
    return new_obj
  }

  merge(obj) {
    let targetObj = {};
    for(let key in obj){
      if(obj.hasOwnProperty(key)){
        for(let country in obj[key]){
          if(targetObj.hasOwnProperty(country)){
            obj[key][country] = obj[key][country]+targetObj[country]
          }
        }
        Object.assign(targetObj, obj[key]);
      }
    }
    return targetObj
  }

  sortObj(obj) {
    let sortable = []
    for(let key in obj) {
      sortable.push([key, obj[key]])
      }
    // Sort the array
    sortable.sort(function(a,b){return b[1]-a[1]})
    // Convert array to obj
    let sorted_obj = sortable.reduce(function(acc, cur, i){
      acc[cur[0]] = Math.floor(cur[1]*10000)/100;
      return acc;
    }, {});
    return sorted_obj;
  }

  final(obj) {
    let step1 = this.merge(obj)
    let step2 = this.ratio(step1)
    let step3 = this.sortObj(step2)
    return step3
  }




}
