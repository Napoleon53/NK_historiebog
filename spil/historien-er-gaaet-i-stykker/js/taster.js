'use strict';
/* =====================================================================
   taster.js - tastaturet i banerne og knapperne i toplinjen
   ===================================================================== */
function keyHandler(e,down){const key=e.code;if(['ArrowLeft','ArrowRight','ArrowUp','Space','KeyA','KeyD','KeyW','KeyE','KeyR','KeyP','Escape'].includes(key)&&erBane()&&!currentModal)e.preventDefault();if(key==='Escape'&&currentModal&&down){closeModal();return}if(erBane()&&game&&!currentModal){if(key==='KeyE'&&down&&!e.repeat){game.useTelegraph();return}if(key==='KeyR'&&down&&!e.repeat){state.lostLives++;save();game.resetCheckpoint();return}if((key==='KeyP'||key==='Escape')&&down&&!e.repeat){game.togglePause();return}game.keys[key]=down}}
window.addEventListener('keydown',e=>keyHandler(e,true));window.addEventListener('keyup',e=>keyHandler(e,false));window.addEventListener('blur',()=>{if(game){game.keys={};if(erBane()&&!game.paused)game.togglePause()}});
function visLyd(){$('#lydknap').textContent=state.sound?'Lyd til':'Lyd fra';$('#lydknap').setAttribute('aria-pressed',state.sound?'true':'false')}
$('#lydknap').onclick=()=>{state.sound=!state.sound;visLyd();if(state.sound)tone('ok')};
$('#menuknap').onclick=()=>{if(state.stage!=='intro')save();if(erBane()&&game)game.paused=true;stopGame();closeModal();state.stage='intro';renderIntro()};
