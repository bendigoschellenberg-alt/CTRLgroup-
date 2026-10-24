/* User-provided CTRL Group TikTok Video Catalog, October 2026.
   Display data only until the signed-in owner explicitly imports it.
   The original 33 screenshots remain matched to their posts by their old order.
   Five newer posts have no supplied screenshot and use a text-only preview. */
(function(){
  const newestRows = [
    ['7698192262919884050','2026-10-18','Love me some glowy blocks #minecraft #creative','She Built That — The Midnight Larks'],
    ['7698072323273837832','2026-10-18','Omg found a unicorn! #minecraft','I Am a Unicorn — Simone Sommerland, Karsten Glück, die Kita-Frösche'],
    ['7697793422869957894','2026-10-17','Gucci #minecraft #creative','CAN YOU SEE ME? — Rezz'],
    ['7696602629459184903','2026-10-14','The 55555th renovation for the Fuckery Factory #minecraft #creative','original sound — Katee'],
    ['7696319588383886610','2026-10-13','Barbie tropics #minecraft #creative','Welcome to My Game — Hazel Rowe']
  ];
  const screenshotRows = [
    ['7694897326317473031','2026-10-09','Mansion Driveway in the works! #minecraft #creative','New Level — Thunder Angel'],
    ['7694203662570245384','2026-10-08','Oh hey Barbie! #barbie #creative #minecraft',"No Limit Mode — Kalyshm'an"],
    ['7688993040064728321','2026-09-23','Day 1 at the motel and the journey begins. #PinkWink #TheHappyTrail #Minecraft #Creative #BuildJourney','Midnight City — M83'],
    ['7688445302700838152','2026-09-22','Final ranch update because I accidentally deleted it 😭 #creative #minecraft','Am I Wrong — Nico & Vinz'],
    ['7686578971542097160','2026-09-17','Mountain Ranch! #creative #minecraft','Turret Battery — Timothy Blankets'],
    ['7685961498602065160','2026-09-15','Mountain ranches driveway! #minecraft #creative','summer bummer Rhyrhy — rhyrhy home'],
    ['7684917186913176840','2026-09-13','Candy land #minecraft #creative #candyland','Tea Party in the Curious Forest — My Comfy Tale'],
    ['7684716186373737746','2026-09-12','Started my board game circus! Twister is complete minus the spinner w...','Skillet Shuffle Switch — Tulsa Nightshade'],
    ['7683193874768088338','2026-09-08','Beach resort incoming #minecraft #creative #resort','Iron Court — Lucinda Foxglove'],
    ['7682761628319796487','2026-09-07','Teddy bear picnic #minecraft #creative','Fairy Tale Dreamland — Sheidideya'],
    ['7682278302312041735','2026-09-05','working on my original barn build!','Too Hot For You — Pine Road Garage'],
    ['7682090996884081938','2026-09-05',"I haven't felt much lately. I have been working on the Journal app fo...",'Pry Bar Hype — Tommy Ridgeway'],
    ['7679164713426537735','2026-08-28','Coming along! #creative #minecraft','suara asli - Shinaehoshi — Shinae ほし'],
    ['7674115574871444744','2026-08-14','Rebuild of my teddy bear in my new world! Plus a mega bear! #creative...','Teddy Bear\'s Happy Day — Canzero'],
    ['7673202572831771922','2026-08-12','When the homework books become boring, we turn the exercises into Min...','Pressure Explodes — Cello Whisper'],
    ['7670294796757372178','2026-08-04','Avenues complete! Getting there. ##minecraft##creative','Baddest Queens — Loud Song'],
    ['7670103972249718024','2026-08-04','Give me a follow to see the hilarious Avenues! Video coming soon ! th...','MONTAGEM-FATAL PR — Rushex, MKXILLA'],
    ['7668104226991508754','2026-07-29','Putting all the streets into my mega city #Minecraft #c#creative','Working in Progress — Phortte Music'],
    ['7667814185618738450','2026-07-28',"ABC's I tried filming a bit more this time, but I forgot the very beg...",'FUTURE GAMER — HITEM'],
    ['7667739079806586119','2026-07-28',"ABC's #minecraft #creative",'Hey, look at this! Look!Hey! — aqunos'],
    ['7667737755987856647','2026-07-28',"ABC 's #minecraft #creative #alphabet #abc",'ABC - Stripped Mix — Jackson 5'],
    ['7666440845633146119','2026-07-25','#minecraft #creative','Minecraft — Sembari +'],
    ['7666363003411156232','2026-07-25','#minecraft #creative',"Let Em Know We're Here — Tink Tank"],
    ['7663884558139395335','2026-07-18','Sheep! #minecraft','original sound — MissiStephi'],
    ['7663883692481285383','2026-07-18',"Last one I just felt like making some TikTok's #minecraft",'original sound — MissiStephi'],
    ['7663875699291327752','2026-07-18','Little bit of inside, my first build. #minecraft','Glamorous — Fergie'],
    ['7663870604629658888','2026-07-18','My first build! #minecraft','Barbie Girl — Geek Music'],
    ['7663772623498644743','2026-07-18','Welcome to Bootiewood Flats! Next step furnishing all these units! #m...','Just A Girl — No Doubt'],
    ['7662482930077371655','2026-07-14','I love my little project board to keep all of my ideas in one spot in...','sorry i can\'t hear you i\'m kinda busy — life illustrated'],
    ['7660715785584790791','2026-07-09','#creative #minecraft','original sound — MissiStephi'],
    ['7660614182534008082','2026-07-09','#minecraft','som original — KS SHEIK'],
    ['7659914595938635016','2026-07-07','These were fun to build right before I learned about copy and paste #...','Wait I Can Do That Better — ditto'],
    ['7656674431653121288','2026-06-28','#minecraft','Olympo Rave — Kobe Mane, SoyFlowers']
  ];
  const toPost = ([id,date,caption,song],thumbnail=null)=>Object.freeze({
    id,date,caption,song,url:`https://www.tiktok.com/@missistephi/video/${id}`,thumbnail
  });
  window.CTRL_TIKTOK_CATALOG=Object.freeze([
    ...newestRows.map(row=>toPost(row)),
    ...screenshotRows.map((row,index)=>toPost(row,`./tiktok-thumbs/shot-${String(index).padStart(3,'0')}.jpg`))
  ]);
})();
