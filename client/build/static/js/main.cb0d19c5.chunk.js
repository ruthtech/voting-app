(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{18:function(e,a,t){},47:function(e,a,t){e.exports=t(80)},52:function(e,a,t){},78:function(e,a,t){},80:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),c=t(39),l=t.n(c),s=(t(52),t(11)),i=t(22),o=t(19),m=t(8),d=t.n(m),u=t(14),E=t.n(u),v=t(7),p=t(6);t(18);var f=function(e){var a=Object(n.useState)(),t=Object(s.a)(a,2),c=t[0],l=t[1],i=Object(n.useState)(),o=Object(s.a)(i,2),m=o[0],d=o[1];return r.a.createElement("div",{className:"container bg-grey full-screen"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col heading"},r.a.createElement("h1",null,"Canada Votes Online"))),r.a.createElement("div",{className:"row bottom"},r.a.createElement("div",{className:"col"},r.a.createElement(p.a,null,r.a.createElement(p.a.Group,{controlId:"formBasicUUID"},r.a.createElement(p.a.Label,{className:"entry-field-label"},"UUID"),r.a.createElement(p.a.Control,{type:"text",value:c,onChange:function(e){return l(e.target.value)}})),r.a.createElement(p.a.Group,{controlId:"formBasicPassword"},r.a.createElement(p.a.Label,{className:"entry-field-label"},"Password"),r.a.createElement(p.a.Control,{type:"password",value:m,onChange:function(e){return d(e.target.value)}})),r.a.createElement("div",{className:"right-align-div"},r.a.createElement(v.a,{variant:"secondary",type:"submit",onClick:function(a){e.handleFormSubmit(c,m,a)}},"Sign in"))))))};var h=function(e){return r.a.createElement("div",{className:"full-screen"},r.a.createElement("div",{className:"full-screen"},r.a.createElement(f,{handleFormSubmit:function(a,t,n){var r,c;return d.a.async((function(l){for(;;)switch(l.prev=l.next){case 0:return l.prev=0,n.preventDefault(),a=escape(a),r="/api/login/".concat(a,"/").concat(t),l.next=6,d.a.awrap(E.a.get(r));case 6:c=l.sent,console.log("Login.js login with uuid "+a+" found the following user "),console.log(c),c===[]||(e.handleValidate(c.data[0]),e.history.push({pathname:"/landing",user:{details:c}})),l.next=16;break;case 12:l.prev=12,l.t0=l.catch(0),console.log(l.t0),e.handleValidate(!1);case 16:case"end":return l.stop()}}),null,null,[[0,12]])}})))};var b=function(e){return console.log("Landing"),console.log(e),r.a.createElement("div",{className:"container bg-map full-screen"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"mt-3"},r.a.createElement(p.a,{className:"bg-white"},r.a.createElement(p.a.Group,{className:"between-align-div",controlId:"editElectoralDistrict"},r.a.createElement(p.a.Label,null,"Your district is ",e.user.district),r.a.createElement(v.a,{variant:"secondary",onClick:function(){e.history.push({pathname:"/editdistrict",user:e.user.data})}},"Edit"))))),r.a.createElement("div",{className:"row bottom"},r.a.createElement("div",{className:"col spread-align-div"},r.a.createElement(v.a,{variant:"secondary",onClick:function(){e.history.push({pathname:"/viewcandidates",district:{details:e.user.data}})}},"View Candidates"),r.a.createElement(v.a,{variant:"secondary"},"Vote"))))},g=t(46),N=t(10),w=t(41);var y=function(e){var a=Object(n.useState)(),t=Object(s.a)(a,2),c=t[0],l=t[1],i=Object(n.useState)(),o=Object(s.a)(i,2),m=o[0],u=o[1],f=Object(n.useState)(),h=Object(s.a)(f,2),b=h[0],y=h[1];return r.a.createElement("div",{className:"container bg-grey full-screen"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col"},r.a.createElement("h1",null,"Enter your new address"))),r.a.createElement("div",{className:"row bottom"},r.a.createElement("div",{className:"col"},r.a.createElement(p.a,null,r.a.createElement(p.a.Group,{controlId:"formBasicUUID"},r.a.createElement(p.a.Label,{className:"entry-field-label"},"Address"),r.a.createElement(p.a.Control,{type:"text",placeholder:"Enter address",onChange:function(e){return l(e.target.value)}})),r.a.createElement(p.a.Group,{controlId:"formBasicPassword"},r.a.createElement(p.a.Label,{className:"entry-field-label"},"City"),r.a.createElement(p.a.Control,{type:"text",placeholder:"Enter city",onChange:function(e){return u(e.target.value)}})),r.a.createElement(w.a,{id:"provinceDropdown",title:"Province/Territory",variant:"secondary",onChange:function(e){return y(e.target.value)}},r.a.createElement(N.a.Item,null,"Alberta"),r.a.createElement(N.a.Item,null,"British Columbia"),r.a.createElement(N.a.Item,null,"Manitoba"),r.a.createElement(N.a.Item,null,"New Brunswick"),r.a.createElement(N.a.Item,null,"Newfoundland and Labrador"),r.a.createElement(N.a.Item,null,"Northwest Territories"),r.a.createElement(N.a.Item,null,"Nova Scotia"),r.a.createElement(N.a.Item,null,"Nunavut"),r.a.createElement(N.a.Item,null,"Ontario"),r.a.createElement(N.a.Item,null,"Prince Edward Island"),r.a.createElement(N.a.Item,null,"Quebec"),r.a.createElement(N.a.Item,null,"Saskatchewan"),r.a.createElement(N.a.Item,null,"Yukon")),r.a.createElement("div",{className:"right-align-div"},r.a.createElement(v.a,{variant:"secondary",type:"submit",onClick:function(a){!function(a){var t,n;d.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,d.a.awrap(E.a.get("/api/findDistrict/".concat(c,"/").concat(m,"/").concat(b)));case 2:t=a.sent,(n=Object(g.a)({},e.user.data)).address=c,n.city=m,n.province=b,n.district=t,e.history.push({pathname:"/editdistrictconfirm",user:n});case 9:case"end":return a.stop()}}))}()}},"Save"))))))};var x=function(e){return r.a.createElement("div",{className:"container bg-grey full-screen"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col"},r.a.createElement("h1",null,"Is this correct?"))),r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col bg-white centre-align-div"},r.a.createElement("p",null,e.user.data.address))),r.a.createElement("div",{className:"row bottom"},r.a.createElement("div",{className:"col"},r.a.createElement(p.a,null,r.a.createElement("div",{className:"spread-align-div"},r.a.createElement(v.a,{variant:"secondary",type:"button",onClick:e.history.push({pathname:"/editdistrict",user:e.user.data})},"Edit"),r.a.createElement(v.a,{variant:"secondary",type:"submit",onClick:function(a){return d.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,d.a.awrap(E.a.put("/api/updateAddress/".concat(e.user.data.uuid,"/").concat(e.user.data.address,"/").concat(e.user.data.city,"/").concat(e.user.data.province,"/").concat(e.user.data.district)));case 2:a.sent;case 3:case"end":return a.stop()}}))}},"Confirm"))))))},O=t(12);var C=function(e){return console.log("CandidateCard"),console.log(e),e.model.map((function(e,a){return r.a.createElement("div",{className:"ml-3 mt-3 col-12 col-sm-4"},r.a.createElement(i.b,{to:"/api/candidate/"+e.id},r.a.createElement(O.a,{key:a,className:e.party},r.a.createElement(O.a.Img,{variant:"top",src:e.pictureURL}),r.a.createElement(O.a.Title,null,e.name),r.a.createElement(O.a.Text,null,e.party))))}))};var j=function(e){var a=Object(n.useState)([]),t=Object(s.a)(a,2),c=t[0],l=t[1];console.log("viewcandidates"),console.log(e),Object(n.useEffect)((function(){console.log("ViewCandidates useEffect"),i(e.user.district)}),[]);var i=function(e){var a;return d.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,console.log("/api/candidates/".concat(e)),t.next=4,d.a.awrap(E.a.get("/api/candidates/".concat(e)));case 4:a=t.sent,console.log("View Candidates found ",a),l(a.data),t.next=13;break;case 9:t.prev=9,t.t0=t.catch(0),console.log(t.t0),l([]);case 13:case"end":return t.stop()}}),null,null,[[0,9]])};return r.a.createElement("div",{className:"container bg-grey"},r.a.createElement("div",{className:"row"},r.a.createElement(C,{model:c})),r.a.createElement("div",{className:"row p-3"},r.a.createElement("div",{className:"col spread-align-div"},r.a.createElement(v.a,{variant:"secondary",onClick:function(){e.history.push({pathname:"/landing",props:{props:e}})}},"Home"))))},I=t(45);var k=function(e){var a=Object(n.useState)([]),t=Object(s.a)(a,2),c=t[0],l=t[1];Object(n.useEffect)((function(){console.log(e),i(e.candidate.id)}),[]);var i=function(e){var a,t;return d.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,a="/api/candidate/".concat(e),n.next=4,d.a.awrap(E.a.get(a));case 4:t=n.sent,l(t),n.next=12;break;case 8:n.prev=8,n.t0=n.catch(0),console.log(n.t0),l({});case 12:case"end":return n.stop()}}),null,null,[[0,8]])};return r.a.createElement("div",{className:c.party+" container"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col text-center"},r.a.createElement(I.a,{src:c.pictureURL})),r.a.createElement("div",{className:"col"},r.a.createElement("h1",null,c.name),r.a.createElement("h5",null,c.party),r.a.createElement("h5",null,c.district))),r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col"},r.a.createElement(O.a,{className:c.party},r.a.createElement(O.a.Body,null,r.a.createElement(O.a.Title,null,"Contact"),r.a.createElement(O.a.Text,null,"Phone: ",c.phone),r.a.createElement(O.a.Text,null,"Office Address: ",c.address),r.a.createElement(O.a.Text,null,"Email: ",c.email),r.a.createElement(O.a.Text,null,"Twitter: ",r.a.createElement(O.a.Link,{href:c.twitter},c.twitter)),r.a.createElement(O.a.Text,null,"Website: ",r.a.createElement(O.a.Link,{href:c.website},c.website)))))),r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col centre-align-div"},r.a.createElement("h2",null,r.a.createElement("a",{href:c.party_website},c.party)))),r.a.createElement("div",{className:"row p-3"},r.a.createElement("div",{className:"col spread-align-div"},r.a.createElement(v.a,{variant:"secondary"},"View Candidates"),r.a.createElement(v.a,{variant:"secondary",onClick:function(){e.history.push({pathname:"/landing",props:{props:e}})}},"Home"))))},S=t(24);var L=function(e){return e.model.map((function(a,t){return r.a.createElement(S.a,{key:t,className:"pb-3"},r.a.createElement(p.a.Control,{plaintext:!0,readOnly:!0,className:"bg-white text-right pr-3",defaultValue:a.name+"/"+a.party}),r.a.createElement(S.a.Append,null,r.a.createElement(S.a.Radio,{name:"votingGroup","aria-label":a.name+"/"+a.party,onSelect:function(a){return e.handleFormSelect(a)}})))}))};var V=function(e){var a=Object(n.useState)([]),t=Object(s.a)(a,2),c=t[0],l=t[1],i=Object(n.useState)(),o=Object(s.a)(i,2),m=o[0],u=o[1];Object(n.useEffect)((function(){p(e.user.district)}),[]);var p=function(e){var a;return d.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,d.a.awrap(E.a.get("/candidates?district=".concat(e)));case 3:a=t.sent,console.log(a),l(a.data),t.next=12;break;case 8:t.prev=8,t.t0=t.catch(0),console.log(t.t0),l([]);case 12:case"end":return t.stop()}}),null,null,[[0,8]])};return r.a.createElement("div",{className:"container bg-grey full-screen"},r.a.createElement("div",{className:"row pt-3"},r.a.createElement("div",{className:"col"},r.a.createElement("h1",null,"Vote in District ",e.user.district))),r.a.createElement("div",{className:"row pt-3 pb-3"},r.a.createElement("div",{className:"col"},r.a.createElement(L,{model:c,handleFormSelect:function(e){return d.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:u(e.target.value);case 1:case"end":return a.stop()}}))}}))),r.a.createElement("div",{className:"row bottom"},r.a.createElement("div",{className:"col right-align-div"},r.a.createElement(v.a,{variant:"secondary",type:"submit",onClick:e.history.push({pathname:"/voteconfirm",candidate:{selectedCandidate:m}})},"Vote"))))};var T=function(e){return r.a.createElement("div",{className:e.party+" container full-screen"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col"},r.a.createElement("h1",null,"You are voting for"))),r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col"},r.a.createElement(p.a,null,r.a.createElement(p.a.Group,{controlId:"voteForCandidate"},r.a.createElement(p.a.Label,null,e.name),r.a.createElement(p.a.Label,null,e.party),r.a.createElement(p.a.Control,{as:"textarea",rows:"3",disabled:!0}))))),r.a.createElement("div",{className:"row pt-3"},r.a.createElement("div",{className:"col"},r.a.createElement("h1",null,"Is this correct?"))),r.a.createElement("div",{className:"row bottom"},r.a.createElement("div",{className:"col spread-align-div"},r.a.createElement(v.a,{variant:"secondary"},"Edit"),r.a.createElement(v.a,{variant:"secondary"},"Confirm"))))};var B=function(e){return r.a.createElement("div",{className:e.party+" container"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col"},r.a.createElement("h1",null,"You voted for"))),r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col"},r.a.createElement(p.a,null,r.a.createElement(p.a.Group,{controlId:"voteForCandidate"},r.a.createElement(p.a.Label,null,e.name),r.a.createElement(p.a.Label,null,e.party),r.a.createElement(p.a.Control,{as:"textarea",rows:"3",disabled:!0}))))),r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col"},r.a.createElement("h2",null,"Thank you! Your vote has been registered."))),r.a.createElement("div",{className:"row bottom"},r.a.createElement("div",{className:"col right-align-div"},r.a.createElement(v.a,{variant:"secondary"},"Home"))))};t(78);var D=function(){var e=Object(n.useState)(),a=Object(s.a)(e,2),t=a[0],c=a[1],l=function(e){console.log("App handleValidate called with",e),c(e)};return r.a.createElement("div",{className:"full-screen"},r.a.createElement(i.a,null,r.a.createElement("div",{className:"full-screen"},r.a.createElement(o.a,{exact:!0,path:"/",render:function(e){return r.a.createElement(h,Object.assign({},e,{handleValidate:l}))}}),r.a.createElement(o.a,{exact:!0,path:"/landing",render:function(e){return r.a.createElement(b,Object.assign({},e,{user:t}))}}),r.a.createElement(o.a,{exact:!0,path:"/editdistrict",render:function(e){return r.a.createElement(y,Object.assign({},e,{user:t}))}}),r.a.createElement(o.a,{exact:!0,path:"/editdistrictconf",render:function(e){return r.a.createElement(x,Object.assign({},e,{user:t}))}}),r.a.createElement(o.a,{exact:!0,path:"/viewcandidates",render:function(e){return r.a.createElement(j,Object.assign({},e,{user:t}))}}),r.a.createElement(o.a,{path:"/candidate",render:function(e){return r.a.createElement(k,Object.assign({},e,{user:t}))}}),r.a.createElement(o.a,{path:"/vote",render:function(e){return r.a.createElement(V,Object.assign({},e,{user:t}))}}),r.a.createElement(o.a,{path:"/voteconfirm",render:function(e){return r.a.createElement(T,Object.assign({},e,{user:t}))}}),r.a.createElement(o.a,{path:"/votesubmitted",render:function(e){return r.a.createElement(B,Object.assign({},e,{user:t}))}}))))};t(79);l.a.render(r.a.createElement(D,null),document.getElementById("root"))}},[[47,1,2]]]);
//# sourceMappingURL=main.cb0d19c5.chunk.js.map