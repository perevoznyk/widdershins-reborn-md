'use strict';
module.exports = function anonymous(data
) {
var out='require \'rest-client\'\nrequire \'json\'\n\n';if(data.allHeaders.length){out+='headers = {\n';var arr1=data.allHeaders;if(arr1){var p,index=-1,l1=arr1.length-1;while(index<l1){p=arr1[index+=1];out+='  \''+(p.name)+'\' => '+(p.exampleValues.json);if(index < data.allHeaders.length-1){out+=',';}out+='\n';} } out+='}';}out+='\n\nresult = RestClient.'+(data.method.verb)+' \''+(data.url)+'\',\n  params: {\n  ';var arr2=data.requiredParameters;if(arr2){var p,index=-1,l2=arr2.length-1;while(index<l2){p=arr2[index+=1];out+='\''+(p.name)+'\' => \''+(p.safeType)+'\'';if(data.requiredParameters.length-1 != index){out+=',';}out+='\n';} } out+='}';if(data.allHeaders.length){out+=', headers: headers\n';}out+='\n\np JSON.parse(result)\n';return out;
};
