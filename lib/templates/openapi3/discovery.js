'use strict';
module.exports = function anonymous(data
) {
var out='<script type="application/ld+json">\n{\n  "@context": "http://schema.org/",\n  "@type": "WebAPI",\n  ';if(data.api.info.description){out+='"description": "'+(data.api.info.description)+'",';}out+='\n  ';if(data.api.externalDocs){out+='"documentation": "'+(data.api.externalDocs.url)+'",';}out+='\n  ';if(data.api.info.termsOfService){out+='"termsOfService": "'+(data.api.info.termsOfService)+'",';}out+='\n  ';if(data.api.info["x-logo"] && data.api.info["x-logo"].url){out+='"logo": "'+(data.api.info["x-logo"].url)+'",';}out+='\n  "name": "'+(data.api.info.title)+'"\n}\n</script>\n';return out;
};
