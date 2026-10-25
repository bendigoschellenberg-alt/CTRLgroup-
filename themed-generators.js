/* CTRL n crft — offline, predetermined, world-aware generator results.
   These are code-defined choices, NOT user records and NOT AI output.
   Each theme/category pair has exactly 25 subjects x 10 creative directions = 250 results.
   Existing GeneratorPrompt records remain separate and untouched. */
(function (root) {
  'use strict';

  const TOPICS = {
    general: ['community theatre','tiny bookshop','glass conservatory','market square','hidden waterfall','railway station','rooftop garden','artist studio','canal bridge','animal sanctuary','festival pavilion','town museum','mountain lookout','underground workshop','small bakery','secret library','floating cafe','clock tower','woodland trail','colourful arcade','cobblestone courtyard','observatory','harbour market','village inn','interactive maze'],
    city: ['downtown plaza','apartment tower','bus interchange','urban park','street market','train depot','hospital','fire station','school campus','skyscraper','movie theatre','shopping centre','courthouse','city hall','parking garage','rooftop restaurant','sports stadium','subway entrance','office tower','public library','pedestrian street','waterfront district','construction site','public swimming pool','museum of city history'],
    games: ['Yahtzee dice arena','Monopoly street board','giant Jenga tower','Connect Four wall','walkable chessboard','checkers pavilion','Snakes and Ladders course','Scrabble word plaza','Battleship arena','Clue mystery mansion','Guess Who gallery','Operation challenge room','Twister floor','Uno card arena','domino chain','pinball arcade','bowling alley','mini-golf challenge','Tetris tower','Pac-Man maze','platform-jumping course','capture-the-flag field','hide-and-seek labyrinth','escape room','board-game cafe'],
    garden: ['rose garden','butterfly meadow','cottage herb garden','Japanese zen garden','sunflower fields','fairy mushroom garden','botanical greenhouse','orchard','water-lily pond','topiary maze','wildflower preserve','secret walled garden','hanging terraces','community vegetable gardens','lavender walk','rain garden','desert cactus garden','moonlight garden','bee sanctuary','mossy grove','formal fountain garden','tropical conservatory','bamboo courtyard','flower market','garden tea pavilion'],
    barbie: ['pink dreamhouse','convertible showroom','fashion runway','glam dressing room','pink beach club','dream pool','beauty salon','pastel cafe','dollhouse boutique','pink horse stable','roller-skating rink','pink cinema','spa retreat','camper-van campsite','pastel shopping mall','makeup studio','retro pink diner','luxury hotel suite','rooftop garden','tennis club','fashion photo studio','pet boutique','amusement park','pink art gallery','ice-cream parlour'],
    pinkwink: ['retro motel room','roadside sign','midnight diner','weathered swimming pool','hidden workshop','locked Room Seven','vintage gas station','motel reception','underground tunnel','souvenir shop','late-night laundromat','forgotten guest cabin','motel courtyard','photo booth','secret evidence wall','dusty payphone','pink neon arch','vacant billboard','desert rest stop','abandoned service garage','trailer park','mystery vending machine','staff-only stairwell','roadside cactus garden','Wink Works warehouse'],
    farm: ['orchard farmhouse','horse paddock','dairy barn','greenhouse annex','hay-loft bedroom','farm-to-table restaurant','strawberry fields','windmill','vegetable market','chicken coop','bee farm','country pond','livestock shelter','apple cider barn','farm equipment shed','vineyard','rustic guest cottages','pumpkin patch','farmers market','sunflower trail','grain silo','riding arena','herb drying room','water mill','mansion conservatory'],
    golf: ['championship clubhouse','first tee','water-hazard green','putting practice area','driving range','sand bunker','golf-cart garage','tournament scoreboard','pro shop','nineteenth-hole restaurant','golf academy','lakeside fairway','scenic footbridge','practice chipping green','maintenance shed','locker room','terraced putting green','mini-golf loop','spectator gallery','club swimming pool','pine-lined course','halfway snack hut','winner podium','course entrance arch','sunset viewing deck'],
    fashion: ['designer flagship store','runway stage','luxury showroom','jewellery boutique','fashion museum','VIP fitting suite','perfume counter','model agency','private rooftop event','couture workshop','handbag display','beauty salon','editorial photo studio','fashion school','marble shopping arcade','designer cafe','exclusive hotel lobby','grand staircase','fashion week plaza','luxury apartment','shoe boutique','art installation','penthouse closet','black-and-gold terrace','window-display gallery'],
    romance: ['heart-shaped cottage','rose-covered pergola','bridal garden','love-letter library','valentine cafe','heart fountain','riverside gazebo','flower conservatory','secret picnic area','wishing well','couples treehouse','cozy fireplace room','heart archway','storybook bridge','tea room','enchanted bedroom','orchard swing','romantic lookout','garden wedding venue','rose maze','floral greenhouse','heart mosaic courtyard','bakery for two','moonlit dock','little proposal terrace'],
    storybook: ['storybook village gate','tiny mushroom houses','enchanted post office','talking-tree square','fairy bookstore','moonlit bakery','whimsical schoolhouse','hidden wishing well','rainbow bridge','storybook windmill','giant teapot cafe','teddy-bear picnic','magical train stop','clockwork cottage','mystery door','gingerbread storefront','flower-covered inn','storybook theatre','enchanted orchard','lantern-lit pond','miniature castle','secret attic','woodland library','cloud observation hut','friendly dragon shelter'],
    music: ['outdoor concert stage','recording studio','jazz club','drum rehearsal loft','music festival grounds','vinyl record shop','karaoke lounge','dance hall','orchestra theatre','rock band garage','radio station','piano courtyard','music school','festival camp','DJ booth','amphitheatre','backstage corridor','battle-of-the-bands venue','acoustic cafe','giant jukebox','band merchandise shop','neon nightclub','songwriter cottage','parade route','music-video rooftop'],
    mobs: ['creeper containment lab','enderman sanctuary','bee research farm','villager trading square','skeleton archery range','zombie movie set','slime trampoline park','spider cave','allay music garden','iron golem workshop','wolf adoption shelter','cat cafe','axolotl aquarium','frog pond','blaze fortress','guardian temple','sniffer nursery','panda bamboo forest','fox den','mushroom cow meadow','phantom observatory','strider lava dock','warden warning zone','witch apothecary','snow golem ice hotel'],
    modern: ['glass high-rise','minimalist townhouse','tram station','modern art museum','skybridge','contemporary school','office campus','high-end grocery store','smart apartment','metro hub','waterfront promenade','sports arena','concrete skatepark','gallery cafe','geometric park','roof-deck lounge','modern library','public aquarium','tech start-up office','designer hotel','city courthouse','transport terminal','luxury pool','night skyline plaza','multi-level mall'],
    chaos: ['tilting skyscraper','upside-down house','split-level maze','gravity-defying bridge','overgrown laboratory','broken subway entrance','colour-clash shopping mall','neon roller coaster','maze apartment block','giant domino disaster','floating traffic junction','glitched arcade','twisted clock tower','experimental sculpture park','secret escape shaft','collapsed parking deck','redstone chaos factory','mirror maze','modular skyscraper','surreal rooftop','contrasting city blocks','abandoned robot lab','mismatched mansion','crazy water slide','citywide scavenger puzzle'],
    future: ['spaceport terminal','hologram plaza','robot factory','futuristic apartment pod','maglev station','glass bio-dome','underground data vault','skyway intersection','orbital observatory','neon market','AI research tower','solar greenhouse','airship dock','cyberpunk alley','energy core','subterranean metro','zero-gravity arena','automated warehouse','techno museum','quantum lab','digital art gallery','levitating island','starship hangar','future city hall','drone landing pad'],
    pink: ['pink palace','rose quartz tower','cotton-candy plaza','bubblegum cafe','blossom greenhouse','pink boardwalk','heart-shaped lake','ribbon shopping mall','pastel carousel','pink lighthouse','dreamy flower market','magenta castle','glittery dance hall','strawberry ice-cream stand','pink horse arena','rose-gold bridge','pastel aquarium','pink theatre','luxury spa','dollhouse hotel','pink sunset garden','sweet-shop village','enchanted pink forest','fountain of roses','pink holiday resort'],
    island: ['coral beach','seaside lighthouse','palm-tree promenade','island villa','snorkelling lagoon','tropical harbour','beach market','hidden sea cave','sunset pier','floating restaurant','coconut grove','waterfall pool','island aquarium','beach bonfire area','yacht marina','tropical greenhouse','sandcastle display','overwater bungalows','surf school','cliffside lookout','island village','turtle rescue cove','pink reef','tidal garden','seaplane dock'],
    resort: ['luxury reception lobby','infinity pool','cabana terrace','spa and sauna','water-slide tower','beachfront villa','sunset restaurant','rooftop bar','tennis pavilion','seaside golf green','garden wedding venue','boat rental dock','tropical greenhouse','family activity centre','wave pool','hotel tower','poolside cafe','resort shopping lane','honeymoon suite','outdoor theatre','lagoon trail','kids splash pad','private island pier','wellness retreat','arrival fountain'],
    mountain: ['cliffside mansion','ski lift','mountain observatory','alpine chalet','cable-car station','rock garden','snowy lookout','stone bridge','hidden cave pool','waterfall lodge','mountain horse trail','terraced greenhouse','cliff elevator','hillside market','mountain train tunnel','summit restaurant','forest cabin','panoramic balcony','ridge-top chapel','mountain spa','avalanche shelter','rope bridge','mountain village','stone watchtower','ice cave'],
    lights: ['glowing boulevard','lantern plaza','hidden light gallery','illuminated bridge','neon sign workshop','coloured glass dome','underwater glow garden','night market','observatory with beacons','light-show arena','firefly woodland','glowing fountain','LED-style dancefloor','star ceiling room','lighthouse','moonlit garden','festival string lights','redstone lamp wall','magical cave glow','projection theatre','aurora viewing deck','city skyline lighting','light maze','sunset archway','glowstone chandelier hall'],
    kids: ['giant playground','treehouse village','colourful classroom','trampoline arena','petting zoo','sports park','bike challenge course','storybook library','toy store','giant ball pit','swimming pool','craft studio','roller-skating track','soccer stadium','adventure maze','ice-cream shop','bounce castle','animal rescue','mini-golf park','friendship fort','treasure hunt island','carnival midway','dance party room','summer camp','Minecraft mini-game arena'],
    craftables: ['display warehouse','build testing lot','rabbit-hole tunnel','showcase street','tiny house exhibition','modular mansion row','garden structure gallery','holiday exhibit','Asian build pavilion','animal shelter collection','vehicle garage','sports complex demo','fountain courtyard','mushroom forest exhibit','treehouse canopy','snow structure park','prefab hotel demo','shopping lane','space build hangar','construction yard','dockside model town','materials sorting hall','structure block museum','underground storage','craftable challenge arena'],
    creative: ['giant pixel sculpture','block sampler hall','shape experiment','surreal bridge','floating gallery','mosaic wall','design workshop','redstone idea lab','pattern garden','vertical neighbourhood','experimental staircase','colour test tower','blocky typography','giant everyday object','abstract fountain','miniature model city','hidden mechanism','interactive installation','terrain experiment','contrasting house pair','architectural mockup','moving art machine','weather station','build challenge board','secret test chamber'],
    playful: ['colourful corner store','party garden','giant toy box','miniature skatepark','community hangout','bright apartment','candy kiosk','painted bridge','rooftop cinema','secret clubhouse','arcade lounge','treasure alley','comic book shop','sunny schoolyard','fairground','bike park','picnic grove','friendship fountain','street mural','dance stage','balloon festival','book cafe','hidden garden','craft workshop','surprise maze'],
    penguin: ['penguin nursery','iceberg village','frozen fishing dock','snowball arena','polar aquarium','winter research lab','sledding hill','ice castle','arctic market','glacier bridge','rescue centre','skating rink','snow cave','winter cafe','frozen lighthouse','igloo resort','ice tunnel','aurora observatory','penguin playground','polar zoo','snowy marina','seal sanctuary','frosty greenhouse','glacier museum','ice sculpture court'],
    luxury: ['marble entrance hall','sunken living room','indoor swimming pool','luxury master suite','grand ballroom','designer garage','glass conservatory','home cinema','private library','spiral staircase','formal garden','roof terrace','wine cellar','spa suite','guest wing','art gallery','water-feature courtyard','chef kitchen','indoor horse arena','landscaped driveway','hidden elevator','fitness pavilion','winter garden','private dock','observatory lounge']
  };

  const LABELS = {
    general:'Creative mix',city:'City building',games:'Playable games',garden:'Gardens & nature',barbie:'Pink fashion fantasy',pinkwink:'Retro motel mystery',farm:'Countryside & farming',golf:'Golf & country club',fashion:'Fashion & luxury',romance:'Romantic cottage',storybook:'Storybook magic',music:'Music & festivals',mobs:'Minecraft creatures',modern:'Modern architecture',chaos:'Modern mayhem',future:'Futuristic city',pink:'Pink paradise',island:'Tropical island',resort:'Resort & holidays',mountain:'Mountains & mansions',lights:'Lighting & glow',kids:'Kids & active play',craftables:'Craftable showcases',creative:'Creative experiments',playful:'Playful neighbourhood',penguin:'Penguins & snow',luxury:'Luxury mansion'
  };
  const EXACT_WORLD_THEMES = {
    'billi':'playful','ctrl group - craftablesmain':'craftables','ctrl group - cutekids':'kids','ctrl group - garden district':'garden','ctrl group - lights':'lights','ctrl group - main':'city','ctrl group - mntn side mansion':'mountain','ctrl group - modern mansion':'luxury','ctrl group - things':'creative','farm mansion':'farm','games':'games','golf course':'golf','gucci':'fashion','heart house':'romance','heart house yard':'garden','hello':'storybook','jam':'music','mob city':'mobs','modern city':'modern','modern mayhem':'chaos','modern x':'future','paradise':'pink','pink isle':'island','pink wink - barbie':'barbie','pink wink - main':'pinkwink','resort':'resort'
  };
  const DIRECTIONS = [
    {name:'First steps',action:'Start with a compact version that can be finished in one sitting',detail:'a clear path, one signature feature and a tidy entrance',style:'starter'},
    {name:'Landmark edition',action:'Make this the visible landmark of its neighbourhood',detail:'a memorable silhouette, a focal point and layered landscaping',style:'grand'},
    {name:'Play it',action:'Add an interactive reason to visit',detail:'a simple rule, redstone interaction or a mini-game players can actually use',style:'interactive'},
    {name:'Secret version',action:'Hide an optional discovery for curious visitors',detail:'a disguised entrance, subtle clue and rewarding hidden room',style:'mystery'},
    {name:'Community day',action:'Design it as a lively place people would gather',detail:'seating, activities, signs and believable visitor routes',style:'social'},
    {name:'Inside story',action:'Focus on immersive interiors and small objects',detail:'at least three furnished zones, good lighting and lived-in details',style:'interior'},
    {name:'Landscape first',action:'Let the surroundings shape the entire design',detail:'terrain levels, paths, planting and one scenic viewpoint',style:'nature'},
    {name:'Before & after',action:'Build two versions: neglected and beautifully renewed',detail:'visible transformation, retained old clues and a final reveal',style:'renovation'},
    {name:'After dark',action:'Make its nighttime appearance unforgettable',detail:'layered glow, safe paths, contrast and a striking night photograph',style:'night'},
    {name:'Story chapter',action:'Give it a tiny story with a beginning and a discovery',detail:'a named character, a physical clue and a buildable ending',style:'story'}
  ];

  const THEME_BLOCKS = {
    games:['White Concrete','Blue Concrete','Red Concrete','Yellow Concrete','Black Concrete','Smooth Quartz'],
    garden:['Moss Block','Oak Planks','Mud Bricks','Flowering Azalea Leaves','Stone Bricks','Calcite'],
    barbie:['Pink Concrete','White Concrete','Cherry Planks','Smooth Quartz','Magenta Terracotta','Pink Glazed Terracotta'],
    pinkwink:['Pink Terracotta','Smooth Sandstone','White Concrete','Stripped Oak Wood','Gray Concrete','Pink Concrete'],
    city:['Stone Bricks','Gray Concrete','Smooth Stone','White Concrete','Polished Andesite','Black Concrete'],
    golf:['Grass Block','Smooth Quartz','Spruce Planks','Green Concrete','Stone Bricks','White Concrete'],
    fashion:['Smooth Quartz','Black Concrete','White Concrete','Gold Block','Polished Diorite','Gray Concrete'],
    island:['Sandstone','Pink Concrete','Oak Planks','Smooth Quartz','Prismarine Bricks','White Concrete'],
    pink:['Pink Concrete','Cherry Planks','White Concrete','Pink Terracotta','Smooth Quartz','Magenta Concrete'],
    mobs:['Moss Block','Cobbled Deepslate','Stone Bricks','Oak Planks','Green Concrete','Tuff'],
    future:['White Concrete','Cyan Concrete','Gray Concrete','Sea Lantern','Black Concrete','Smooth Quartz'],
    penguin:['Snow Block','Blue Ice','Packed Ice','White Concrete','Light Blue Concrete','Smooth Quartz']
  };
  const DEFAULT_BLOCKS=['Smooth Quartz','Stone Bricks','Oak Planks','White Concrete','Polished Andesite','Moss Block'];

  function normalized(value) { return String(value || '').trim().toLowerCase().replace(/\s+/g, ' '); }
  function matchStoredTheme(raw) {
    const t=normalized(raw);
    if (Object.hasOwn(LABELS,t)) return t;
    if (!t) return '';
    return Object.keys(LABELS).find(k=>t===normalized(LABELS[k])) || '';
  }
  function resolve(worldName, worldData, override) {
    const name=String(worldName||'').trim(), n=normalized(name), manual=matchStoredTheme(override);
    if(manual) return {theme:manual,label:LABELS[manual],name:name||'any Minecraft world',automatic:false};
    const assigned=matchStoredTheme(worldData?.generatorTheme) || matchStoredTheme(worldData?.theme);
    const theme=assigned || EXACT_WORLD_THEMES[n] || (/(?:penguin|iceberg|glacier)/.test(n)?'penguin':/(?:game|arcade|chess)/.test(n)?'games':/(?:garden|flower|orchard)/.test(n)?'garden':/(?:barbie|doll)/.test(n)?'barbie':/(?:pink wink|motel)/.test(n)?'pinkwink':/(?:city|metro)/.test(n)?'city':/(?:farm|country)/.test(n)?'farm':/(?:isle|island)/.test(n)?'island':/(?:resort|hotel)/.test(n)?'resort':/(?:modern|urban)/.test(n)?'modern':'general');
    return {theme,label:LABELS[theme],name:name||'any Minecraft world',automatic:true};
  }

  function resultFor(category, context, subject, direction, index) {
    const w=context.name, t=context.label, label=direction.name, detail=direction.detail, verb=direction.action;
    const lead=`${w} • ${t}. ${verb}. Include ${detail}.`;
    let title='', description='';
    switch (category) {
      case 'Build Idea': title=`${subject} — ${label}`; description=`BUILD IDEA — ${lead}\nPlan the footprint, exterior, interior, and one memorable Minecraft block detail. Finish with a walkable entrance and a screenshot-worthy angle.`;break;
      case 'Palette': {const blocks=THEME_BLOCKS[context.theme]||DEFAULT_BLOCKS;const ordered=blocks.map((_,j)=>blocks[(j+index%6)%6]);title=`Six-block palette: ${subject} — ${label}`;description=`PALETTE — Use six full Minecraft blocks for ${subject} in ${w}: ${ordered.join(' • ')}.\nUse the first two for the main structure, the next two for contrast, and the final two for accents. ${verb}. No loose items or dyes.`;break;}
      case 'Material Combination': {const b=THEME_BLOCKS[context.theme]||DEFAULT_BLOCKS;title=`Material pairing: ${subject} — ${label}`;description=`MATERIAL COMBINATION — Pair ${b[index%6]} with ${b[(index+2)%6]}, then ground the design with ${b[(index+4)%6]}. Test it on ${subject} in ${w}. ${verb}; add ${detail}.`;break;}
      case 'World Idea': title=`A world built around ${subject} — ${label}`;description=`WORLD IDEA — Imagine a new ${t.toLowerCase()} Minecraft world with ${subject} as the first landmark. Define the spawn view, main route, three nearby areas and the secret players uncover. ${verb}.`;break;
      case 'World Expansion': title=`Expand toward ${subject} — ${label}`;description=`WORLD EXPANSION — Add a district or landscape around ${subject} in ${w}. Connect it to an existing road or path, create two smaller neighbouring builds, and provide a reason to explore. ${verb}.`;break;
      case 'Daily Build': title=`Today: ${subject} — ${label}`;description=`TODAY'S BUILD — In ${w}, mark a small footprint for ${subject}; finish the main silhouette, then ${detail}. Take one progress snapshot before leaving.`;break;
      case 'Weekly Plan': title=`This week at ${subject} — ${label}`;description=`5-DAY PLAN for ${w}\nDay 1: Map the footprint.\nDay 2: Build the exterior.\nDay 3: Add paths and surroundings.\nDay 4: ${verb}.\nDay 5: Finish ${detail} and photograph ${subject}.`;break;
      case 'Monthly Plan': title=`Four weeks of ${subject} — ${label}`;description=`MONTHLY PLAN for ${w}\nWeek 1: Survey and design ${subject}.\nWeek 2: Complete structure and main routes.\nWeek 3: ${verb}.\nWeek 4: Add ${detail}, test access and document the finished area.`;break;
      case 'Six-Month Plan': title=`Six-month district: ${subject} — ${label}`;description=`SIX-MONTH ROADMAP for ${w}\n1. Site and sketch. 2. Terrain and transport. 3. Signature ${subject} build. 4. Three supporting structures. 5. ${verb}. 6. ${detail}; finish with a tour and project archive.`;break;
      case 'Lore': title=`Legend of ${subject} — ${label}`;description=`LORE — Write why ${subject} matters in ${w}. A character once made a choice here; leave one visible clue and one hidden detail that visitors can discover. ${verb}.`;break;
      case 'Lore Continuation': title=`The next chapter at ${subject} — ${label}`;description=`LORE CONTINUATION — Something changed at ${subject} after the last chapter in ${w}. Show the change with blocks, reveal who noticed first, and plant a new clue near ${detail}.`;break;
      case 'Mystery': title=`Mystery of ${subject} — ${label}`;description=`MYSTERY — Place three clues around ${subject} in ${w}, including one visual clue and one hidden passage. The final discovery must explain why ${detail} was important. Keep it solvable without commands.`;break;
      case 'Name': title=`Name the ${subject} — ${label}`;description=`NAMING IDEA — Give ${subject} a memorable ${t.toLowerCase()} identity. Try a place name, a nickname locals use, and a short sign or slogan. Let the name hint at ${direction.style} without renaming ${w}.`;break;
      case 'TikTok Idea': title=`Video reveal: ${subject} — ${label}`;description=`TIKTOK IDEA — Hook: “Would you visit my ${subject}?”\nShot 1: Empty space in ${w}. Shot 2: The most satisfying build step. Shot 3: ${detail}. Shot 4: Final reveal. Caption with a question inviting the next build suggestion.`;break;
      case 'TikTok Script': title=`20-second tour: ${subject} — ${label}`;description=`TIKTOK SCRIPT — 0–3s: “Watch me turn this spot into ${subject}.”\n3–8s: Show the frame and main block choices.\n8–14s: ${verb}.\n14–20s: Reveal ${detail}; finish with a close-up and “What should I add next?”`;break;
      case 'Challenge': title=`Challenge: ${subject} — ${label}`;description=`PLAYABLE CHALLENGE — Build or complete ${subject} in ${w}. Rule: limit yourself to three main materials. Goal: ${detail}. For a harder round, add a time limit or a friend judging the finish.`;break;
      case 'Craftable Challenge': title=`Craftable challenge: ${subject} — ${label}`;description=`CRAFTABLE CHALLENGE — Pick one craftable you already own and place it in a ${subject} scene in ${w}. Modify or surround it to match the ${t.toLowerCase()} theme. ${verb}. Record the craftable name and whether it worked.`;break;
      case 'City Block Generators': title=`City block: ${subject} — ${label}`;description=`CITY BLOCK BRIEF — Design a single block around ${subject} with a street-facing entrance, two smaller frontage details and a clear pedestrian path. ${verb}. In CTRL Group Main, attach it to the appropriate city grid location; elsewhere treat it as a themed district idea.`;break;
      case 'Build Concept': title=`Concept sketch: ${subject} — ${label}`;description=`BUILD CONCEPT — Describe the size, silhouette, floor levels, access points and visual style of ${subject} in ${w}. The defining detail: ${detail}.`;break;
      case 'Journal Entry': title=`Journal: a day at ${subject} — ${label}`;description=`JOURNAL PROMPT — What did you try at ${subject} in ${w}? Record one win, one surprise and one thing to improve. Describe how ${detail} changed the build.`;break;
      case 'Goal': title=`Milestone: ${subject} — ${label}`;description=`GOAL — Make tangible progress on ${subject} in ${w}: set a footprint, complete the main structure and add ${detail}. Mark the goal complete only after one screenshot and a short progress note.`;break;
      case 'Event': title=`Host an event at ${subject} — ${label}`;description=`EVENT — Host a ${t.toLowerCase()} gathering at ${subject}. Prepare decorations, a simple activity, an arrival path and a surprise related to ${detail}. Take a group photo or stage a solo tour.`;break;
      case 'Room / Display': title=`Display scene: ${subject} — ${label}`;description=`ROOM OR DISPLAY — Create a walkable 7×7 or similarly compact vignette of ${subject} in ${w}. Establish foreground, backdrop and three miniature details. ${verb}.`;break;
      case 'Concept Description': title=`Describe ${subject} — ${label}`;description=`CONCEPT DESCRIPTION — Write four vivid sentences: the approach to ${subject}, the colours and materials, who uses it, and the feature visitors remember. Keep ${w}'s ${t.toLowerCase()} identity visible; include ${detail}.`;break;
      case 'Location Idea': title=`Find a site for ${subject} — ${label}`;description=`LOCATION — Select an area in ${w} where ${subject} would feel natural. Note X/Y/Z when chosen, mark access routes and sightlines, then place a visible landmark and ${detail}.`;break;
      case 'Add-On Showcase': title=`Add-on showcase: ${subject} — ${label}`;description=`ADD-ON SHOWCASE — Choose an add-on from your own collection that supports ${subject}. Demonstrate one real feature in ${w}, with a before/after view, ${detail}, and a note recording whether it loaded correctly.`;break;
      case 'Random Fun': title=`Surprise project: ${subject} — ${label}`;description=`RANDOM FUN — Turn ${subject} into a quick ${t.toLowerCase()} surprise in ${w}. Flip a coin to choose miniature or giant scale; then ${verb.toLowerCase()} and finish with ${detail}.`;break;
      default:title=`${subject} — ${label}`;description=lead;
    }
    // Preserve actual blocks in the result so Save as Palette never takes a
    // different palette from the six-block shuffle tool.
    const blocks=category==='Palette'?(()=>{const source=THEME_BLOCKS[context.theme]||DEFAULT_BLOCKS;return source.map((_,j)=>source[(j+index%6)%6]);})():null;
    return {key:`preset-${context.theme}-${category.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${index}`,title,description,theme:context.theme,blocks,sourceType:'250 world-themed results',builtin:true};
  }

  function pool(category, context) {
    const seed=TOPICS[context.theme]||TOPICS.general;
    if(seed.length!==25) throw new Error(`Theme ${context.theme} must have exactly 25 topics; found ${seed.length}`);
    const out=[];
    for(let i=0;i<250;i++)out.push(resultFor(category,context,seed[i%25],DIRECTIONS[Math.floor(i/25)],i));
    return out;
  }
  root.CTRL_THEMES={resolve,pool,options:Object.entries(LABELS).map(([value,label])=>({value,label})),topicCount:25,directionCount:10};
})(window);


/* CTRL n crft: load read-only Minecraft handbook / UI enhancement */
(function(){
  if(window.__ctrlMinecraftEnhancementRequested)return;
  window.__ctrlMinecraftEnhancementRequested=true;
  const tips=document.createElement('script');
  tips.src='./minecraft-tips-data.js?v=20261024-1';
  tips.onload=function(){
    const ui=document.createElement('script');
    ui.src='./minecraft-experience.js?v=20261024-1';
    ui.onerror=function(){console.warn('CTRL tips UI did not load; other HQ features are unaffected');};
    document.head.appendChild(ui);
  };
  tips.onerror=function(){console.warn('CTRL tips library did not load; other HQ features are unaffected');};
  document.head.appendChild(tips);
})();
