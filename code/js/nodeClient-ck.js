var socket=io.connect("http://localhost:8080"),userList=new Array,lights=new Array;for(var i=0;i<10;i++){spotlight=new THREE.SpotLight(15261886,1,1e4,Math.PI/4,10);spotlight.castShadow=!0;spotlight.intensity=0;scene.add(spotlight);lights.push(spotlight)}var looks=new Array,test=document.getElementById("test"),User=function(e,t,n){this.posX=e;this.posY=t;this.userid=n;this.light=lights[userList.length];this.light.intensity=1;var r=new THREE.Geometry(100,100,10,10),i=new THREE.MeshLambertMaterial({color:16711680,transparent:!0});look=new THREE.Mesh(r,i);this.look=look;scene.add(this.look)};socket.on("entrance",function(e){newUser(e.userid);console.log(e.message)});socket.on("init",function(e){console.log(e.userid);console.log(e.users)});socket.on("init user",function(e){newUser(e.userid);console.log(userList.length)});socket.on("user disconnect",function(e){for(var t=0;t<userList.length;t++)if(userList[t].userid==e.userid){var n=document.getElementById("test").childNodes[t];n.parentNode.removeChild(n);userList.splice(t,1);console.log("The user "+e.userid+" has disconnected.")}});socket.on("movement",function(e){updateLights(e.userid,e.lookX,e.lookY,e.camX,e.camY)});var newUser=function(e){var t=new User(0,0,e);console.log(t);userList.push(t)},updateLights=function(e,t,n,r,i){for(var s=0;s<userList.length;s++)if(e==userList[s].userid){userList[s].look.position.set(t,n,0);userList[s].light.position.set(r,i,1200);userList[s].light.target=userList[s].look;userList[s].m.position.set(t,n,0)}};