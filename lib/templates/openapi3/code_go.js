'use strict';
module.exports = function anonymous(data
) {
var out='package main\n\nimport (\n       "bytes"\n       "net/http"\n)\n\nfunc main() {\n\n';if(data.allHeaders.length){out+='\n    headers := map[string][]string{\n        ';var arr1=data.allHeaders;if(arr1){var p,index=-1,l1=arr1.length-1;while(index<l1){p=arr1[index+=1];out+='"'+(p.name)+'": []string{"'+(p.exampleValues.object)+'"},';if(index < data.allHeaders.length-1){out+='\n        ';}} } out+='\n    }';}out+='\n\n    data := bytes.NewBuffer([]byte{jsonReq})\n    req, err := http.NewRequest("'+(data.methodUpper)+'", "'+(data.url)+'", data)\n    req.Header = headers\n\n    client := &http.Client{}\n    resp, err := client.Do(req)\n    // ...\n}\n';return out;
};
