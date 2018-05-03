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
const countryCpm = {'미국': 3, '한국': 0.7, '일본': 1.5, '인도네시아': 0.2, '태국': 0.2, '필리핀': 0.2, '베트남':0.2, '인도': 1.2, '영국': 3, '프랑스': 1.5}

module.exports = {
  // remove duplicate
  uniq: function uniq(a) {
      var seen = {};
      return a.filter(function(item) {
          return seen.hasOwnProperty(item) ? false : (seen[item] = true);
      });
  },
  // Calculate cpm
  cpm: function cpm(obj) {
    value = 0;
    for(obj_key of Object.keys(obj)){
      for(cpm_key of Object.keys(countryCpm)){
        if (obj_key == cpm_key){
          var value = value + obj[obj_key]*countryCpm[cpm_key]*10
        }
      }
    }
    return value
  },

  flatten: function flatten(arr) {
    return arr.reduce((a,b) => a.concat(b), []);
  }


}
