let str = "ere., ;:ev –!?=«\"\'vere"
console.log("str", str);

let normstr2 = str.replace(/[.,;:–!?=«\"\']/g, "");
console.log("normstr2", normstr2);
let normstr = str.replace(/[^a-zA-Z 0-9]/g, "");
console.log("normstr", normstr);
console.log("str", str);
