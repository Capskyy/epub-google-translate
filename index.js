const translate = require('@iamtraction/google-translate');
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let trans="";
let chapterlist=[];

fs.readdirSync('./text/').forEach(file => {
  if(/(chapter|section|bonus|extra|prologue|epilogue|appendix|side)/g.test(file)){
    chapterlist.push(file);
  }
});

  chapterlist.forEach((aktualnyplik) => {
    let i=1;
    let tabtrans = [];
    console.log(aktualnyplik);
    const plik = fs.readFileSync('./text/'+aktualnyplik, { encoding: 'utf8', flag: 'r' });
    let dom = new JSDOM(plik);
    dom = dom.window.document.querySelectorAll('p');
    dom.forEach((element) => {
      if(trans.length>=4900 || i==dom.length){
        tabtrans.push(trans);
        trans = '';
      };

      trans = trans+'\n'+element.innerHTML;
      i++
    });
    aktualnyplik = aktualnyplik.replace('xhtml','html');
    tabtrans.forEach((translacja) =>{
      translate(translacja, { from: 'en', to: 'pl' }).then(res => {
        fs.appendFile('./trans/'+aktualnyplik, res.text, err => {
              if (err) {
              console.error(err);
              }
          });
        }).catch(err => {
          console.error(err);
        });
      });
      trans = '';
      tabtrans = [];

    });
