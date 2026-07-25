'use strict';
module.exports = function anonymous(data
) {
var out=''+(data.methodUpper)+' '+(data.url)+(data.requiredQueryString)+' HTTP/1.1\n';if(data.host){out+='Host: '+(data.host);}out+='\n';if(data.consumes.length){out+='Content-Type: '+(data.consumes[0])+'\n';}if(data.produces.length){out+='Accept: '+(data.produces[0]);}out+='\n';if(data.headerParameters.length){var arr1=data.headerParameters;if(arr1){var p,index=-1,l1=arr1.length-1;while(index<l1){p=arr1[index+=1];out+=''+(p.name)+': '+(p.exampleValues.object)+'\n';} } out+='\n';}out+='\n';return out;
};
