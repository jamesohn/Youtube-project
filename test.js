const fs = require('fs'),
  path = 'C:/Users/User/Documents/GitHub/Youtube Analysis/youtube_crawler/Youtube-demo-analytics/Youtube-project/locale_Test2/UC_Aly3X5CdojHdRDGmKi1ow'
let cum = 0;
let num = 0;

// let files = fs.readdirSync(path,'utf8');
// for (let file of files) {
  let content = fs.readFile(`${path}`,'utf8',function(err,data) {
    console.log(data);
    // if (err) console.log(err);
    // let jsonData = JSON.stringify(data)
    // let content = JSON.parse(jsonData)
    //
    // let channel = file.split('_locale')[0]
    // let totalCommentCount = parseInt(content.split('\n')[0].split(', ')[0].split(' ')[1])
    // let crawledCount = parseInt(content.split('\n')[0].split(', ')[1].split(' ')[1])
    // let locale = JSON.parse(content.split('\n')[1])
    // let cpm = parseFloat(content.split('\n')[2].split(': ')[1].split(' ')[0])
    // let data2 = {
    //   id: channel,
    //   commentCount: totalCommentCount,
    //   crawledCount: crawledCount,
    //   locale: locale,
    //   cpm: cpm
    // }

    // let new_path = 'C:/Users/User/Documents/GitHub/Youtube Analysis/youtube_crawler/Youtube-demo-analytics/Youtube-project/locale_Test2'
    // fs.writeFileSync(`${new_path}/${channel}`,JSON.stringify(data2),'utf8')
    //
    // console.log(data);
    // console.log(data.locale);

  });
// }
