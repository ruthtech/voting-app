(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{15:function(e,t,a){},34:function(e,t,a){e.exports=a(68)},39:function(e,t,a){},64:function(e,t,a){},68:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a.n(n),r=a(29),l=a.n(r),i=(a(39),a(5)),s=a(10),o=a.n(s),u=a(8),m=a(9),d=a(14),p=a.n(d),E=c.a.createContext();a(15);var b=function(){var e=Object(n.useState)(),t=Object(i.a)(e,2),a=t[0],r=t[1],l=Object(n.useState)(),s=Object(i.a)(l,2),d=s[0],b=s[1];return c.a.createElement(E.Consumer,null,(function(e){var t=e.handleLogin;return c.a.createElement("div",{className:"container-fluid bg-grey full-screen"},c.a.createElement("div",{className:"row"},c.a.createElement("div",{className:"col heading"},c.a.createElement("h1",null,"Canada Votes Online"))),c.a.createElement("div",{className:"row bottom"},c.a.createElement("div",{className:"col"},c.a.createElement(m.a,null,c.a.createElement(m.a.Group,{controlId:"formBasicUUID"},c.a.createElement(m.a.Label,{className:"entry-field-label"},"UUID"),c.a.createElement(m.a.Control,{type:"text",value:a,onChange:function(e){return r(e.target.value)}})),c.a.createElement(m.a.Group,{controlId:"formBasicPassword"},c.a.createElement(m.a.Label,{className:"entry-field-label"},"Password"),c.a.createElement(m.a.Control,{type:"password",value:d,onChange:function(e){return b(e.target.value)}})),c.a.createElement("div",{className:"right-align-div"},c.a.createElement(u.a,{variant:"secondary",type:"submit",onClick:function(e){!function(e,t,a,n){var c,r;o.a.async((function(l){for(;;)switch(l.prev=l.next){case 0:return l.prev=0,n.preventDefault(),e=escape(e),c="/api/login/".concat(e,"/").concat(t),l.next=6,o.a.awrap(p.a.get(c));case 6:r=l.sent,console.log("Login.js login with uuid "+e+" found the following user "),console.log(r),r!==[]&&a(r.data[0]),l.next=16;break;case 12:l.prev=12,l.t0=l.catch(0),console.log(l.t0),a(null);case 16:case"end":return l.stop()}}),null,null,[[0,12]])}(a,d,t,e)}},"Sign in"))))))}))},v=a(12),f=a(31);var w=function(e){var t=Object(n.useState)(e.user),a=Object(i.a)(t,1)[0],r=Object(n.useState)(0),l=Object(i.a)(r,2),s=l[0],m=l[1],d=function(){return c.a.createElement("div",{className:"container-fluid bg-grey full-screen"},c.a.createElement("div",{className:"row pt-3"},c.a.createElement("div",{className:"col"},c.a.createElement("h4",null,"Is this correct?"))),c.a.createElement("div",{className:"row"},c.a.createElement("div",{className:"col bg-white centre-align-div"},c.a.createElement("p",null,unescape(a.address),", ",unescape(a.city),", ",unescape(a.province)))),c.a.createElement("div",{className:"row bottom"},c.a.createElement("div",{className:"col"},c.a.createElement(u.a,{variant:"secondary w-100",type:"button",onClick:function(){m(1)}},"Edit")),c.a.createElement("div",{className:"col"},c.a.createElement(u.a,{variant:"secondary w-100",type:"submit",onClick:function(){o.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,o.a.awrap(p.a.put("/api/updateAddress/".concat(a.uuid,"/").concat(a.address,"/").concat(a.city,"/").concat(a.province,"/").concat(a.district)));case 3:e.sent,e.next=9;break;case 6:e.prev=6,e.t0=e.catch(0),console.log(e.t0);case 9:case"end":return e.stop()}}),null,null,[[0,6]]),m(2)}},"Confirm"))))};return function(){switch(s){case 1:return c.a.createElement(h,null);case 2:return c.a.createElement(L,null);case 0:default:return d()}}()};var h=function(){var e=Object(n.useState)(),t=Object(i.a)(e,2),a=t[0],r=t[1],l=Object(n.useState)(),s=Object(i.a)(l,2),d=s[0],p=s[1],b=Object(n.useState)(),h=Object(i.a)(b,2),g=h[0],y=h[1],N=Object(n.useState)(),C=Object(i.a)(N,2),j=C[0],O=C[1],S=Object(n.useState)(0),k=Object(i.a)(S,2),x=k[0],I=k[1],L=function(){return c.a.createElement("div",{className:"container-fluid bg-grey full-screen"},c.a.createElement("div",{className:"row"},c.a.createElement("div",{className:"col"},c.a.createElement("h1",null,"Enter your new address"))),c.a.createElement("div",{className:"row pb-3"},c.a.createElement("div",{className:"col "},c.a.createElement(m.a,null,c.a.createElement(m.a.Group,{controlId:"formBasicUUID"},c.a.createElement(m.a.Label,{className:"entry-field-label"},"Address"),c.a.createElement(m.a.Control,{type:"text",placeholder:"Enter address",onChange:function(e){return r(e.target.value)}})),c.a.createElement(m.a.Group,{controlId:"formBasicPassword"},c.a.createElement(m.a.Label,{className:"entry-field-label"},"City"),c.a.createElement(m.a.Control,{type:"text",placeholder:"Enter city",onChange:function(e){return p(e.target.value)}})),c.a.createElement(m.a.Group,{controlId:"provinces",className:"right-align-div"},c.a.createElement(f.a,{id:"provinceDropdown",title:"Province/Territory",variant:"secondary"},c.a.createElement(v.a.Item,{id:"Alberta",onClick:function(e){return y(e.target.id)}},"Alberta"),c.a.createElement(v.a.Item,{id:"British%20Columbia",onClick:function(e){return y(e.target.id)}},"British Columbia"),c.a.createElement(v.a.Item,{id:"Manitoba",onClick:function(e){return y(e.target.id)}},"Manitoba"),c.a.createElement(v.a.Item,{id:"New%20Brunswick",onClick:function(e){return y(e.target.id)}},"New Brunswick"),c.a.createElement(v.a.Item,{id:"Newfoundland%20and%20Labrador",onClick:function(e){return y(e.target.id)}},"Newfoundland and Labrador"),c.a.createElement(v.a.Item,{id:"Northwest%20Territories",onClick:function(e){return y(e.target.id)}},"Northwest Territories"),c.a.createElement(v.a.Item,{id:"Nova%20 Scotia",onClick:function(e){return y(e.target.id)}},"Nova Scotia"),c.a.createElement(v.a.Item,{id:"Nunavut",onClick:function(e){return y(e.target.id)}},"Nunavut"),c.a.createElement(v.a.Item,{id:"Ontario",onClick:function(e){return y(e.target.id)}},"Ontario"),c.a.createElement(v.a.Item,{id:"Prince%20Edward%20Island",onClick:function(e){return y(e.target.value)}},"Prince Edward Island"),c.a.createElement(v.a.Item,{id:"Quebec",onClick:function(e){return y(e.target.id)}},"Quebec"),c.a.createElement(v.a.Item,{id:"Saskatchewan",onClick:function(e){return y(e.target.id)}},"Saskatchewan"),c.a.createElement(v.a.Item,{id:"Yukon",onClick:function(e){return y(e.target.id)}},"Yukon"))),c.a.createElement(m.a.Group,{controlId:"formSubmit",className:"right-align-div"},c.a.createElement(u.a,{variant:"secondary w-50",type:"submit",onClick:function(e){!function(e){var t,n;o.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:try{t=escape(a),n=escape(d),j.address=t,j.city=n,j.province=g,O(j)}catch(c){console.log(c)}case 1:case"end":return e.stop()}}))}(),I(1)}},"Save"))))))},A=function(){switch(x){case 1:return c.a.createElement(w,{user:j});case 0:default:return L()}};return c.a.createElement(E.Consumer,null,(function(e){var t=e.user;return O(t),A()}))};var g=function(){return c.a.createElement("div",null,c.a.createElement("i",{className:"fa fa-spinner fa-spin"})," Loading...")},y=a(33),N=a(7);var C=function(e){var t=Object(n.useState)(e.candidate),a=Object(i.a)(t,1)[0],r=Object(n.useState)(0),l=Object(i.a)(r,2),s=l[0],o=l[1];return function(){switch(s){case 2:return console.log("CandidateDetails going home"),c.a.createElement(L,null);case 1:return c.a.createElement(j,null);case 0:default:return c.a.createElement("div",{className:"container-fluid full-screen bg-grey"},c.a.createElement("div",{className:"row"},c.a.createElement("div",{className:"col text-center"},c.a.createElement(y.a,{src:a.pictureURL})),c.a.createElement("div",{className:"col"},c.a.createElement("h1",null,a.name),c.a.createElement("h5",null,a.party),c.a.createElement("h5",null,a.district))),c.a.createElement("div",{className:"row"},c.a.createElement("div",{className:"col"},c.a.createElement(N.a,{className:a.party},c.a.createElement(N.a.Body,null,c.a.createElement(N.a.Title,null,"Contact"),c.a.createElement(N.a.Text,null,c.a.createElement("b",null,"Phone:")," ",a.phone),c.a.createElement(N.a.Text,null,c.a.createElement("b",null,"Office Address:")," ",a.address),c.a.createElement(N.a.Text,null,c.a.createElement("b",null,"Email:")," ",a.email),c.a.createElement(N.a.Text,null,c.a.createElement("b",null,"Twitter:")," ",c.a.createElement(N.a.Link,{href:a.twitter},a.twitter)),c.a.createElement(N.a.Text,null,c.a.createElement("b",null,"Website:")," ",c.a.createElement(N.a.Link,{href:a.website},a.website)))))),c.a.createElement("div",{className:"row"},c.a.createElement("div",{className:"col centre-align-div"},c.a.createElement("h2",null,c.a.createElement("a",{href:a.party_website},a.party)))),c.a.createElement("div",{className:"row p-3 bottom"},c.a.createElement("div",{className:"col"},c.a.createElement(u.a,{variant:"secondary w-100",onClick:function(){o(1)}},"View Candidates")),c.a.createElement("div",{className:"col"},c.a.createElement(u.a,{variant:"secondary w-100",onClick:function(){o(2)}},"Home"))))}}()};var j=function(){var e=Object(n.useState)([]),t=Object(i.a)(e,2),a=t[0],r=t[1],l=Object(n.useState)(null),s=Object(i.a)(l,2),m=s[0],d=s[1],b=Object(n.useState)(null),v=Object(i.a)(b,2),f=v[0],w=v[1],h=Object(n.useState)(0),y=Object(i.a)(h,2),j=y[0],O=y[1];console.log("viewcandidates"),Object(n.useEffect)((function(){console.log("ViewCandidates useEffect"),function(){var e;o.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,null!==m){t.next=4;break}return console.log("Vote loadCandidates no voter yet"),t.abrupt("return");case 4:if(0!==j){t.next=12;break}return console.log("/api/candidates/".concat(m.district)),t.next=8,o.a.awrap(p.a.get("/api/candidates/".concat(m.district)));case 8:e=t.sent,console.log("View Candidates found ",e),r(e.data),O(2);case 12:t.next=20;break;case 14:t.prev=14,t.t0=t.catch(0),console.log(t.t0),r([{name:"A. Scheer",pictureURL:"/candidate-pc-photo.jpg",party:"Conservative Party of Canada",district:"W01",id:"1234",phone:"1-800-100-1000",address:"1 Anywhere St",email:"scheer@pc.ca",twitter:"@scheer-pc",website:"http://scheer.pc.ca",party_website:"http://www.conservative.ca"},{name:"E. May",pictureURL:"/candidate-pc-photo.jpg",party:"Green Party of Canada",district:"W01",id:"2345",phone:"1-800-200-2000",address:"2 Anywhere St",email:"may@green.ca",twitter:"@may-green",website:"http://may.green.ca",party_website:"http://greenparty.ca"},{name:"J. Singh",pictureURL:"/candidate-pc-photo.jpg",party:"New Democrat Party",district:"W01",id:"3456",phone:"1-800-300-3000",address:"3 Anywhere St",email:"singh@ndp.ca",twitter:"@singh-ndp",website:"http://singh.ndp.ca",party_website:"http://www.ndp.ca"},{name:"Y. Blanchet",pictureURL:"/candidate-pc-photo.jpg",party:"Bloc Quebecois",district:"W01",id:"4567",phone:"1-800-400-41000",address:"4 Anywhere St",email:"blanchet@blocquebecois.org",twitter:"@blanchet-bloc",website:"http://blanchet.blocquebecois.org",party_website:"http://blocquebecois.org"},{name:"J. Trudeau",pictureURL:"/candidate-pc-photo.jpg",party:"Liberal Party of Canada",district:"W01",id:"5678",phone:"1-800-500-5000",address:"5 Anywhere St",email:"trudeau@liberal.ca",twitter:"@trudeau-liberal",website:"http://trudeau.liberal.ca",party_website:"http://www.liberal.ca"}]),O(2);case 20:case"end":return t.stop()}}),null,null,[[0,14]])}()}),[m]);var S=function(e){return c.a.createElement("div",{key:e.id,className:"col-12 col-sm-4 mt-3"},c.a.createElement(N.a,{className:e.party},c.a.createElement(N.a.Img,{variant:"top",src:e.pictureURL}),c.a.createElement(N.a.Title,null,e.name),c.a.createElement(N.a.Text,null,e.party),c.a.createElement("button",{className:"btn btn-secondary",onClick:function(t){w(e),O(3)}},"View ",e.name)))},k=function(){switch(j){case 0:return c.a.createElement(g,null);case 1:return console.log("CandidateCard going home"),c.a.createElement(L,null);case 3:return e=f,c.a.createElement(C,{candidate:e,handleSelectCandidate:w});case 4:return a.map((function(e){return S(e)}));case 2:default:return c.a.createElement("div",{className:"container-fluid bg-grey"},c.a.createElement("div",{className:"row "},a.map((function(e){return console.log(e),S(e)}))),c.a.createElement("div",{className:"row mt-3 pb-3"},c.a.createElement("div",{className:"col text-right"},c.a.createElement(u.a,{variant:"secondary",onClick:function(){O(1)}},"Home"))))}var e};return c.a.createElement(E.Consumer,null,(function(e){var t=e.user;return d(t),k()}))},O=a(19);var S=function(e){return e.model.map((function(t,a){return c.a.createElement(O.a,{key:a,className:"pb-3"},c.a.createElement(m.a.Control,{plaintext:!0,readOnly:!0,className:"bg-white text-right pr-3",defaultValue:t.name+"/"+t.party}),c.a.createElement(O.a.Append,null,c.a.createElement(O.a.Radio,{name:"votingGroup","aria-label":t.name+"/"+t.party,onChange:function(){return e.handleFormSelect(t)}})))}))};var k=function(e){var t=Object(n.useState)(e.candidate),a=Object(i.a)(t,1)[0],r=Object(n.useState)(0),l=Object(i.a)(r,2),s=l[0],m=l[1];console.log("VoteSubmitted props is ",e),console.log("VoteSubmitted candidate is ",a);var d=function(){switch(s){case 1:return c.a.createElement(L,null);case 0:default:return c.a.createElement("div",{className:"container-fluid bg-grey full-screen"},c.a.createElement("div",{className:"row"},c.a.createElement("div",{className:"col"},c.a.createElement("h1",null,"You voted for"))),c.a.createElement("div",{className:"row pb-3"},c.a.createElement("div",{className:"col"},c.a.createElement(N.a,null,c.a.createElement(N.a.Body,null,c.a.createElement(N.a.Title,null,a.name),c.a.createElement(N.a.Text,null,a.party))))),c.a.createElement("div",{className:"row pt-3"},c.a.createElement("div",{className:"col"},c.a.createElement("h2",null,"Thank you! Your vote has been registered."))),c.a.createElement("div",{className:"row bottom"},c.a.createElement("div",{className:"col right-align-div"},c.a.createElement(u.a,{variant:"secondary w-50",onClick:function(){m(1)}},"Home"))))}};return c.a.createElement(E.Consumer,null,(function(e){return function(e,t){o.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,o.a.awrap(p.a.put("/api/vote/".concat(e.uuid,"/").concat(t.id)));case 3:a.next=8;break;case 5:a.prev=5,a.t0=a.catch(0),console.log(a.t0);case 8:case"end":return a.stop()}}),null,null,[[0,5]])}(e.user,a),d()}))};var x=function(e){var t=Object(n.useState)(0),a=Object(i.a)(t,2),r=a[0],l=a[1],s=Object(n.useState)(e.candidate),o=Object(i.a)(s,1)[0];console.log("VoteConfirm candidate is ",o);var m=function(){switch(r){case 1:return c.a.createElement(I,null);case 2:return c.a.createElement(k,{candidate:o});case 0:default:return c.a.createElement("div",{className:"container-fluid bg-grey full-screen"},c.a.createElement("div",{className:"row pb-3"},c.a.createElement("div",{className:"col"},c.a.createElement("h1",null,"You are voting for"))),c.a.createElement("div",{className:"row pb-3 text-center"},c.a.createElement("div",{className:"col"},c.a.createElement(N.a,null,c.a.createElement(N.a.Body,null,c.a.createElement(N.a.Title,null,o.name),c.a.createElement(N.a.Text,null,o.party))))),c.a.createElement("div",{className:"row pt-3"},c.a.createElement("div",{className:"col"},c.a.createElement("h1",null,"Is this correct?"))),c.a.createElement("div",{className:"row bottom"},c.a.createElement("div",{className:"col"},c.a.createElement(u.a,{variant:"secondary w-100",onClick:function(){l(1)}},"Edit")),c.a.createElement("div",{className:"col"},c.a.createElement(u.a,{variant:"secondary w-100",onClick:function(){l(2)}},"Confirm"))))}};return c.a.createElement(E.Consumer,null,(function(e){e.user;return m()}))};var I=function(){var e=Object(n.useState)(null),t=Object(i.a)(e,2),a=t[0],r=t[1],l=Object(n.useState)(null),s=Object(i.a)(l,2),m=s[0],d=s[1],b=Object(n.useState)(0),v=Object(i.a)(b,2),f=v[0],w=v[1],h=Object(n.useState)(null),y=Object(i.a)(h,2),N=y[0],C=y[1];Object(n.useEffect)((function(){!function(){var e;o.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,null!==N){t.next=3;break}return t.abrupt("return");case 3:if(0!==f){t.next=9;break}return t.next=6,o.a.awrap(p.a.get("/api/candidates/".concat(N.district)));case 6:e=t.sent,r(e.data),w(2);case 9:t.next=17;break;case 11:t.prev=11,t.t0=t.catch(0),console.log(t.t0),r([{name:"A. Scheer",pictureURL:"/candidate-pc-photo.jpg",party:"Conservative Party of Canada",district:"W01",id:"1234",phone:"1-800-100-1000",address:"1 Anywhere St",email:"scheer@pc.ca",twitter:"@scheer-pc",website:"http://scheer.pc.ca",party_website:"http://www.conservative.ca"},{name:"E. May",pictureURL:"/candidate-pc-photo.jpg",party:"Green Party of Canada",district:"W01",id:"2345",phone:"1-800-200-2000",address:"2 Anywhere St",email:"may@green.ca",twitter:"@may-green",website:"http://may.green.ca",party_website:"http://greenparty.ca"},{name:"J. Singh",pictureURL:"/candidate-pc-photo.jpg",party:"New Democrat Party",district:"W01",id:"3456",phone:"1-800-300-3000",address:"3 Anywhere St",email:"singh@ndp.ca",twitter:"@singh-ndp",website:"http://singh.ndp.ca",party_website:"http://www.ndp.ca"},{name:"Y. Blanchet",pictureURL:"/candidate-pc-photo.jpg",party:"Bloc Quebecois",district:"W01",id:"4567",phone:"1-800-400-41000",address:"4 Anywhere St",email:"blanchet@blocquebecois.org",twitter:"@blanchet-bloc",website:"http://blanchet.blocquebecois.org",party_website:"http://blocquebecois.org"},{name:"J. Trudeau",pictureURL:"/candidate-pc-photo.jpg",party:"Liberal Party of Canada",district:"W01",id:"5678",phone:"1-800-500-5000",address:"5 Anywhere St",email:"trudeau@liberal.ca",twitter:"@trudeau-liberal",website:"http://trudeau.liberal.ca",party_website:"http://www.liberal.ca"}]),w(2);case 17:case"end":return t.stop()}}),null,null,[[0,11]])}()}),[N]);var j=function(e){return o.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:console.log("Vote, candidate selected, candidate is ",e),d(e);case 2:case"end":return t.stop()}}))},O=function(){switch(f){case 0:return c.a.createElement(g,null);case 1:return c.a.createElement(x,{candidate:m});case 2:default:return c.a.createElement("div",{className:"container-fluid bg-grey full-screen"},c.a.createElement("div",{className:"row pt-3"},c.a.createElement("div",{className:"col"},c.a.createElement("h1",null,"Vote in District ",N.district))),c.a.createElement("div",{className:"row pt-3 pb-3"},c.a.createElement("div",{className:"col"},c.a.createElement(S,{model:a,handleFormSelect:j}))),c.a.createElement("div",{className:"row bottom"},c.a.createElement("div",{className:"col right-align-div"},c.a.createElement(u.a,{variant:"secondary w-50",type:"submit",onClick:function(){w(1)},disabled:null===m},"Vote"))))}};return c.a.createElement(E.Consumer,null,(function(e){var t=e.user;return C(t),O()}))};var L=function(){var e=Object(n.useState)(null),t=Object(i.a)(e,2),a=t[0],r=t[1],l=Object(n.useState)(1),s=Object(i.a)(l,2),o=s[0],m=s[1];Object(n.useEffect)((function(){m(0)}),[a]);var d=function(){switch(o){case 4:return c.a.createElement(I,null);case 3:return c.a.createElement(j,null);case 2:return c.a.createElement(h,null);case 1:return c.a.createElement(g,null);case 0:default:return function(){if(null!=a)return m(0),c.a.createElement("div",{className:"container-fluid bg-map full-screen"},c.a.createElement("div",{className:"row"},c.a.createElement("div",{className:"col-8 col-sm-9 mt-3 ml-3 bg-white text-center pt-2"},"Your district is ",a.district),c.a.createElement("div",{className:"col-3 col-sm-2 mt-3"},c.a.createElement(u.a,{variant:"secondary w-100",onClick:function(){m(2)}},"Edit"))),c.a.createElement("div",{className:"row pb-3 bottom"},c.a.createElement("div",{className:"col"},c.a.createElement(u.a,{variant:"secondary w-100",onClick:function(){m(3)}},"View Candidates")),c.a.createElement("div",{className:"col"},c.a.createElement(u.a,{variant:"secondary w-100",onClick:function(){m(4)}},"Vote"))))}()}};return c.a.createElement(E.Consumer,null,(function(e){var t=e.user;return r(t),d()}))};a(64);var A=function(){var e=Object(n.useState)(null),t=Object(i.a)(e,2),a=t[0],r=t[1],l=null;return l=null!=a?c.a.createElement(L,null):c.a.createElement(b,null),c.a.createElement(E.Provider,{value:{user:a,handleLogin:function(e){console.log("App Context ",e),r(e)}}},l)};a(65),a(66),a(67);l.a.render(c.a.createElement(A,null),document.getElementById("root"))}},[[34,1,2]]]);
//# sourceMappingURL=main.09ca6947.chunk.js.map