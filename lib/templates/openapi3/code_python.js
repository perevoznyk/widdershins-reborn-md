'use strict';
module.exports = function anonymous(data
) {
var out='import requests\n';if(data.allHeaders.length){out+='headers = {\n';var arr1=data.allHeaders;if(arr1){var p,index=-1,l1=arr1.length-1;while(index<l1){p=arr1[index+=1];out+='  \''+(p.name)+'\': '+(p.exampleValues.json);if(index < data.allHeaders.length-1){out+=',';}out+='\n';} } out+='}\n';}out+='\nr = requests.'+(data.method.verb)+'(\''+(data.url)+'\'';if(data.requiredParameters.length){out+=', params={\n';var arr2=data.requiredParameters;if(arr2){var p,index=-1,l2=arr2.length-1;while(index<l2){p=arr2[index+=1];out+='  \''+(p.name)+'\': '+(p.exampleValues.json);if(data.requiredParameters.length-1 != index){out+=',';}} } out+='\n}';}if(data.allHeaders.length){out+=', headers = headers';}out+=')\n\nprint(r.json())\n';return out;
};
