//*********************************************************************
var w=window.innerWidth,h=window.innerHeight,state=0,imageSize=500,maxZDepth=1,boundaryPct=.25,outerBoundary=imageSize*3/4,horizBoundary=6400,vertBoundary=3600,HUD=document.getElementById("HUD"),bMap=!0,panMaxSpeed=10,mouse=new THREE.Vector2,mouseDown=0,mouseDownCount=0,bIsFront=!0,bTextboxActive=!1,bFirstTimeNoteInstruction=!0,bFirstTimeClickInstruction=!0,moveSpeed=.35,bMoveToFront=!1,putBackRotation=Math.random()*(Math.PI/2)-Math.PI/4,bFadeLight=!1,bRotatePic=!1,rotateSpeed=.3,whichRotate=-1,damping=new THREE.Vector3(.75,.75,.75),maxSpeed=new THREE.Vector3(10,10,0),bHUDActive=!1,bHUDDraggable=!1,selectedImage=-1,selectedImagePos=new THREE.Vector3;selectedImagePos.set(0,0,0);var ray=new THREE.Ray,projector=new THREE.Projector,directionVector=new THREE.Vector3,SCREEN_HEIGHT=window.innerHeight,SCREEN_WIDTH=window.innerWidth,moveInfo={x:0,y:0},INTERSECTED,pickMouse=new THREE.Vector2,pickProjector=new THREE.Projector,pickRaycaster=new THREE.Raycaster,renderer=new THREE.WebGLRenderer({antialias:!0});renderer.setSize(w,h);renderer.setClearColorHex(131586,1);renderer.clear();var container=document.getElementById("container");container.appendChild(renderer.domElement);var FOV=45,ASPECT=w/h,NEAR=1,FAR=5e4,camera=new THREE.PerspectiveCamera(FOV,ASPECT,NEAR,FAR);camera.position.z=1200;camera.position.y=0;camera.position.x=0;var prevCamX=camera.position.x,prevCamY=camera.position.y,prevCamZ=camera.position.z,camSpeedX=0,camSpeedY=0,scene=new THREE.Scene,light=new THREE.SpotLight(15261886,1,1e4,Math.PI/4,10);scene.add(light);var clickedLight=new THREE.SpotLight(15261886,0,1e4,Math.PI/5,15);scene.add(clickedLight);var hemiLight=new THREE.HemisphereLight(16777215,16777215,1),lookAtThisGeom=new THREE.Geometry(100,100,10,10),lookAtThisText=new THREE.MeshLambertMaterial({color:16711680,transparent:!0}),lookAtThis=new THREE.Mesh(lookAtThisGeom,lookAtThisText);scene.add(lookAtThis);var prevLookAtThis=new THREE.Vector3;renderer.shadowMapEnabled=!0;light.castShadow=!0;var metaPlaneGeo=new THREE.PlaneGeometry(imageSize,imageSize,10,10),metaPlaneTexture=THREE.ImageUtils.loadTexture("instagram_img/paper-back.jpg"),metaPlaneBump=THREE.ImageUtils.loadTexture("instagram_img/paper-back-bump.jpg"),metaPlaneMat=new THREE.MeshPhongMaterial({map:metaPlaneTexture,bumpMap:metaPlaneBump,bumpScale:1}),metaPlane=new THREE.Mesh(metaPlaneGeo,metaPlaneMat);metaPlane.rotation.y=Math.PI;scene.add(metaPlane);var metaDataText_name="Hello, World!",metaCanvas_name=document.createElement("canvas");metaCanvas_name.width=500;metaCanvas_name.height=500;var metaContext_name=metaCanvas_name.getContext("2d");metaContext_name.font="36px Font";metaContext_name.fillStyle="rgba(40,40,40,0.9)";metaContext_name.fillText(metaDataText_name,0,50);var metaDataTexture_name=new THREE.Texture(metaCanvas_name);metaDataTexture_name.needsUpdate=!0;var metaDataMat_name=new THREE.MeshPhongMaterial({map:metaDataTexture_name});metaDataMat_name.transparent=!0;var metaData_name=new THREE.Mesh(new THREE.PlaneGeometry(metaCanvas_name.width,metaCanvas_name.height),metaDataMat_name);metaData_name.position.set(0,0,10);metaData_name.rotation.y=Math.PI;scene.add(metaData_name);var metaDataText_date="Hello, World!",metaCanvas_date=document.createElement("canvas");metaCanvas_date.width=500;metaCanvas_date.height=500;var metaContext_date=metaCanvas_date.getContext("2d");metaContext_date.font="24px Font";metaContext_date.fillStyle="rgba(40,40,40,0.9)";metaContext_date.fillText(metaDataText_date,0,50);var metaDataTexture_date=new THREE.Texture(metaCanvas_date);metaDataTexture_date.needsUpdate=!0;var metaDataMat_date=new THREE.MeshPhongMaterial({map:metaDataTexture_date});metaDataMat_date.transparent=!0;var metaData_date=new THREE.Mesh(new THREE.PlaneGeometry(metaCanvas_date.width,metaCanvas_date.height),metaDataMat_date);metaData_date.position.set(0,0,10);metaData_date.rotation.y=Math.PI;scene.add(metaData_date);var metaDataText_caption="Hello, World!",metaCanvas_caption=document.createElement("canvas");metaCanvas_caption.width=500;metaCanvas_caption.height=500;var metaContext_caption=metaCanvas_caption.getContext("2d");metaContext_caption.font="28px Font";metaContext_caption.fillStyle="rgba(40,40,40,0.9)";metaContext_caption.fillText(metaDataText_caption,0,50);var metaDataTexture_caption=new THREE.Texture(metaCanvas_caption);metaDataTexture_caption.needsUpdate=!0;var metaDataMat_caption=new THREE.MeshPhongMaterial({map:metaDataTexture_caption});metaDataMat_caption.transparent=!0;var metaData_caption=new THREE.Mesh(new THREE.PlaneGeometry(metaCanvas_caption.width,metaCanvas_caption.height),metaDataMat_caption);metaData_caption.position.set(0,0,10);metaData_caption.rotation.y=Math.PI;scene.add(metaData_caption);window.onload=function(){function o(e,t,n){this.pic=e;this.vel=t;this.acc=n}function N(){t=W(camera.position.z,1e3,4500,1e3,3e3);for(var e=0;e<u.length;e++){var n=U(u[e].pic.position.x,u[e].pic.position.y,camera.position.x,camera.position.y);if(n>t){scene.remove(u[e].pic);u.splice(e,1)}}}function C(){if(i!=moveInfo.x||s!=moveInfo.y){i=moveInfo.x;s=moveInfo.y;r=W(camera.position.z,1e3,4500,1200,1400);for(var e=0;e<u.length;e++){var t=U(u[e].pic.position.x,u[e].pic.position.y,lookAtThis.position.x,lookAtThis.position.y);if(t<r&&t>r/2){var n=Math.floor(Math.random()*31),o=THREE.ImageUtils.loadTexture("img/instagram_"+n+".jpg");u[e].pic.material.map=o}}}window.setTimeout(C,2e3)}function k(e){for(var t=0;t<u.length;t++)if(u[t].pic.id==e){selectedImage=t;selectedImagePos.set(u[t].pic.position.x,u[t].pic.position.y,u[t].pic.position.z);bMoveToFront=!0;metaPlane.position.set(camera.position.x,camera.position.y,camera.position.z-800);metaData_name.position.set(camera.position.x,camera.position.y,camera.position.z-799.9);metaData_date.position.set(camera.position.x,camera.position.y,camera.position.z-799.9);metaData_caption.position.set(camera.position.x,camera.position.y,camera.position.z-799.9);bFadeLight=!0;clickedLight.position.set(camera.position.x,camera.position.y,1e3);clickedLight.target=lookAtThis;u[t].pic.material.needsUpdate=!0;state=1;metaDataText_name=photoLinks[selectedImage].name;metaContext_name.save();metaContext_name.setTransform(1,0,0,1,0,0);metaContext_name.clearRect(0,0,metaCanvas_name.width,metaCanvas_name.height);metaContext_name.restore();metaContext_name.fillText(metaDataText_name,z(20,30),z(145,155));metaDataTexture_name.needsUpdate=!0;metaDataText_date=photoLinks[selectedImage].time;metaContext_date.save();metaContext_date.setTransform(1,0,0,1,0,0);metaContext_date.clearRect(0,0,metaCanvas_date.width,metaCanvas_date.height);metaContext_date.restore();metaContext_date.fillText(metaDataText_date,z(20,30),z(110,120));metaDataTexture_date.needsUpdate=!0;metaDataText_caption=photoLinks[selectedImage].caption;metaDataText_caption=="n"&&(metaDataText_caption="");var n=metaContext_caption.measureText(metaDataText_caption),r=n.width;metaContext_caption.save();metaContext_caption.setTransform(1,0,0,1,0,0);metaContext_caption.clearRect(0,0,metaCanvas_caption.width,metaCanvas_caption.height);metaContext_caption.restore();X(metaContext_caption,metaDataText_caption,z(20,30),z(200,220),400,32);metaDataTexture_caption.needsUpdate=!0}}function L(e,t){if(e<w/2-outerBoundary||e>w/2+outerBoundary||t<h/2-imageSize/2||t>h/2+imageSize/2){state=0;metaPlane.rotation.y=Math.PI;metaData_name.rotation.y=Math.PI;metaData_date.rotation.y=Math.PI;metaData_caption.rotation.y=Math.PI;bFadeLight=!0;u[selectedImage].pic.rotation.x=0;u[selectedImage].pic.rotation.y=0;bMoveToFront=!0;putBackRotation=Math.random()*(Math.PI/2)-Math.PI/4;maxZDepth+=.1;removeTextContainer();clearNotes();textbox.value="";bIsFront=!0;removeInstruction(2)}if(e>w/2+imageSize/3&&e<w/2+outerBoundary)if(bIsFront){bRotatePic=!0;whichRotate=0;bIsFront=!1;addTextContainer();addTextbox();createNotes(photoLinks[selectedImage].link);if(bFirstTimeNoteInstruction){addInstruction(2);bFirstTimeNoteInstruction=!1}}else{bRotatePic=!0;whichRotate=1;bIsFront=!0;removeTextContainer();clearNotes();textbox.value="";removeInstruction(2)}if(e<w/2-imageSize/3&&e>w/2-outerBoundary)if(bIsFront){bRotatePic=!0;whichRotate=2;bIsFront=!1;addTextContainer();addTextbox();createNotes(photoLinks[selectedImage].link);if(bFirstTimeNoteInstruction){addInstruction(2);bFirstTimeNoteInstruction=!1}}else{bRotatePic=!0;whichRotate=3;bIsFront=!0;removeTextContainer();clearNotes();textbox.value="";removeInstruction(2)}}function A(e,t){var n=Math.abs(w/2-e),r=Math.abs(h/2-t);e<w*boundaryPct?camSpeedX=W(n,w*boundaryPct,w/2,0,-panMaxSpeed):e>w-w*boundaryPct&&(camSpeedX=W(n,w*boundaryPct,w/2,0,panMaxSpeed));t<h*boundaryPct?camSpeedY=W(r,h*boundaryPct,h/2,0,panMaxSpeed):t>h-h*boundaryPct&&(camSpeedY=W(r,h*boundaryPct,h/2,0,-panMaxSpeed))}function O(){if(camera.position.x>horizBoundary-w/2){camSpeedX=0;camera.position.x=horizBoundary-w/2}if(camera.position.x<-horizBoundary+w/2){camSpeedX=0;camera.position.x=-horizBoundary+w/2}if(camera.position.y>vertBoundary-h/2){camSpeedY=0;camera.position.y=vertBoundary-h/2}if(camera.position.y<-vertBoundary+h/2){camSpeedY=0;camera.position.y=-vertBoundary+h/2}}function M(){var e=new THREE.Vector3(mouse.x/window.innerWidth*2-1,-(mouse.y/window.innerHeight)*2+1,.5);projector.unprojectVector(e,camera);var t=e.sub(camera.position).normalize(),n=-camera.position.z/t.z,r=camera.position.clone().add(t.multiplyScalar(n));directionVector.x=r.x;directionVector.y=r.y;directionVector.z=r.z}function _(){var e=new THREE.Vector3(pickMouse.x,pickMouse.y,1);pickProjector.unprojectVector(e,camera);pickRaycaster.set(camera.position,e.sub(camera.position).normalize());var t=pickRaycaster.intersectObjects(scene.children);if(t.length>0){INTERSECTED;INTERSECTED=t[0].object}else INTERSECTED=null}function D(){if(INTERSECTED!=null)for(var e=0;e<u.length;e++)if(u[e].pic.id==INTERSECTED.id){var t=new THREE.Vector3(lookAtThis.position.x-prevLookAtThis.x,lookAtThis.position.y-prevLookAtThis.y);u[e].pic.position.x+=t.x;u[e].pic.position.y+=t.y;u[e].vel=t.divide(new THREE.Vector3(3,3,3))}}function P(){for(var e=0;e<u.length;e++)if(u[e].pic.id==INTERSECTED.id){selectedImage=e;selectedImagePos.set(u[e].pic.position.x,u[e].pic.position.y,u[e].pic.position.z)}}function H(){if(bMap){var e=W(camera.position.x,-horizBoundary,horizBoundary,0,256)-26,t=W(camera.position.y,vertBoundary,-vertBoundary,0,160)-16;userPosition.style.left=e+"px";userPosition.style.top=t+"px";HUD.style.right="10px";HUD.style.bottom="10px"}else{userPosition.style.left="-9999px";userPosition.style.top="-9999px";HUD.style.right="-9999px";HUD.style.bottom="-9999px"}}function B(){var e=W(mouse.x,w-256-26,w-26,0,256)-26,t=W(mouse.y,h-160-16,h,0,160)-16;userPosition.style.left=e+"px";userPosition.style.top=t+"px";camera.position.x=W(e,0,256,-horizBoundary,horizBoundary);camera.position.y=W(t,0,160,vertBoundary,-vertBoundary)}function j(){if(document.activeElement.nodeName=="TEXTAREA"||document.activeElement.nodeName=="INPUT")bTextboxActive=!0}function F(){if(bIsFront)if(mouse.x>w/2+imageSize/3&&mouse.x<w/2+outerBoundary){if(u[selectedImage].pic.rotation.y<Math.PI/12){u[selectedImage].pic.rotation.y+=.1;metaPlane.rotation.y+=.1;metaData_name.rotation.y+=.1;metaData_date.rotation.y+=.1;metaData_caption.rotation.y+=.1}addRotateCursor()}else if(mouse.x<w/2-imageSize/3&&mouse.x>w/2-outerBoundary){if(u[selectedImage].pic.rotation.y>-Math.PI/12){u[selectedImage].pic.rotation.y-=.1;metaPlane.rotation.y-=.1;metaData_name.rotation.y-=.1;metaData_date.rotation.y-=.1;metaData_caption.rotation.y-=.1}addRotateCursor()}else{if(u[selectedImage].pic.rotation.y>.1){u[selectedImage].pic.rotation.y-=.1;metaPlane.rotation.y-=.1;metaData_name.rotation.y-=.1;metaData_date.rotation.y-=.1;metaData_caption.rotation.y-=.1}else if(u[selectedImage].pic.rotation.y<0){u[selectedImage].pic.rotation.y+=.1;metaPlane.rotation.y+=.1;metaData_name.rotation.y+=.1;metaData_date.rotation.y+=.1;metaData_caption.rotation.y+=.1}addAutoCursor()}else if(mouse.x>w/2+imageSize/2&&mouse.x<w/2+outerBoundary&&!bTextboxActive){removeNotes();hideTextbox();if(u[selectedImage].pic.rotation.y<Math.PI+Math.PI/12&&u[selectedImage].pic.rotation.y>0){u[selectedImage].pic.rotation.y+=.1;metaPlane.rotation.y+=.1;metaData_name.rotation.y+=.1;metaData_date.rotation.y+=.1;metaData_caption.rotation.y+=.1}else if(u[selectedImage].pic.rotation.y<-Math.PI+Math.PI/12&&u[selectedImage].pic.rotation.y<0){u[selectedImage].pic.rotation.y+=.1;metaPlane.rotation.y+=.1;metaData_name.rotation.y+=.1;metaData_date.rotation.y+=.1;metaData_caption.rotation.y+=.1}addRotateCursor()}else if(mouse.x<w/2-imageSize/2&&mouse.x>w/2-outerBoundary&&!bTextboxActive){removeNotes();hideTextbox();if(u[selectedImage].pic.rotation.y>Math.PI-Math.PI/12&&u[selectedImage].pic.rotation.y>0){u[selectedImage].pic.rotation.y-=.1;metaPlane.rotation.y-=.1;metaData_name.rotation.y-=.1;metaData_date.rotation.y-=.1;metaData_caption.rotation.y-=.1}else if(u[selectedImage].pic.rotation.y>-Math.PI-Math.PI/12&&u[selectedImage].pic.rotation.y<0){u[selectedImage].pic.rotation.y-=.1;metaPlane.rotation.y-=.1;metaData_name.rotation.y-=.1;metaData_date.rotation.y-=.1;metaData_caption.rotation.y-=.1}addRotateCursor()}else{if(u[selectedImage].pic.rotation.y>Math.PI){u[selectedImage].pic.rotation.y-=.1;metaPlane.rotation.y-=.1;metaData_name.rotation.y-=.1;metaData_date.rotation.y-=.1;metaData_caption.rotation.y-=.1}else if(u[selectedImage].pic.rotation.y<Math.PI-.1&&u[selectedImage].pic.rotation.y>0){u[selectedImage].pic.rotation.y+=.1;metaPlane.rotation.y+=.1;metaData_name.rotation.y+=.1;metaData_date.rotation.y+=.1;metaData_caption.rotation.y+=.1}if(u[selectedImage].pic.rotation.y<-Math.PI){u[selectedImage].pic.rotation.y+=.1;metaPlane.rotation.y+=.1;metaData_name.rotation.y+=.1;metaData_date.rotation.y+=.1;metaData_caption.rotation.y+=.1}else if(u[selectedImage].pic.rotation.y>-Math.PI+.1&&u[selectedImage].pic.rotation.y<0){u[selectedImage].pic.rotation.y-=.1;metaPlane.rotation.y-=.1;metaData_name.rotation.y-=.1;metaData_date.rotation.y-=.1;metaData_caption.rotation.y-=.1}addAutoCursor();addNotes();showTextbox()}}function I(e,t,n,r){var i=U(u[selectedImage].pic.position.x,u[selectedImage].pic.position.y,e,t);if(i>.01&&bMoveToFront){u[selectedImage].pic.position.x=moveSpeed*e+(1-moveSpeed)*u[selectedImage].pic.position.x;u[selectedImage].pic.position.y=moveSpeed*t+(1-moveSpeed)*u[selectedImage].pic.position.y;u[selectedImage].pic.position.z=moveSpeed*n+(1-moveSpeed)*u[selectedImage].pic.position.z;u[selectedImage].pic.rotation.z=moveSpeed*r+(1-moveSpeed)*u[selectedImage].pic.rotation.z}else bMoveToFront=!1}function q(e,t){if(Math.abs(u[selectedImage].pic.rotation.y-t)>.01&&bRotatePic){u[selectedImage].pic.rotation.y=e*t+(1-e)*u[selectedImage].pic.rotation.y;metaPlane.rotation.y=e*(t+Math.PI)+(1-e)*metaPlane.rotation.y;metaData_name.rotation.y=e*(t+Math.PI)+(1-e)*metaData_name.rotation.y;metaData_date.rotation.y=e*(t+Math.PI)+(1-e)*metaData_date.rotation.y;metaData_caption.rotation.y=e*(t+Math.PI)+(1-e)*metaData_caption.rotation.y}else{bRotatePic=!1;whichRotate=-1}}function R(e,t,n){Math.abs(e.intensity-n)>.001&&bFadeLight?e.intensity=t*n+(1-t)*e.intensity:bFadeLight=!1}function U(e,t,n,r){return Math.sqrt((e-=n)*e+(t-=r)*t)}function z(e,t){return Math.floor(Math.random()*(t-e+1))+e}function W(e,t,n,r,i){return r+(i-r)*(e-t)/(n-t)}function X(e,t,n,r,i,s){var o=t.split(" "),u="";for(var a=0;a<o.length;a++){var f=u+o[a]+" ",l=e.measureText(f),c=l.width;if(c>i&&a>0){e.fillText(u,n,r);u=o[a]+" ";r+=s}else u=f}e.fillText(u,n,r)}function V(e){camera.position.z<1e3&&(camera.position.z=1e3);camera.position.z>4500&&(camera.position.z=4500);socket.emit("movement",{lookX:lookAtThis.position.x,lookY:lookAtThis.position.y,camX:camera.position.x,camY:camera.position.y});if(state==0){O();M();camera.position.x+=camSpeedX;camera.position.y+=camSpeedY;bHUDDraggable&&bHUDActive?B():H();if(bHUDActive){camSpeedX=0;camSpeedY=0}var t=W(camera.position.z,1e3,4500,Math.PI/8,Math.PI/40),n=W(camera.position.z,1e3,4500,75,500);light.angle=t;light.exponent=n;T.position.x=camera.position.x;T.position.y=camera.position.y;light.position.set(camera.position.x,camera.position.y,camera.position.z);light.target=lookAtThis;if(selectedImage!=-1){I(selectedImagePos.x,selectedImagePos.y,maxZDepth,putBackRotation);R(light,.1,1);R(clickedLight,.1,0)}for(var r=0;r<u.length;r++){u[r].vel.x+=u[r].acc.x;u[r].vel.y+=u[r].acc.y;u[r].pic.position.x+=u[r].vel.x;u[r].pic.position.y+=u[r].vel.y;u[r].acc.set(0,0,0);u[r].vel.multiply(damping)}if(mouseDown){D();camSpeedX=0;camSpeedY=0;light.intensity=1.5;light.angle=Math.PI/4;light.exponent=30;mouseDownCount++}prevLookAtThis.x=lookAtThis.position.x;prevLookAtThis.y=lookAtThis.position.y;prevLookAtThis.z=lookAtThis.position.z;lookAtThis.position.x=directionVector.x;lookAtThis.position.y=directionVector.y;lookAtThis.position.z=directionVector.z}else if(state==1){lookAtThis.position.set(camera.position.x,camera.position.y,camera.position.z-1e3);I(camera.position.x,camera.position.y,camera.position.z-800,0);R(light,.02,0);R(clickedLight,.02,1);j();whichRotate==0&&q(rotateSpeed,Math.PI);whichRotate==1&&q(rotateSpeed,0);whichRotate==2&&q(rotateSpeed,-Math.PI);whichRotate==3&&q(rotateSpeed,0);bRotatePic||F()}window.requestAnimationFrame(V,renderer.domElement);$()}function $(){renderer.autoClear=!1;renderer.clear();renderer.render(scene,camera)}var e=350,t=1e3,n=1,r=1200,i=0,s=0,u=new Array;for(var a=0;a<10;a++){var f=Math.random()*4e3-2e3,l=Math.random()*4e3-2e3,c=Math.random()*maxZDepth,p=Math.random()*(Math.PI/2)-Math.PI/4,d=new THREE.PlaneGeometry(imageSize,imageSize,10,10),v=new THREE.MeshLambertMaterial({color:16777215}),m=THREE.ImageUtils.loadTexture("instagram_img/"+photoLinks[a].link+".jpg"),g=Math.floor(Math.random()*5),y=THREE.ImageUtils.loadTexture("instagram_img/texture_"+g+".jpg"),b=new THREE.MeshPhongMaterial({map:m,bumpMap:y,bumpScale:5}),E=new THREE.Mesh(d,b);E.position.x=f;E.position.y=l;E.position.z=c;E.rotation.z=p;var S=new THREE.Vector3(0,0,0),x=new THREE.Vector3(0,0,0);u.push(new o(E,S,x))}for(var a=0;a<u.length;a++)scene.add(u[a].pic);console.log(u);var d=new THREE.PlaneGeometry(7280,3700,10,10),m=THREE.ImageUtils.loadTexture("instagram_img/background_texture_large.jpg"),v=new THREE.MeshPhongMaterial({map:m}),T=new THREE.Mesh(d,v);T.position.z=-1;scene.add(T);document.body.addEventListener("mousemove",function(e){moveInfo.x=e.clientX;moveInfo.y=e.clientY;mouse.x=e.clientX;mouse.y=e.clientY;pickMouse.x=event.clientX/window.innerWidth*2-1;pickMouse.y=-(event.clientY/window.innerHeight)*2+1;if(mouseDown<1)if(e.clientX>w-w*boundaryPct||e.clientX<w*boundaryPct||e.clientY>h-h*boundaryPct||e.clientY<h*boundaryPct)A(e.clientX,e.clientY);else{camSpeedX=0;camSpeedY=0}if(instruction[0].style.opacity>0){instruction[0].style.opacity-=.005;if(instruction[0].style.opacity<=.005){instruction[0].style.opacity=0;removeInstruction(0);bFirstTimeClickInstruction&&addInstruction(1)}}},!1);window.addEventListener("keypress",function(e){if(e.keyCode==77||e.keyCode==109)bMap=!bMap},!1);container.addEventListener("click",function(e){if(state==0){if(mouseDownCount<10){k(INTERSECTED.id);removeInstruction(0);removeInstruction(1);bFirstTimeClickInstruction=!1}}else state==1&&L(e.clientX,e.clientY)},!1);container.addEventListener("mousedown",function(e){++mouseDown;mouseDownCount=0;state==0&&_()},!1);container.addEventListener("mouseup",function(e){--mouseDown;bHUDDraggable=!1},!1);V((new Date).getTime())};