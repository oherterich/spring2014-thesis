//**********************INSTAGRAM STUFF********************************
var photos=[];window.onload=function(){function F(){v=J(u.position.z,1e3,4500,500,2e3);var e=Y.position.x,t=Y.position.y;while(lineLength(Y.position.x,Y.position.y,e,t)<v){e=u.position.x+Math.cos(Math.random()*Math.PI*2)*v;t=u.position.y+Math.sin(Math.random()*Math.PI*2)*v}var n=Math.random()*10,r=Math.random()*(Math.PI/2)-Math.PI/4,i=new THREE.PlaneGeometry(500,500,10,10),s=new THREE.MeshLambertMaterial({color:16777215}),o=Math.floor(Math.random()*photoLinks.length),a=THREE.ImageUtils.loadTexture("instagram_img/"+photoLinks[o]+".jpg"),f=Math.floor(Math.random()*5),l=THREE.ImageUtils.loadTexture("instagram_img/texture_"+f+".jpg"),c=new THREE.MeshPhongMaterial({map:a,bumpMap:l,bumpScale:15}),p=new THREE.Mesh(i,c);p.position.x=e;p.position.y=t;p.position.z=n;p.rotation.z=r;x.push(p);h.add(x[x.length-1])}function I(){m=J(u.position.z,1e3,4500,1e3,3e3);for(var e=0;e<x.length;e++){var t=lineLength(x[e].position.x,x[e].position.y,u.position.x,u.position.y);if(t>m){h.remove(x[e]);x.splice(e,1)}}}function q(){if(E!=V.x||S!=V.y){E=V.x;S=V.y;w=J(u.position.z,1e3,4500,1200,1400);for(var e=0;e<x.length;e++){var t=lineLength(x[e].position.x,x[e].position.y,Y.position.x,Y.position.y);if(t<w&&t>w/2){var n=Math.floor(Math.random()*31),r=THREE.ImageUtils.loadTexture("img/instagram_"+n+".jpg");x[e].material.map=r}}}window.setTimeout(q,2e3)}function $(){var e=V.x/X*X/2-1,t=-(V.y/W)*W/2+1;z.set(e,t,.5);U.unprojectVector(z,u)}function J(e,t,n,r,i){return r+(i-r)*(e-t)/(n-t)}function Z(r){u.position.z<1e3&&(u.position.z=1e3);u.position.z>4500&&(u.position.z=4500);if(a!=u.position.x||f!=u.position.y){a=u.position.x;f=u.position.y;l=u.position.z;g=J(u.position.z,1e3,4500,1,10);for(var i=0;i<g;i++)F();I()}var s=J(u.position.z,1e3,4500,Math.PI/8,Math.PI/40),o=J(u.position.z,1e3,4500,75,500);p.angle=s;p.exponent=o;if(K){var d=J(u.position.z,1e3,4500,600,1750),v=J(u.position.z,1e3,4500,.003,5e-4);for(var i=0;i<x.length;i++){if(x[i].material.color.r<=0&&x[i].material.color.g<=0&&x[i].material.color.b<=0){h.remove(x[i]);x.splice(i,1)}if(x[i].position.x>z.x-X/2-d&&x[i].position.x<z.x-X/2+d&&x[i].position.y>z.y+W/2-d&&x[i].position.y<z.y+W/2+d){x[i].material.color.r-=v;x[i].material.color.g-=v;x[i].material.color.b-=v}}}j.position.x=u.position.x;j.position.y=u.position.y;p.position.set(u.position.x,u.position.y,u.position.z);p.target=Y;window.requestAnimationFrame(Z,n.domElement);c.update();$();y=J(V.x,0,e,-120,-570);b=J(V.y,0,t,80,-200);Y.position.x=z.x-X/2+y;Y.position.y=z.y+W/2+b;Y.position.z=z.z-1e3;et()}function et(){n.autoClear=!1;n.clear();n.render(h,u)}var e=window.innerWidth,t=window.innerHeight,n=new THREE.WebGLRenderer({antialias:!0});n.setSize(e,t);n.setClearColorHex(131586,1);n.clear();document.body.appendChild(n.domElement);var r=45,i=e/t,s=1,o=5e4,u=new THREE.PerspectiveCamera(r,i,s,o);u.position.z=1200;u.position.y=0;u.position.x=0;var a=u.position.x,f=u.position.y,l=u.position.z,c=new THREE.TrackballControls(u,n.domElement);c.rotateSpeed=1;c.zoomSpeed=1.2;c.panSpeed=.8;c.noZoom=!1;c.noPan=!1;c.noRotate=!0;c.staticMoving=!0;c.dynamicDampingFactor=.3;c.keys=[65,83,68];c.addEventListener("change",et);var h=new THREE.Scene,p=new THREE.SpotLight(15261886,1,5e3,Math.PI/8,75),d=new THREE.HemisphereLight(16777215,16777215,1);h.add(d);h.add(p);n.shadowMapEnabled=!0;p.castShadow=!0;var v=350,m=1e3,g=1,y=-120,b=-120,w=1200,E=0,S=0,x=[];for(var T=0;T<30;T++){var N=Math.random()*2e3-1e3,C=Math.random()*2e3-1e3,k=Math.random()*10,L=Math.random()*(Math.PI/2)-Math.PI/4,A=new THREE.PlaneGeometry(500,500,10,10),O=new THREE.MeshLambertMaterial({color:16777215}),M=Math.floor(Math.random()*photoLinks.length),_=THREE.ImageUtils.loadTexture("instagram_img/"+photoLinks[M]+".jpg"),D=Math.floor(Math.random()*5),P=THREE.ImageUtils.loadTexture("instagram_img/texture_"+D+".jpg"),H=new THREE.MeshPhongMaterial({map:_,bumpMap:P,bumpScale:15}),B=new THREE.Mesh(A,H);B.position.x=N;B.position.y=C;B.position.z=k;B.rotation.z=L;x.push(B)}for(var T=0;T<x.length;T++)h.add(x[T]);var A=new THREE.PlaneGeometry(7280,3700,10,10),_=THREE.ImageUtils.loadTexture("instagram_img/background_texture_large.jpg"),O=new THREE.MeshPhongMaterial({map:_}),j=new THREE.Mesh(A,O);j.position.z=-1;h.add(j);lineLength=function(e,t,n,r){return Math.sqrt((e-=n)*e+(t-=r)*t)};var R=new THREE.Ray,U=new THREE.Projector,z=new THREE.Vector3,W=window.innerHeight,X=window.innerWidth,V={x:0,y:0};document.body.addEventListener("mousemove",function(e){V.x=e.clientX;V.y=e.clientY},!1);var K=!1;window.addEventListener("keypress",function(e){if(e.keyCode===70||e.keyCode===102)K=!K},!1);var Q=new THREE.Geometry(100,100,10,10),G=new THREE.MeshLambertMaterial({color:16711680,transparent:!0}),Y=new THREE.Mesh(Q,G);h.add(Y);Z((new Date).getTime())};