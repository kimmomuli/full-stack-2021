(this.webpackJsonppuhelinluettelo=this.webpackJsonppuhelinluettelo||[]).push([[0],{42:function(e,n,t){},44:function(e,n,t){"use strict";t.r(n);var c=t(19),r=t.n(c),a=t(3),u=t(10),i=t(2),s=t(5),o=t.n(s),l="/api/persons",d=function(){return o.a.get(l).then((function(e){return e.data}))},j=function(e){return o.a.post(l,e).then((function(e){return e.data}))},f=function(e){o.a.delete("".concat(l,"/").concat(e))},b=function(e,n){return o.a.put("".concat(l,"/").concat(n),e).then((function(e){return e.data}))},h=(t(42),t(0)),m=function(e){var n=e.handleFilterChange,t=e.filter;return Object(h.jsxs)("div",{children:["filter shown with ",Object(h.jsx)("input",{value:t,onChange:n})]})},O=function(e){var n=e.addPerson,t=e.newName,c=e.handleNameChange,r=e.newNumber,a=e.handleNumberChange;return Object(h.jsxs)("form",{onSubmit:n,children:[Object(h.jsxs)("div",{children:["name: ",Object(h.jsx)("input",{value:t,onChange:c})]}),Object(h.jsxs)("div",{children:["number: ",Object(h.jsx)("input",{value:r,onChange:a})]}),Object(h.jsx)("div",{children:Object(h.jsx)("button",{type:"submit",children:"add"})})]})},v=function(e){var n=e.filteredList,t=e.setPersons,c=e.persons,r=e.setSuccessMessage;return Object(h.jsx)(h.Fragment,{children:n.map((function(e){return Object(h.jsxs)("p",{children:[e.name," ",e.number," ",Object(h.jsx)("button",{onClick:function(){return function(e){if(window.confirm("Delete ".concat(e.name))){f(e.id);var n=Object(u.a)(c);n.splice(n.indexOf(e),1),t(n),r("Deleted ".concat(e.name)),setTimeout((function(){r(null)}),3e3)}}(e)},children:"delete"})]},e.id)}))})},p=function(e){var n=e.message;return null===n?null:Object(h.jsx)("div",{className:"success",children:n})},x=function(e){var n=e.message;return null===n?null:Object(h.jsx)("div",{className:"error",children:n})},g=function(){var e=Object(i.useState)([]),n=Object(a.a)(e,2),t=n[0],c=n[1],r=Object(i.useState)(""),s=Object(a.a)(r,2),o=s[0],l=s[1],f=Object(i.useState)(""),g=Object(a.a)(f,2),w=g[0],C=g[1],N=Object(i.useState)(""),S=Object(a.a)(N,2),k=S[0],P=S[1],T=Object(i.useState)(null),y=Object(a.a)(T,2),D=y[0],F=y[1],L=Object(i.useState)(null),E=Object(a.a)(L,2),I=E[0],J=E[1];Object(i.useEffect)((function(){d().then((function(e){return c(e)}))}),[]);var M=k.length>0?t.filter((function(e){return e.name.toLowerCase().includes(k)})):t;return Object(h.jsxs)("div",{children:[Object(h.jsx)("h2",{children:"Phonebook"}),Object(h.jsx)(p,{message:D}),Object(h.jsx)(x,{message:I}),Object(h.jsx)(m,{handleFilterChange:function(e){return P(e.target.value)},filter:k}),Object(h.jsx)("h2",{children:"add a new"}),Object(h.jsx)(O,{addPerson:function(e){e.preventDefault();var n={name:o,number:w};if(t.some((function(e){return e.name===o}))){if(window.confirm("".concat(o," is already added to phonebook, replace the old number with a new one"))){var r=t.find((function(e){return e.name===o})).id;b(n,r).then((function(e){c(t.map((function(n){return n.name===o?e:n}))),F("Changed ".concat(n.name,"'s number")),setTimeout((function(){F(null)}),3e3)})).catch((function(e){J("Information of ".concat(n.name," has already been removed from server")),setTimeout((function(){J(null)}),3e3);var r=Object(u.a)(t),a=t.find((function(e){return e.name===o}));r.splice(r.indexOf(a),1),c(r)}))}}else j(n).then((function(e){c(t.concat(e)),F("Added ".concat(n.name)),setTimeout((function(){F(null)}),3e3)})).catch((function(e){J(e.response.data.error),setTimeout((function(){J(null)}),3e3)}));l(""),C(""),P("")},newName:o,handleNameChange:function(e){return l(e.target.value)},newNumber:w,handleNumberChange:function(e){return C(e.target.value)}}),Object(h.jsx)("h2",{children:"Numbers"}),Object(h.jsx)(v,{filteredList:M,setPersons:c,persons:t,setSuccessMessage:F})]})};r.a.render(Object(h.jsx)(g,{}),document.getElementById("root"))}},[[44,1,2]]]);
//# sourceMappingURL=main.007513b0.chunk.js.map