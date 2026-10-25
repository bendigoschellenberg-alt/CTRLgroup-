/* CTRL n crft – 260 Bedrock building hints. Static reference data only; no database writes.
   Entries 211–260 preserve the tips supplied by the owner. Entries 1–210 are
   curated from the earlier topic headings, rather than claiming verbatim recovery. */
(function(root){
'use strict';
const sections = [
['Essential commands',`
Fill large areas|Use /fill to place a rectangular section of the same block; check both corners before running it.
Hollow walls quickly|Use the hollow option of /fill for big empty rooms and structures.
Replace one material|Use the replace mode of /fill to swap matching blocks in a bounded area without rebuilding.
Clear a workspace|Use /fill with air to remove a defined area; test the bounds in a copy first.
Clone repeated rooms|Use /clone to reproduce floors, units, walls and other repeating designs.
Choose clone modes|Know the difference between normal, masked and filtered clone options on Bedrock.
Teleport to landmarks|Use /tp with saved coordinates instead of travelling across enormous worlds.
Switch weather temporarily|Use /weather clear when you need clean screenshots or uninterrupted building.
Set a useful time|Use /time set day to inspect difficult building details and light placement.
Protect important work|Make a backup before running wide-range commands or experimenting with add-ons.
`],
['Structure block shortcuts',`
Save a complete room|Capture a room as a structure so furniture and details can be reused.
Use clear structure names|Include the world, building and version in each structure save name.
Save modular pieces|Store walls, corners, stairs, windows and roof parts as separate modules.
Mark boundaries visually|Outline the intended structure bounding box before saving.
Check the preview box|Verify the capture area does not cut off walls, roofs or foundations.
Save an empty shell|Keep a furnishing-free version of important buildings for later themes.
Capture a furnished version|Save the complete decorated room separately from the shell.
Rotate when loading|Use the structure block rotation option to orient modular designs.
Mirror for matching wings|Flip a saved section to create an opposite side of a symmetrical build.
Use consistent origins|Select the same anchor corner for every module to make alignment predictable.
Test placement above ground|Load a structure in an empty test area before placing it inside a finished city.
Label structure versions|Keep v1, v2 and final variants when iterating on a large design.
Split enormous captures|Store oversized builds in smaller chunks that are easier to place and repair.
Keep a structure index|Record name, size, purpose and original coordinates for saved structures.
Recheck replaced blocks|After a structure load, inspect doorways, liquids, stairs and block orientation.
`],
['City-building shortcuts',`
Reserve roads first|Lay out your full roads and sidewalks before placing buildings.
Keep one road standard|Use your 32-block road allocation throughout CTRL Group to avoid mismatched intersections.
Build one intersection template|Perfect a crossing once, then clone or place it where needed.
Make a district palette|Set a small selection of materials and colours for each neighbourhood.
Mark block corners|Use easy-to-see temporary blocks at lot boundaries.
Choose a building line|Keep storefronts a consistent distance from the street edge.
Plan public services|Reserve spaces for parks, transit, hospitals and civic buildings early.
Repeat streetlights|Save a standard lamp design as a module and space it evenly.
Create sidewalk modules|Reuse short pavement, curb and planter sections.
Build medians in segments|Make a median unit with trees or lights and repeat it.
Use street naming rules|Name streets and avenues consistently so coordinate notes are searchable.
Reserve underground clearance|Leave room for tunnels, utilities and stations beneath major roads.
Separate districts with landmarks|Give each city area a distinct plaza, park or building silhouette.
Use elevation sparingly|Plan ramps and bridges before adding height changes to road networks.
Make a city template world|Keep a safe copy of your road grid and core modules for future expansion.
`],
['Better-looking builds',`
Layer wall depth|Mix inset panels and raised trims so big walls do not look flat.
Limit your main materials|Pick a focused palette and use accent blocks for contrast.
Break up long roofs|Add dormers, eaves, chimneys or setbacks to avoid one flat shape.
Frame doorways|Use pillars, stairs or trapdoors to give entrances more definition.
Use intentional windows|Place windows according to the interior instead of random spacing.
Light in layers|Combine ambient light, work light and decorative light.
Hide structural scaffolding|Remove temporary guide blocks only after checking all completed levels.
Vary repeating facades|Keep dimensions consistent while altering signs, doors or balcony details.
Add landscaping last|Finish main entrances and paths before detailed planting.
Check the silhouette|Walk far away and see whether the shape reads clearly at a distance.
`],
['Underwater construction',`
Set a shared water level|Choose a reference Y-level such as 63 for your planned underwater city.
Plan dry chambers first|Design how to remove water before closing complicated rooms.
Build from anchors|Place visible reference pillars at the centre and outer edges of domes.
Use glass selectively|Mix transparent panels with solid ribs for easier-to-read underwater shapes.
Make air pockets safely|Use appropriate water-removal methods in enclosed sections.
Light key pathways|Mark major roads and entrances with visible lighting.
Space domes generously|Leave open water between buildings so the overall city remains readable.
Make pressure-proof-looking supports|Connect domes with arches, pylons and rings for convincing architecture.
Build on planned terraces|Use multiple platforms at known Y-levels rather than random heights.
Keep access obvious|Connect major domes with tunnels, bridges, elevators or swim routes.
`],
['Xbox and add-on organization',`
Record every add-on precisely|Keep exact creator names, size in MB and version details in your collection.
Test add-ons in a spare world|Check compatibility before moving a new combination into a valuable build.
Add one change at a time|When troubleshooting a crash, introduce add-ons individually.
Record a working combination|Save the list of active add-ons and the result of the test.
Watch total download size|Track both individual add-on sizes and combined size in your testing notes.
Separate asset categories|Keep Add-ons, Craftables, World Templates and Textures distinct in your library.
Keep older configurations|Do not overwrite a previously working loadout when testing replacements.
Label crash evidence|Record which add-ons were loaded and what occurred before the failure.
Export worlds regularly|Keep recoverable world copies before major marketplace or settings changes.
Use Xbox-friendly workflows|Favor short repeatable commands, clear menus and structure modules over long typing sessions.
`],
['Advanced blocks and commands',`
Use invisible light|Light blocks can illuminate finished interiors without a visible fixture.
Understand barriers|Use barrier blocks for temporary invisible containment or guide areas.
Try structure void|Use structure void where supported to protect areas from unwanted placement.
Use ticking areas carefully|Only keep essential automated systems loaded where your version supports the command.
Control block updates|Test complicated redstone and command sequences in an isolated location.
Name locations with signs|Create in-world labels for test stations and saved modules.
Use repeating command blocks cautiously|Check redstone requirement and delay to prevent laggy loops.
Use conditional chains|Run a follow-up command only after its predecessor succeeds.
Keep a command notebook|Save tested Bedrock syntax and coordinate patterns in your HQ.
Prefer reversibility|Choose methods you can undo, clone back or restore from backup.
`],
['Coordinates and building maths',`
Write X Y Z in one format|Keep coordinates consistently ordered to prevent misplaced builds.
Mark the exact centre|Use a unique block at the centre of a symmetrical project.
Measure inclusive widths|From X=0 through X=24 is 25 block positions, not 24.
Use relative coordinates|Design reusable modules as offsets from a chosen origin.
Calculate opposite corners|Record minimum and maximum X, Y and Z before using /fill.
Plan floor spacing|Write Y-levels for floors, ceilings and service gaps before building.
Record facing direction|Note north, south, east or west along with module positions.
Use a coordinate legend|Track reference origin, water height, road centre and structure anchors.
Sketch on a grid|Mark every planned section in blocks instead of estimating by sight.
Double-check negatives|Moving from X=-100 to X=-110 changes X by -10, not +10.
`],
['More structure block tricks',`
Capture a quarter build|Save one symmetrical quadrant and reuse it around a centre.
Load at fixed Y-levels|Place modules at a recorded floor height to avoid stepped mismatches.
Store roof variants|Use one shell with several roof modules for design experiments.
Keep door directions in mind|Check rotation-sensitive doors, stairs and decorative blocks after placement.
Use test structures for craftables|Preview marketplace craftables in a blank world before integrating them.
Save paths in pieces|Capture short curves and junctions instead of one enormous road.
Clone interiors by layer|Make standard floor layouts separately from special ground floors.
Add labels outside capture boxes|Keep signposts or temporary guides out of final structure saves.
Build with placeholders|Use easy-to-replace marker blocks for windows and decorative slots.
Keep your originals intact|Save a version before rotating, mirroring or redesigning a complex module.
`],
['Landscaping and decoration',`
Plant in clusters|Repeat a few types of trees and plants in uneven, natural-looking groups.
Blend terrain transitions|Layer grass, stone and soil along slopes instead of sharp rectangular edges.
Plan a path network|Join entrances and activity areas before placing plants.
Add focal points|Use a bench, fountain, statue or specimen tree to anchor each garden section.
Leave breathing space|Reserve open areas so small decorations do not overwhelm the larger composition.
`],
['Add-on compatibility and performance',`
Track test results|Mark every combination as Works, Issues, Crashes or Untested.
Keep test notes searchable|Record symptoms, changes and exact add-on sizes with each trial.
Watch for duplicate functions|Be cautious when two add-ons modify the same systems or interface.
Test after an update|An add-on version change can alter a formerly working combination.
Separate content from diagnosis|Do not delete valuable world content while troubleshooting a compatibility problem.
`],
['Command-block automation',`
Label command systems|Place a readable label by every group of command blocks.
Test with impulse first|Use a one-shot command block before making a command repeat.
Choose activation deliberately|Select Always Active or Needs Redstone to match the intended trigger.
Use clear chains|Lay chain command blocks in a consistent direction.
Add delays where needed|Reduce accidental rapid-fire actions with command timing.
Use conditional execution|Let a chain continue only when the previous command succeeded.
Control with a lever|Provide a clear manual on/off switch for automated builds.
Limit affected areas|Target a bounded coordinate range to avoid unintended global effects.
Avoid constant chat spam|Use suitable command feedback settings during repetitive testing.
Make a reset state|Create a command that restores initial conditions for a game or minigame.
Test multiplayer effects|Check commands with more than one player if the build will be shared.
Record working syntax|Save exact Bedrock command examples outside the command blocks.
Use tags intentionally|Give target entities explicit tags before applying repeated effects.
Add visual status lights|Show whether a control circuit is enabled or paused.
Isolate experimental circuits|Prototype automation far from valuable storage and structures.
`],
['Advanced construction systems',`
Build a reusable wall kit|Prepare straight, corner and window modules at matching heights.
Repeat floor plates|Place one tested floor layout at each planned Y-level.
Separate shell and decor|Finish the main structure before adding room-specific furnishings.
Use alignment beacons|Mark future connection points with temporary contrasting blocks.
Make stair modules|Save reusable straight, corner and landing combinations.
Prepare arch templates|Reuse correctly spaced arches in viaducts, bridges and hallways.
Use layered blueprints|Plan foundation, ground floor, upper levels and roof separately.
Design service cores|Place staircases and utility shafts before repeating tower floors.
Test long-span proportions|Mock up a short bridge segment before completing the full span.
Make mirrored wings|Build one wing, then mirror the plan around a central corridor.
Use repeat distances|Write the number of blocks between repeating pillars or windows.
Plan material replacements|Use temporary blocks that are easily replaced in bulk.
Use terrain-relative foundations|Account for changes in ground height before placing copied structures.
Build a sample facade|Try different material and window spacing before committing to a tower.
Save module coordinates|Record origin and width for consistent placement across builds.
`],
['Scoreboards and world controls',`
Use scoreboards for counters|Track points or rounds in command-based minigames where supported.
Name objectives clearly|Use readable objective names so game control commands are easier to maintain.
Reset match scores|Include a reset step between rounds.
Separate game and world controls|Keep build automation separate from gameplay counters.
Test gamerules carefully|Change one gamerule at a time and record the original value.
Turn off unwanted feedback|Adjust command output settings for a quieter testing session.
Set a world spawn deliberately|Choose a safe accessible spawn location for visitors.
Use tags for teams|Mark participants so commands affect the intended group.
Create a game start switch|Start timers, counters and effects from one visible control.
Keep a rules sign|Explain how to play and reset each interactive activity.
`],
['Hidden decorative features',`
Conceal lighting behind panels|Use safe hidden lighting locations that still illuminate the room.
Mix trapdoors and slabs|Create thinner-looking furnishings and textured surfaces.
Decorate with banners|Use banners and patterns as curtains, signs or wall art.
Use maps as displays|Try map art for signs or gallery-style walls.
Hide redstone behind the facade|Leave service access so repairs are still possible.
Create custom-looking shelves|Combine slabs, trapdoors and containers for layered storage.
Add small floor patterns|Use carpets and contrasting blocks to define room zones.
Make textured columns|Alternate full blocks, walls and stairs for deeper pillars.
Frame large windows|Use solid ribs and trims to support tall glass panels visually.
Use concealed access doors|Add an obvious maintenance route even when the decorative entry is hidden.
`],
['Water and transportation',`
Mark boat routes|Define entrances and turn zones before building a canal.
Check water currents|Test whether flows move entities the intended direction.
Build underwater checkpoints|Use lighted landmarks at predictable distances.
Use bubble columns deliberately|Check the correct block and source-water setup for upward or downward motion.
Plan station platforms|Leave enough clearance for vehicles and passenger circulation.
Add bridge headroom|Test the tallest planned boat or decorative vessel under each crossing.
Keep canal widths consistent|Use fixed measurements along long urban water routes.
Make a transport map|Record destination coordinates and route names in the app.
Connect waterways to plazas|Create a clear transition from dock to pedestrian network.
Make dry tunnel connections|Link underwater buildings by sealed routes where useful.
Use wayfinding colours|Give routes distinct markers without over-decorating.
Place docks before buildings|Ensure room for boarding, turning and access paths.
Allow for terrain variation|Expect seabed and shoreline height changes when planning routes.
Test every route end-to-end|Travel along the full route before decorating it completely.
Keep scenic routes open|Preserve views and space around important underwater structures.
`],
['Redstone shortcuts',`
Build circuits on a test pad|Use a clearly labelled flat area to prototype mechanisms.
Learn signal direction|Check which way components face and which blocks they power.
Use levers for manual testing|Replace complicated automatic triggers with a switch while debugging.
Label inputs and outputs|Track what activates a circuit and what the circuit changes.
Check repeater delay|Adjust delay steps instead of assuming instant timing.
Keep circuits compact|Shorter labelled paths are easier to troubleshoot.
Use observers selectively|Test whether block updates trigger unwanted repeated pulses.
Plan hidden maintenance access|Leave a way to reach redstone behind floors and walls.
Create a master power switch|Provide a simple shutdown for multi-part attractions.
Duplicate proven mechanisms|Clone a known-working door or lighting circuit.
Colour-code circuits|Use different wool or concrete under different control lines.
Test after decoration|Nearby blocks may interfere with moving mechanisms or signal flow.
Avoid unnecessary always-on clocks|Use triggers only when needed to reduce activity and lag.
Use indicator lamps|Show power status while testing buried components.
Document the working build|Take a snapshot of the circuit and its component order.
`],
['Storage, navigation and workflow',`
Sort storage by purpose|Group materials, tools, decoration and rare items in distinct areas.
Label every chest row|Use large readable signs rather than remembering box positions.
Keep a project shulker set|Prepare material kits for individual building sessions.
Record location coordinates|Link major storage rooms and workstations to world map notes.
Keep emergency duplicates|Store copies of essential tools outside hazardous construction zones.
Create a materials checklist|Calculate key materials before starting a giant repeat build.
Separate prototypes and finals|Use a marked test area so experiments never mix with finished builds.
Keep a current-work board|List the few builds you intend to finish next.
Mark completed segments|Colour-code modules or map cells as you build them.
Use quick travel anchors|Save main hub, test grounds and remote project coordinates.
Reserve overflow storage|Do not wait until the storage room is completely full to expand it.
Make project photo references|Photograph progress from consistent angles after major milestones.
Record what worked|Link notes to successful add-ons, structures and techniques.
Log what crashed|Keep compatibility failures so you do not repeat the same combination.
Store reusable palettes|Save six-block material combinations for future variants.
Choose one origin per project|Record where all relative measurements begin.
Back up before big changes|Export or duplicate your world ahead of mass cloning or add-on updates.
Keep the next task visible|Make one actionable build task easy to return to after a break.
Group related app pages|Use links between worlds, builds, materials and photos instead of duplicate records.
End with a quick review|Save coordinates, working status and the next step before leaving a session.
`],
['Circles, symmetry, and precise geometry',`
Choose a centre coordinate|Record the X/Y/Z centre of every major circular or symmetrical structure.
Mark your axes|Create temporary X- and Z-axis lines through the centre.
Use odd-numbered circle widths|A 25-block-wide circle has a single centre block.
Calculate circle widths|A circle extending 12 blocks from its centre in each horizontal direction occupies 25 block positions across.
Use circle equations|x² + z² = r² describes a circle of radius r centred at the origin.
Use four-way symmetry|Build one quadrant, then repeat it around the centre.
Use eight-way symmetry|For highly symmetrical circles, design one-eighth and reflect it into the other seven sections.
Calculate rotations around the centre|Record positions as offsets from the centre before rotating them.
Rotate coordinates 90°|Transform an offset (x,z) into (-z,x).
Rotate coordinates 180°|Transform (x,z) into (-x,-z).
Rotate coordinates 270°|Transform (x,z) into (z,-x).
Mirror across an axis|Reverse the relevant coordinate offset while leaving the other unchanged.
Translate a design|Move every point by the same X, Y, and Z offsets to reproduce the shape elsewhere.
Construct octagons|Use eight edges to create convincing large circular foundations with fewer individual adjustments.
Construct 16-sided shapes|More sides create a smoother appearance for larger rings.
Create thick circular walls|Construct two concentric outlines and fill the gap between them.
Make 45° diagonals|Move one block in X for every one block in Z.
Make gentle diagonals|Repeat two blocks horizontally for every one block sideways.
Make medium diagonals|Use repeating 3:2 movement patterns to create other slopes.
Plan curved roads with waypoints|Plot several points along the desired curve before joining them with your line or curve tool.
`],
['Domes, arches, and bridges',`
Construct arches from calculated points|A semicircular arch can follow y = √(r² - x²) above its baseline.
Measure arch clearance first|Choose the required opening width and height before calculating the curve.
Build sagging suspension cables|Use a shallow parabolic curve, with the lowest point near the middle of the span.
Create elliptical foundations|Use (x/a)² + (z/b)² = 1 for an oval with two different radii.
Make elongated domes|Use an elliptical base and decrease the horizontal radii at higher levels.
Smooth curves by changing block-step patterns|Gradually move between longer and shorter horizontal segments.
Use sphere geometry|A spherical layer at vertical offset y has a horizontal radius of √(R²-y²).
Build spherical domes in horizontal rings|Calculate each ring’s radius and place it at the appropriate height.
Make dome caps separately|Finish the top as its own section to avoid awkward block placement around the centre.
Prototype one dome cross-section|Build a single vertical slice to check proportions before constructing the full shell. Example: for a 41-block-wide hemisphere (R=20), approximate ring radii at Y offsets 0, 4, 8, 12, 16, 18, 19, 20 are 20, 20, 18, 16, 12, 9, 6, 0; complete intervening layers and adjust for pixel art.
Build cylinders|Repeat the same circular outline at multiple Y-levels and connect the sides.
Taper towers|Reduce the horizontal footprint at planned height intervals.
Create cones|Gradually reduce ring radii from bottom to top.
Create pyramids|Shrink each square layer by a fixed number of blocks.
Build spiral staircases|Repeat an angular pattern around a central pillar while increasing Y at each step.
`],
['Megabuild planning shortcuts',`
Create spiral ramps|Combine gradual height changes with circular or polygonal movement around a centre.
Place columns at equal angles|Calculate several positions at the same radius around a circular building.
Build radial roads|Extend straight lines outward from a central plaza at planned angles.
Use tangent connections|Join a curved road or circular platform to a straight section with a gradual transition.
Build intersecting circles|Overlap two or more circular foundations to create interesting domes, plazas or architectural shapes.
Plan roads before buildings|Decide the full 32-block road allocation, including sidewalks and medians, before building adjacent lots.
Keep road centrelines consistent|A 32-block width has two middle blocks, making symmetrical lane arrangements convenient.
Use your 25 × 25 garden-lot template|The centre is 12 blocks from either edge, measured from the first block.
Calculate CTRL Group grid spacing|If a lot has width L and the separating road is 32 blocks wide, the next equivalent lot anchor is L+32 blocks away along that axis.
Handle negative coordinates carefully|Adding a positive offset moves a negative coordinate toward zero, while subtracting moves it farther from zero.
Plan curved support columns with start, control, and end points|Use these references with your available line and curve tools.
Build large pixel art row by row|Record the number of blocks in each horizontal section instead of counting the whole image manually.
Design complex rooflines as side profiles first|Once the cross-section looks right, extend or repeat it along the building.
Use consistent reference levels underwater|For your underwater city, plan around Y=63 for the surface and example platforms Y=49, 35 and 21, adjusting for the actual seabed.
Preserve negative space|Do not fill every available area. Open water, courtyards, clear views and wide gaps make enormous structures more impressive.
`]
];
const data = [];
sections.forEach(([section,raw],sectionIndex)=>{
 const rows=raw.trim().split('\n').filter(Boolean);
 rows.forEach(line=>{
  const split=line.indexOf('|'); if(split<1)throw Error('Missing separator in '+line);
  data.push(Object.freeze({number:data.length+1,section,sectionIndex,title:line.slice(0,split),detail:line.slice(split+1)}));
 });
});
if(data.length!==260)throw Error('Expected 260 building tips, got '+data.length);
root.CTRL_TIPS=Object.freeze({sections:Object.freeze(sections.map(([name],i)=>Object.freeze({name,index:i,count:data.filter(x=>x.sectionIndex===i).length,start:data.find(x=>x.sectionIndex===i).number}))),items:Object.freeze(data)});
})(window);