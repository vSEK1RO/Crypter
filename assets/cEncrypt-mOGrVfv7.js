import{q as J,e as I,u as K,s as L,f as M,g as W,h as Y,i as x,a as t,w as n,F as G,r as c,o as f,d as w,j as v,t as z,k as A,l as Q,c as V,m as X,E as u,n as Z}from"./index-bx9cgALs.js";import{f as ee,t as te}from"./toBinary-DuiLyPBk.js";const ne=J("encrypt",{state:()=>({msg:[]}),actions:{set(){localStorage.setItem("encryptStore",JSON.stringify(this))},get(){const k=JSON.parse(localStorage.getItem("encryptStore"));k!=null&&(this.msg=k.msg)}}}),oe=w("h2",null,"Copy and share encrypted message",-1),le={class:"drawer-media-wrapper"},ae={class:"drawer-media"},se=w("h2",null,"Encrypt message",-1),re={key:1},ie={key:1},me={__name:"cEncrypt",setup(k){const _=I(window.outerWidth<900),E=K(),H=L(),l=ne(),s=M({name:"",key:atob(H.query.publicKey||""),message:""}),b=I(!1),m=M({isActive:!1,name:"",media:""});async function B(o){let e=!1;if(l.msg.findIndex(S=>S.name==s.name)!=-1&&(u.error({title:"Invalid input",message:"Name already exists"}),e=!0,await $(1)),s.name==""&&(u.error({title:"Invalid input",message:"Name must not be empty"}),e=!0,await $(1)),s.key==""&&(u.error({title:"Invalid input",message:"Public key must not be empty"}),e=!0,await $(1)),s.message==""&&(u.error({title:"Invalid input",message:"Msg must not be empty"}),e=!0),e)return;b.value=!0;let r=btoa(ee.pki.publicKeyFromPem(s.key).encrypt(te(s.message),"RSA-OAEP"));b.value=!1;let i=new Date;const y=i.getUTCHours().toString().padStart(2,"0"),d=i.getUTCMinutes().toString().padStart(2,"0"),p=i.getMonth().toString().padStart(2,"0"),g=i.getDate().toString().padStart(2,"0");l.msg.push({date:`${y}:${d.toString().padStart(2)} - ${g}.${p}`,name:s.name,enc:r}),l.set(),console.log(r),console.log(`"${s.name}" msg was encrypted`)}function $(o){return new Promise(e=>setTimeout(e,o))}function T(o){let e=l.msg.findIndex(r=>r.name==o);m.isActive=!0,m.media=l.msg[e].enc,m.name=l.msg[e].name,console.log(`"${o}" encrypted msg was shown`)}function U(o){navigator.clipboard.writeText(m.media).then(()=>{u.success("Copied to clipboard")}).catch(e=>{u.error("Error during copying")}),console.log(`"${m.name}" encrypted msg was copied`)}function C(o,e){let r=l.msg.findIndex(i=>i.name==o);if(e=="click"){let i=window.location.protocol,y=window.location.hostname,d=window.location.port;d==""&&(d="443");let{href:p}=E.resolve({path:"decrypt",query:{encryptedMsg:l.msg[r].enc}});navigator.clipboard.writeText(`${i}//${y}:${d}${p}`).then(()=>{u.success("Copied to clipboard")}).catch(g=>{u.error("Error during copying")}),console.log(`link to "${m.name}" encrypted msg was copied`)}else e=="cancel"?console.log(`redirect to "${o}" encrypted msg cancelled`):e=="confirm"&&(E.push({path:"decrypt",query:{encryptedMsg:l.msg[r].enc}}),console.log(`redirect to "${o}" encrypted msg confirmed`))}function D(o){let e=l.msg.findIndex(r=>r.name==o);Z.confirm(`Are you sure to delete msg "${o}"?`).then(()=>{l.msg.splice(e,1),l.set(),console.log(`"${o}" encrypted msg was deleted`)}).catch(r=>{r!="cancel"&&ElNotification.error({title:"Error",message:`deleteHandler(${o})
`})})}return W(()=>{l.get()}),addEventListener("resize",()=>{_.value=window.outerWidth<900}),(o,e)=>{const r=c("el-text"),i=c("el-button"),y=c("el-drawer"),d=c("el-form-item"),p=c("el-input"),g=c("el-table-column"),S=c("el-tag"),O=c("share"),N=c("el-icon"),P=c("el-popconfirm"),F=c("delete"),R=c("el-table"),j=c("el-form"),q=Y("loading");return f(),x(G,null,[t(y,{size:_.value?"100%":"50%",modelValue:m.isActive,"onUpdate:modelValue":e[0]||(e[0]=a=>m.isActive=a)},{header:n(()=>[oe]),default:n(()=>[w("div",le,[w("div",ae,[t(r,null,{default:n(()=>[v(z(m.media),1)]),_:1})])])]),footer:n(()=>[t(i,{type:"success",onClick:U},{default:n(()=>[v(" Copy to clipboard ")]),_:1})]),_:1},8,["size","modelValue"]),t(j,null,{default:n(()=>[t(d,null,{default:n(()=>[t(r,null,{default:n(()=>[se]),_:1})]),_:1}),t(d,null,{default:n(()=>[t(p,{modelValue:s.name,"onUpdate:modelValue":e[1]||(e[1]=a=>s.name=a),placeholder:"message name"},null,8,["modelValue"])]),_:1}),t(d,null,{default:n(()=>[t(p,{autosize:"",type:"textarea",modelValue:s.key,"onUpdate:modelValue":e[2]||(e[2]=a=>s.key=a),placeholder:"public key"},null,8,["modelValue"])]),_:1}),t(d,null,{default:n(()=>[t(p,{autosize:"",type:"textarea",modelValue:s.message,"onUpdate:modelValue":e[3]||(e[3]=a=>s.message=a),placeholder:"message"},null,8,["modelValue"])]),_:1}),t(d,null,{default:n(()=>[t(i,{onClick:B,type:"success"},{default:n(()=>[v(" Encrypt ")]),_:1})]),_:1}),t(d,null,{default:n(()=>[A(l).msg.length!=0?Q((f(),V(R,{key:0,data:A(l).msg},{default:n(()=>[t(g,{label:"Date",prop:"date",width:_.value?"70":"120"},null,8,["width"]),t(g,{label:"Name",prop:"name"},{default:n(a=>[t(S,null,{default:n(()=>[w("h2",null,z(a.row.name),1)]),_:2},1024)]),_:1}),t(g,{align:"right",label:"Operations",fixed:"right","min-width":"120"},{default:n(a=>[t(i,{size:"small",type:"info",onClick:h=>T(a.row.name)},{default:n(()=>[v(" Show ")]),_:2},1032,["onClick"]),t(P,{width:"220","confirm-button-text":"Yes","cancel-button-text":"No",onCancel:h=>C(a.row.name,"cancel"),onConfirm:h=>C(a.row.name,"confirm"),title:"Link copied. Do you want to be redirected?"},{reference:n(()=>[t(i,{size:"small",type:"success",onClick:h=>C(a.row.name,"click")},{default:n(()=>[_.value?(f(),V(N,{key:0},{default:n(()=>[t(O)]),_:1})):(f(),x("div",re,"Share"))]),_:2},1032,["onClick"])]),_:2},1032,["onCancel","onConfirm"]),t(i,{size:"small",type:"danger",onClick:h=>D(a.row.name)},{default:n(()=>[_.value?(f(),V(N,{key:0},{default:n(()=>[t(F)]),_:1})):(f(),x("div",ie,"Delete"))]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"])),[[q,b.value]]):X("",!0)]),_:1})]),_:1})],64)}}};export{me as default};
