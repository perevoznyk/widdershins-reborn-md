'use strict';
module.exports = function anonymous(data
) {
var out='URL obj = new URL("'+(data.url)+(data.requiredQueryString)+'");\nHttpURLConnection con = (HttpURLConnection) obj.openConnection();\ncon.setRequestMethod("'+(data.methodUpper)+'");\nint responseCode = con.getResponseCode();\nBufferedReader in = new BufferedReader(\n    new InputStreamReader(con.getInputStream()));\nString inputLine;\nStringBuffer response = new StringBuffer();\nwhile ((inputLine = in.readLine()) != null) {\n    response.append(inputLine);\n}\nin.close();\nSystem.out.println(response.toString());\n';return out;
};
