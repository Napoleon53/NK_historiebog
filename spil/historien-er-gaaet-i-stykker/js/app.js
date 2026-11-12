'use strict';
/* =====================================================================
   app.js - opstarten
   index.html#5 åbner niveau 5 som øvelse (1-10), så læreren kan vise et
   enkelt niveau på tavlen. Uden nummer åbner forsiden.
   ===================================================================== */
(function(){
 const GENVEJ={'1':'archive','2':'action','3':'commandIntro','4':'paperIntro','5':'versailles','6':'inflationIntro','7':'weimar','8':'clockIntro','9':'nazi','10':'finalIntro'};
 visLyd();
 const fraAdresse=()=>{const h=decodeURIComponent(location.hash.replace('#',''));if(GENVEJ[h]){startOevelse(GENVEJ[h]);return true}return false};
 if(!fraAdresse())renderIntro();
 window.addEventListener('hashchange',fraAdresse);
 raf=requestAnimationFrame(tick);
})();
