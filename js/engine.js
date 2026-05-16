// ===== Maps =====

const VOWELS = { aa:"ଆ", a:"ଅ", i:"ଇ", ee:"ଈ", u:"ଉ", oo:"ଊ", e:"ଏ", o:"ଓ", ai:"ଐ", au:"ଔ", ou:"ଔ" };

const MATRA = { a:"", aa:"ା", i:"ି", ee:"ୀ", u:"ୁ", oo:"ୂ", e:"େ", o:"ୋ", ai:"ୈ", au:"ୌ", ou:"ୌ" };

const CONSONANTS = { kh:"ଖ", k:"କ", gh:"ଘ", g:"ଗ", chh:"ଛ", ch:"ଚ", c:"କ", 
											jh:"ଝ", j:"ଜ", th:"ଥ", t:"ତ", dh:"ଧ", d:"ଦ", n:"ନ", 
											ph:"ଫ", p:"ପ", bh:"ଭ", b:"ବ", f:"ଫ", v:"ଭ", m:"ମ",
											y:"ୟ", r:"ର", l:"ଲ", s:"ସ", h:"ହ", x:"କ୍ସ", w:"ୱ", z:"ଜ" };

const CLUSTERS = { ksh:"କ୍ଷ", tr:"ତ୍ର", gy:"ଜ୍ଞ", shr:"ଶ୍ର", nt:"ନ୍ତ", nd:"ନ୍ଦ", mb:"ମ୍ବ", mp:"ମ୍ପ", sw:"ସ୍ଵ", qu:"କ୍ବ" };

// ===== Cache =====

let WORD_CACHE = {};
let SPLIT_CACHE = {};


// ===== Main =====

function transliterateWord(word){

if(!word) return "";

let rawWord = word.toLowerCase();


// ===== 1. WORD CACHE =====

if(WORD_CACHE[rawWord]){
    return WORD_CACHE[rawWord];
}


// ===== 2. FULL DB MATCH =====

if(window.DB && window.DB[rawWord]){
    return WORD_CACHE[rawWord] = window.DB[rawWord];
}


// ===== 3. ch → chh =====

let altWord = rawWord.replace(/ch/g,"chh");

if(window.DB && window.DB[altWord]){
    return WORD_CACHE[rawWord] = window.DB[altWord];
}


// ===== 4. s → sh =====

let altWord2 = rawWord.replace(/s/g,"sh");

if(window.DB && window.DB[altWord2]){
    return WORD_CACHE[rawWord] = window.DB[altWord2];
}

// ===== 4. f → ph =====
let altWord3 = rawWord.replace(/f/g,"ph");
if(window.DB && window.DB[altWord3]){
    return WORD_CACHE[rawWord] = window.DB[altWord3];
}

// ===== 5. GREEDY PARTIAL SPLIT =====

let rawParts = splitWord(rawWord);

let rawMatched = rawParts.map(p => {

    if(window.DB && window.DB[p]){
        return window.DB[p];
    }

    return null;

});


// ===== PARTIAL COMBINE =====

if(rawMatched.some(x => x !== null)){

    let combined = rawParts.map(p => {

        if(window.DB && window.DB[p]){
            return window.DB[p];
        }

        return ruleBased(p);

    }).join("");

    return WORD_CACHE[rawWord] = combined;
}


// ===== 6. RULE ENGINE =====

let res = ruleBased(rawWord);

return WORD_CACHE[rawWord] = res;

}



// ===== Split (Greedy Longest Match) =====

function splitWord(word){

if(SPLIT_CACHE[word]){
    return SPLIT_CACHE[word];
}

let parts = [];

let i = 0;
let n = word.length;

while(i < n){

    let found = false;

    for(let len = n - i; len > 0; len--){

        let part = word.substring(i, i + len);

        if(window.DB && window.DB[part]){

            parts.push(part);

            i += len;

            found = true;

            break;
        }
    }

    if(!found){

        parts.push(word[i]);

        i++;
    }
}

return SPLIT_CACHE[word] = parts;

}



// ===== Rule Engine =====

function ruleBased(word){

let i = 0;

let out = "";

while(i < word.length){

    let four  = word.substr(i,4),
        three = word.substr(i,3),
        two   = word.substr(i,2),
        one   = word.substr(i,1);


    // ===== CLUSTERS =====

    let clusterKey =

        CLUSTERS[four]  ? four  :
        CLUSTERS[three] ? three :
        CLUSTERS[two]   ? two   :
        null;

    if(clusterKey){

        out += CLUSTERS[clusterKey];

        i += clusterKey.length;

        continue;
    }


    // ===== CONSONANTS =====

    let consKey =

        CONSONANTS[four]  ? four  :
        CONSONANTS[three] ? three :
        CONSONANTS[two]   ? two   :
        CONSONANTS[one]   ? one   :
        null;

if(consKey){

    let cons = CONSONANTS[consKey];

    i += consKey.length;

    let v4 = word.substr(i,4),
        v3 = word.substr(i,3),
        v2 = word.substr(i,2),
        v1 = word.substr(i,1);

    if(MATRA[v4] !== undefined){

        out += cons + MATRA[v4];
        i += 4;
    }

    else if(MATRA[v3] !== undefined){

        out += cons + MATRA[v3];
        i += 3;
    }

    else if(MATRA[v2] !== undefined){

        out += cons + MATRA[v2];
        i += 2;
    }

    else if(MATRA[v1] !== undefined){

        out += cons + MATRA[v1];
        i += 1;
    }

    else{

        out += cons;

        // suppress inherent vowel
        if(word[i] === "a"){
            i++;
        }
    }

    continue;
}
    // ===== INDEPENDENT VOWELS =====

    if(VOWELS[four]){

        out += VOWELS[four];

        i += 4;

        continue;
    }

    if(VOWELS[three]){

        out += VOWELS[three];

        i += 3;

        continue;
    }

    if(VOWELS[two]){

        out += VOWELS[two];

        i += 2;

        continue;
    }

    if(VOWELS[one]){

        out += VOWELS[one];

        i += 1;

        continue;
    }


    // ===== DEFAULT =====

    out += one;

    i++;
}

return postProcess(out);

}



// ===== Fixes =====

function postProcess(t){

return t

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