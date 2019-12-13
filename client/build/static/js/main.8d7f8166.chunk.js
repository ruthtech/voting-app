(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{14:function(e,a,t){},43:function(e,a,t){e.exports=t(78)},48:function(e,a,t){},74:function(e,a,t){},78:function(e,a,t){"use strict";t.r(a);var n=t(0),l=t.n(n),r=t(35),c=t.n(r),o=(t(48),t(7)),s=t(12),i=t.n(s),u=t(10),m=t(6),d=t(15),E=t.n(d),v=l.a.createContext();t(14);var f=function(){var e=Object(n.useState)(),a=Object(o.a)(e,2),t=a[0],r=a[1],c=Object(n.useState)(),s=Object(o.a)(c,2),d=s[0],f=s[1];return l.a.createElement(v.Consumer,null,(function(e){var a=e.handleLogin;return l.a.createElement("div",{className:"container bg-grey full-screen"},l.a.createElement("div",{className:"row"},l.a.createElement("div",{className:"col heading"},l.a.createElement("h1",null,"Canada Votes Online"))),l.a.createElement("div",{className:"row bottom"},l.a.createElement("div",{className:"col"},l.a.createElement(m.a,null,l.a.createElement(m.a.Group,{controlId:"formBasicUUID"},l.a.createElement(m.a.Label,{className:"entry-field-label"},"UUID"),l.a.createElement(m.a.Control,{type:"text",value:t,onChange:function(e){return r(e.target.value)}})),l.a.createElement(m.a.Group,{controlId:"formBasicPassword"},l.a.createElement(m.a.Label,{className:"entry-field-label"},"Password"),l.a.createElement(m.a.Control,{type:"password",value:d,onChange:function(e){return f(e.target.value)}})),l.a.createElement("div",{className:"right-align-div"},l.a.createElement(u.a,{variant:"secondary",type:"submit",onClick:function(e){!function(e,a,t,n){var l,r;i.a.async((function(c){for(;;)switch(c.prev=c.next){case 0:return c.prev=0,n.preventDefault(),e=escape(e),l="/api/login/".concat(e,"/").concat(a),c.next=6,i.a.awrap(E.a.get(l));case 6:r=c.sent,console.log("Login.js login with uuid "+e+" found the following user "),console.log(r),r!==[]&&t(r.data[0]),c.next=16;break;case 12:c.prev=12,c.t0=c.catch(0),console.log(c.t0),t(null);case 16:case"end":return c.stop()}}),null,null,[[0,12]])}(t,d,a,e)}},"Sign in"))))))}))},p=t(42),g=t(9),b=t(37);var N=function(e){var a=Object(n.useState)(),t=Object(o.a)(a,2),r=t[0],c=t[1],s=Object(n.useState)(),d=Object(o.a)(s,2),f=d[0],N=d[1],w=Object(n.useState)(),y=Object(o.a)(w,2),h=y[0],C=y[1];return l.a.createElement(v.Consumer,null,l.a.createElement("div",{className:"container bg-grey full-screen"},l.a.createElement("div",{className:"row"},l.a.createElement("div",{className:"col"},l.a.createElement("h1",null,"Enter your new address"))),l.a.createElement("div",{className:"row bottom"},l.a.createElement("div",{className:"col"},l.a.createElement(m.a,null,l.a.createElement(m.a.Group,{controlId:"formBasicUUID"},l.a.createElement(m.a.Label,{className:"entry-field-label"},"Address"),l.a.createElement(m.a.Control,{type:"text",placeholder:"Enter address",onChange:function(e){return c(e.target.value)}})),l.a.createElement(m.a.Group,{controlId:"formBasicPassword"},l.a.createElement(m.a.Label,{className:"entry-field-label"},"City"),l.a.createElement(m.a.Control,{type:"text",placeholder:"Enter city",onChange:function(e){return N(e.target.value)}})),l.a.createElement(b.a,{id:"provinceDropdown",title:"Province/Territory",variant:"secondary",onChange:function(e){return C(e.target.value)}},l.a.createElement(g.a.Item,null,"Alberta"),l.a.createElement(g.a.Item,null,"British Columbia"),l.a.createElement(g.a.Item,null,"Manitoba"),l.a.createElement(g.a.Item,null,"New Brunswick"),l.a.createElement(g.a.Item,null,"Newfoundland and Labrador"),l.a.createElement(g.a.Item,null,"Northwest Territories"),l.a.createElement(g.a.Item,null,"Nova Scotia"),l.a.createElement(g.a.Item,null,"Nunavut"),l.a.createElement(g.a.Item,null,"Ontario"),l.a.createElement(g.a.Item,null,"Prince Edward Island"),l.a.createElement(g.a.Item,null,"Quebec"),l.a.createElement(g.a.Item,null,"Saskatchewan"),l.a.createElement(g.a.Item,null,"Yukon")),l.a.createElement("div",{className:"right-align-div"},l.a.createElement(u.a,{variant:"secondary",type:"submit",onClick:function(a){!function(a){var t,n;i.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,i.a.awrap(E.a.get("/api/findDistrict/".concat(r,"/").concat(f,"/").concat(h)));case 2:t=a.sent,(n=Object(p.a)({},e.user.data)).address=r,n.city=f,n.province=h,n.district=t,e.history.push({pathname:"/editdistrictconfirm",user:n});case 9:case"end":return a.stop()}}))}()}},"Save")))))))},w=t(17),y=t(41);var h=function(e){return console.log("CandidateCard"),console.log(e),e.model.map((function(e,a){return console.log(e),l.a.createElement(v.Consumer,null,l.a.createElement("div",{className:"ml-3 mt-3 col-12 col-sm-4"},l.a.createElement(y.a,{to:{pathname:"/candidate/",state:{data:e}}},l.a.createElement(w.a,{key:a,className:e.party},l.a.createElement(w.a.Img,{variant:"top",src:e.pictureURL}),l.a.createElement(w.a.Title,null,e.name),l.a.createElement(w.a.Text,null,e.party)))))}))};var C=function(e){var a=Object(n.useState)([]),t=Object(o.a)(a,2),r=t[0],c=t[1];console.log("viewcandidates"),console.log(e),Object(n.useEffect)((function(){console.log("ViewCandidates useEffect"),s(e.user.district)}),[]);var s=function(e){var a;return i.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,console.log("/api/candidates/".concat(e)),t.next=4,i.a.awrap(E.a.get("/api/candidates/".concat(e)));case 4:a=t.sent,console.log("View Candidates found ",a),c(a.data),t.next=13;break;case 9:t.prev=9,t.t0=t.catch(0),console.log(t.t0),c([]);case 13:case"end":return t.stop()}}),null,null,[[0,9]])};return l.a.createElement(v.Consumer,null,l.a.createElement("div",{className:"container bg-grey"},l.a.createElement("div",{className:"row"},l.a.createElement(h,{model:r})),l.a.createElement("div",{className:"row p-3"},l.a.createElement("div",{className:"col spread-align-div"},l.a.createElement(u.a,{variant:"secondary",onClick:function(){e.history.push({pathname:"/landing",props:{props:e}})}},"Home")))))},O=t(20);var j=function(e){return console.log("VoteRow ",e),e.model.map((function(a,t){return l.a.createElement(O.a,{key:t,className:"pb-3"},l.a.createElement(m.a.Control,{plaintext:!0,readOnly:!0,className:"bg-white text-right pr-3",defaultValue:a.name+"/"+a.party}),l.a.createElement(O.a.Append,null,l.a.createElement(O.a.Radio,{name:"votingGroup","aria-label":a.name+"/"+a.party,onSelect:function(a){return e.handleFormSelect(a)}})))}))};var I=function(e){return l.a.createElement(v.Consumer,null,l.a.createElement("div",{className:e.party+" container full-screen"},l.a.createElement("div",{className:"row"},l.a.createElement("div",{className:"col"},l.a.createElement("h1",null,"You are voting for"))),l.a.createElement("div",{className:"row"},l.a.createElement("div",{className:"col"},l.a.createElement(m.a,null,l.a.createElement(m.a.Group,{controlId:"voteForCandidate"},l.a.createElement(m.a.Label,null,e.name),l.a.createElement(m.a.Label,null,e.party),l.a.createElement(m.a.Control,{as:"textarea",rows:"3",disabled:!0}))))),l.a.createElement("div",{className:"row pt-3"},l.a.createElement("div",{className:"col"},l.a.createElement("h1",null,"Is this correct?"))),l.a.createElement("div",{className:"row bottom"},l.a.createElement("div",{className:"col spread-align-div"},l.a.createElement(u.a,{variant:"secondary"},"Edit"),l.a.createElement(u.a,{variant:"secondary"},"Confirm")))))};var x=function(){return l.a.createElement("div",null,l.a.createElement("i",{className:"fa fa-spinner fa-spin"})," Loading...")};var S=function(){var e=Object(n.useState)(null),a=Object(o.a)(e,2),t=a[0],r=a[1],c=Object(n.useState)(null),s=Object(o.a)(c,2),m=s[0],d=s[1],f=Object(n.useState)(!0),p=Object(o.a)(f,2),g=p[0],b=p[1],N=Object(n.useState)(null),w=Object(o.a)(N,2),y=w[0],h=w[1];Object(n.useEffect)((function(){console.log("Vote useEffect"),function(){var e;i.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:if(a.prev=0,null!==y){a.next=4;break}return console.log("Vote loadCandidates no voter yet"),a.abrupt("return");case 4:if(!g){a.next=12;break}return console.log("Vote loadCandidates voter is ",y),a.next=8,i.a.awrap(E.a.get("/api/candidates/".concat(y.district)));case 8:e=a.sent,console.log("Vote loadCandidates after ",e),r(e.data),b(!1);case 12:a.next=18;break;case 14:a.prev=14,a.t0=a.catch(0),console.log(a.t0),r([]);case 18:case"end":return a.stop()}}),null,null,[[0,14]])}()}),[y]);var C=function(e){return i.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:d(e.target.value);case 1:case"end":return a.stop()}}))},O=function(){return console.log("Vote renderDefault ",t),l.a.createElement("div",{className:"container bg-grey full-screen"},l.a.createElement("div",{className:"row pt-3"},l.a.createElement("div",{className:"col"},l.a.createElement("h1",null,"Vote in District ",y.district))),l.a.createElement("div",{className:"row pt-3 pb-3"},l.a.createElement("div",{className:"col"},l.a.createElement(j,{model:t,handleFormSelect:C}))),l.a.createElement("div",{className:"row bottom"},l.a.createElement("div",{className:"col right-align-div"},l.a.createElement(u.a,{variant:"secondary",type:"submit",onClick:function(){l.a.createElement(I,{candidate:m})}},"Vote"))))};return l.a.createElement(v.Consumer,null,(function(e){var a=e.user;return console.log("Vote in render. user is ",a),h(a),console.log("Vote in render. voter is ",y),console.log("Vote in render. candidates are ",t),console.log("Vote in render, loading is ",g),g?l.a.createElement(x,null):O()}))};var k=function(){console.log("Landing");var e=Object(n.useState)(null),a=Object(o.a)(e,2),t=a[0],r=a[1],c=Object(n.useState)(null),s=Object(o.a)(c,2),i=s[0],d=s[1],E=Object(n.useState)(!0),f=Object(o.a)(E,2),p=f[0],g=f[1];return Object(n.useEffect)((function(){console.log("useEffect"),d(function(){if(console.log("renderDefault"),null==t)return void console.log("voter is null, returning");return g(!1),l.a.createElement("div",{className:"container bg-map full-screen"},l.a.createElement("div",{className:"row"},l.a.createElement("div",{className:"col mt-3 w-100"},l.a.createElement(m.a,{className:"bg-white"},l.a.createElement(m.a.Group,{className:"between-align-div",controlId:"editElectoralDistrict"},l.a.createElement(m.a.Label,null,"Your district is ",t.district),l.a.createElement(u.a,{variant:"secondary",onClick:function(){d(l.a.createElement(N,null))}},"Edit"))))),l.a.createElement("div",{className:"row bottom"},l.a.createElement("div",{className:"col spread-align-div"},l.a.createElement(u.a,{variant:"secondary",onClick:function(){d(l.a.createElement(C,null))}},"View Candidates"),l.a.createElement(u.a,{variant:"secondary",onClick:function(){d(l.a.createElement(S,null))}},"Vote"))))}()),console.log(i)}),[t]),l.a.createElement(v.Consumer,null,(function(e){var a=e.user;return r(a),console.log(i),p?l.a.createElement(x,null):i}))};t(74);var V=function(){var e=Object(n.useState)(null),a=Object(o.a)(e,2),t=a[0],r=a[1],c=null;return c=null!=t?l.a.createElement(k,null):l.a.createElement(f,null),l.a.createElement(v.Provider,{value:{user:t,handleLogin:function(e){console.log("App Context ",e),r(e)}}},c)};t(75),t(76),t(77);c.a.render(l.a.createElement(V,null),document.getElementById("root"))}},[[43,1,2]]]);
//# sourceMappingURL=main.8d7f8166.chunk.js.map