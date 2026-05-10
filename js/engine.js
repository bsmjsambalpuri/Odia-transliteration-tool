// ===== Maps =====
const VOWELS={aa:"ଆ",a:"ଅ",i:"ଇ",E:"ଈ",u:"ଉ",O:"ଊ",e:"ଏ",o:"ଓ",Y:"ଐ",U:"ଔ"};
const MATRA={a:"",aa:"ା",i:"ି",ee:"ୀ",u:"ୁ",oo:"ୂ",e:"େ",o:"ୋ",ai:"ୈ",ou:"ୌ"};
const CONSONANTS={
kh:"ଖ",k:"କ",gh:"ଘ",g:"ଗ",chh:"ଛ",
ch:"ଚ",c:"କ",jh:"ଝ",j:"ଜ",th:"ଥ",
t:"ତ",dh:"ଧ",d:"ଦ",
n:"ନ",ph:"ଫ",p:"ପ",bh:"ଭ",b:"ବ",f:"ଫ",v:"ଭ",
m:"ମ",y:"ୟ",r:"ର",l:"ଲ",s:"ସ",h:"ହ",x:"କ୍ସ",w:"ୱ"
};
const CLUSTERS={ksh:"କ୍ଷ",tr:"ତ୍ର",gy:"ଜ୍ଞ",shr:"ଶ୍ର",nt:"ନ୍ତ",nd:"ନ୍ଦ",mb:"ମ୍ବ",mp:"ମ୍ପ",sw:"ସ୍ଵ",qu:"କ୍ବ"};

// ===== Cache =====
let WORD_CACHE={},SPLIT_CACHE={};

// ===== Normalize (VERY IMPORTANT) =====
function normalize(w){
return w
.replace(/aa/g,"A")
.replace(/ee/g,"E")
.replace(/oo/g,"O")
.replace(/ai/g,"Y")
.replace(/au/g,"U")
.replace(/ou/g,"U");
}

// ===== Main =====
function transliterateWord(word){

if(!word)return"";

let rawWord = word.toLowerCase();

// 1. WORD_CACHE
if(WORD_CACHE[rawWord]){
    return WORD_CACHE[rawWord];
}

// 2. Full DB match (raw)
if(window.DB && window.DB[rawWord]){
    return WORD_CACHE[rawWord] = window.DB[rawWord];
}

// 3. ch → chh DB match
let altWord = rawWord.replace(/ch/g, "chh");

if(window.DB && window.DB[altWord]){
    return WORD_CACHE[rawWord] = window.DB[altWord];
}

// 4. Greedy partial DB split
let rawParts = splitWord(rawWord);

let rawMatched = rawParts.map(p => {

    if(window.DB && window.DB[p]){
        return window.DB[p];
    }

    return null;

});

// if at least one partial match found
if(rawMatched.some(x => x !== null)){

    let combined = rawParts.map(p => {

        if(window.DB && window.DB[p]){
            return window.DB[p];
        }

        return ruleBased(p);

    }).join("");

    return WORD_CACHE[rawWord] = combined;
}

// 5. Normalize
let normWord = normalize(rawWord);

// 6. Full DB match (normalized)
if(window.DB && window.DB[normWord]){
    return WORD_CACHE[rawWord] = window.DB[normWord];
}

// 7. ruleBased()
let res = ruleBased(normWord);

// 8. postProcess() already happens inside ruleBased()

return WORD_CACHE[rawWord] = res;
}
// ===== Split (Greedy Longest Match) =====
function splitWord(word){
if(SPLIT_CACHE[word])return SPLIT_CACHE[word];

let parts=[];
let i=0;
let n=word.length;

while(i<n){
let found=false;
for(let len=n-i;len>0;len--){
let part=word.substring(i,i+len);
if(window.DB&&window.DB[part]){
parts.push(part);
i+=len;
found=true;
break;
}
}
if(!found){
parts.push(word[i]);
i++;
}
}
return SPLIT_CACHE[word]=parts;
}

// ===== Rule Engine (Hybrid) =====
function ruleBased(word){

let i=0,out="";

while(i<word.length){

let three=word.substr(i,3),
    two=word.substr(i,2),
    one=word.substr(i,1);

// clusters
if(CLUSTERS[three]){out+=CLUSTERS[three];i+=3;continue;}
if(CLUSTERS[two]){out+=CLUSTERS[two];i+=2;continue;}

// consonants
let key=CONSONANTS[three]?three:CONSONANTS[two]?two:CONSONANTS[one]?one:null;

if(key){
let cons=CONSONANTS[key];
i+=key.length;

let n2=word.substr(i,2),
    n1=word.substr(i,1);

if(MATRA[n2]!=undefined){out+=cons+MATRA[n2];i+=2;}
else if(MATRA[n1]!=undefined){out+=cons+MATRA[n1];i+=1;}
else out+=cons;

continue;
}

// vowels
if(VOWELS[three]){out+=VOWELS[three];i+=3;continue;}
if(VOWELS[two]){out+=VOWELS[two];i+=2;continue;}
if(VOWELS[one]){out+=VOWELS[one];i+=1;continue;}

out+=one;
i++;
}

return postProcess(out);
}

// ===== Fixes =====
function postProcess(t){
return t
.replace(/୍A/g,"ା")
.replace(/୍ଇ/g,"ି")
.replace(/୍ଈ/g,"ୀ")
.replace(/୍ଉ/g,"ୁ")
.replace(/୍ଊ/g,"ୂ")
.replace(/୍ଏ/g,"େ")
.replace(/୍ଓ/g,"ୋ")
.replace(/୍ଐ/g,"ୈ")
.replace(/୍ଔ/g,"ୌ")
.replace(/୍+/g,"୍")
.replace(/୍$/,"");
}