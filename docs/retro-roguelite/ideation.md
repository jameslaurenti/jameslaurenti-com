# Retro roguelite: ideation

Working notes for a one-thumb phone browser game: an old-school core mechanic with a Ball x Pit
style roguelite layer on top. Runs of 10 to 20 minutes, unlocks between runs, one HTML file.

The plan: interview, long list, thumb filter, the 30-second test, a shortlist of 3 to 5, then bare
prototypes of 3.

**Where we are:** the shortlist is done, built from your ballot answers. Three bare prototypes
are up to play: Harpoon (Pang), Flak (Missile Command) and Cluster (Puzzle Bobble). Next, you play
them and we pick one.

## What you told me

- **Chaos on top, strategy underneath.** Pang looks like panic until you learn how to take apart
  each ball and each level. The later power-ups deepened that.
- **Power that bites back.** The dynamite helps in theory and is an uh-oh in practice. In Ball x
  Pit, the ball that rips up the side is the same ball that gets stuck while the rows creep down.
  Puzzle Fighter's attacks hand your opponent a counterattack.
- **Shots that cost something.** Galaga over Life Force: timing a shot beats holding the button.
- **Managing space.** Pang and Asteroids both punish you for letting fragments spread. Tetris is
  about the shape of your stack. Ball x Pit's rows crawl toward you.
- **Chains and comebacks.** Missile Command's blasts catching more blasts. Puzzle Fighter's
  swings, where you think you've won and you haven't.
- **Pressure that never stops rising.** Tetris pushes you further however good you get.
- **Silly surprises.** Paperboy's animations and its street full of things to hit.
- **Unlocks yes, upkeep no.** Characters, power-ups and permanent progress hook you. Running a
  town or a cult between runs doesn't.
- **Not for you:** Atari 2600-era home games, radial play (Tempest), sameness (Pac-Man), arena
  brawlers against AI.

## Where I'd push back

1. **The genre drifts toward Life Force.** Survivor-likes tend to end with everything automatic
   and the screen melting. That's the hold-the-button feel you ranked below Galaga. To keep a
   shot meaningful at minute 18, upgrades have to grow the threat along with the gun. The
   splitting games (Pang, Asteroids, Centipede, JezzBall) do this for free, because every hit
   makes more things to dodge. Worth adopting as a rule now: the dynamite is the template, and a
   good share of upgrades should cut both ways.
2. **Tetris is the best game you named and a poor donor.** It's great because the rules never
   change, and a roguelite's job is to change the rules mid-run. Thumb Tetris also loses to
   buttons at high speed. Its chain-reaction cousins (Puzzle Fighter, Panel de Pon, Puyo Puyo)
   have the multiplying part Tetris lacks.
3. **Shallow is good here.** You called Missile Command shallow. Breakout is shallow too, and
   Ball x Pit built on it. A satisfying, shallow core is the ideal donor because the build
   supplies the depth. A deep core leaves the upgrades nowhere to go.
4. **Asteroids' best moment needs controls you can't have.** Not having enough thrust to get out
   of the way comes from rotate-and-thrust physics. A thumb version keeps the splitting rocks
   and probably loses that moment.
5. **Bomberman and Poy Poy: you called it.** AI opponents are the weak part, and one HTML file
   on one phone won't give you humans. Steal the chained blasts instead.
6. **Paperboy is a content game.** Its joy is the week-long route and the gags, which means
   hand-made streets and animations, the expensive part to build. Great flavor, risky core.

## The thumb rule

Your hunch holds, with one correction. A trackball, spinner, paddle, light gun or mouse reports
a position, and so does a finger, so those games port almost untouched. Joystick-plus-buttons
games split in two: when the stick only uses one axis (Pang, Galaga, Space Invaders), they adapt.

The line that matters is how many things your hand does at once.

- **One continuous input plus one discrete action survives.** Drag to move, lift to fire. Hold
  to charge, release to shoot. Aim, release.
- **More than that dies.** Two continuous inputs (twin-stick) or one plus two buttons (move,
  jump, attack).

Three things the filter also has to account for:

- **The thumb covers what it touches.** A trackball never blocks your view. A finger does. Tap
  games where the action happens at the tap point (Missile Command) are fine because the finger
  leaves. Drag games need the thumb away from the action: relative drag like a trackpad, or a
  cursor offset above the finger.
- **Vertical arcade monitors are a gift.** Space Invaders, Galaxian, Galaga, Centipede and 1942
  shipped on vertical screens and fit a portrait phone as they are. Pang was horizontal and
  gets cramped in portrait.
- **Lift is a scarce verb.** If lifting your thumb pauses the game, which is the safe choice for
  interruptions, it can't also fire. Each prototype has to decide what lifting means.

## The long list

✅ ports as is: the original controller already reports a position (trackball, spinner, paddle,
light gun, mouse) or the game is aim-and-release.
🟡 adapts: one axis plus one button, or a grid. Needs a translation that may cost something.
❌ doesn't: needs a stick and buttons at once, or jump timing.

Numbered so you can react by number.

### Golden-age arcade, 1978 to 1984

| # | Game | Core mechanic | Thumb |
|---|---|---|---|
| 1 | Space Invaders (Taito, 1978) | Slide a cannon along the bottom and shoot a marching grid before it lands. | 🟡 one axis + fire |
| 2 | Galaxian (Namco, 1979) | Invaders that peel out of formation and dive at you. | 🟡 one axis + fire |
| 3 | Asteroids (Atari, 1979) | Rotate, thrust, shoot. Every rock you hit splits into smaller, faster rocks. | ❌ rotate + thrust + fire |
| 4 | Missile Command (Atari, 1980) | Pick a spot in the sky. Your missile bursts there and the blast catches incoming warheads. | ✅ trackball → tap |
| 5 | Pac-Man (Namco, 1980) | Clear a maze of dots. A power pellet turns the ghosts edible. | 🟡 swipe to turn |
| 6 | Warlords (Atari, 1980) | Four castles, a paddle shield each, one fireball knocking out bricks. | ✅ paddle → drag |
| 7 | Centipede (Atari, 1981) | Trackball shooter. Hit a centipede mid-body and it splits in two. | ✅ trackball → drag |
| 8 | Galaga (Namco, 1981) | Two shots on screen at most. Let the boss capture your ship, then shoot it free for a double fighter. | 🟡 one axis + fire |
| 9 | Frogger (Konami, 1981) | Hop across traffic, then across the river on logs and turtles. | 🟡 swipe to hop |
| 10 | Qix (Taito, 1981) | Draw lines to claim 75% of the box while a wild thing roams inside it. | ✅ drawing is what fingers do |
| 11 | Tempest (Atari, 1981) | Spin around the rim of a tube, shooting what climbs it. | ✅ spinner, but radial |
| 12 | Defender (Williams, 1981) | Side-scrolling rescue run with a stick and five buttons. | ❌ too many buttons |
| 13 | Dig Dug (Namco, 1982) | Tunnel through dirt, pump monsters until they pop, drop rocks on them. | 🟡 grid + one action |
| 14 | Joust (Williams, 1982) | Flap to fly. Whoever is higher wins the collision. | ❌ flap + steer |
| 15 | Robotron: 2084 (Williams, 1982) | Move with one stick, shoot with the other, save the last humans. | ❌ twin-stick |
| 16 | Q\*bert (Gottlieb, 1982) | Hop diagonally around a pyramid, changing every cube's color. | 🟡 tap a cube |
| 17 | Kaboom! (Activision, Atari 2600, 1981) | Move stacked buckets to catch the Mad Bomber's bombs as he speeds up. | ✅ paddle → drag |
| 18 | Crystal Castles (Atari, 1983) | Roll through isometric castles collecting gems ahead of the monsters. | ✅ trackball → drag |
| 19 | Tapper (Bally Midway, 1983) | Slide beers down four bars and catch the empties coming back. | 🟡 tap a bar |
| 20 | Marble Madness (Atari, 1984) | Roll a marble down isometric courses against the clock. | ✅ trackball → drag |
| 21 | 1942 (Capcom, 1984) | Vertical plane shooter. A loop-the-loop dodges everything. | 🟡 drag + autofire |

### Later arcade, 1985 to 1999

| # | Game | Core mechanic | Thumb |
|---|---|---|---|
| 22 | Paperboy (Atari, 1985; NES, 1988) | Ride the route Monday to Sunday. Hit subscribers' mailboxes, break everyone else's windows, survive the street. | 🟡 steer + throw |
| 23 | Gauntlet (Atari, 1985) | Four-player dungeon crawl against endless monster spawners. | ❌ 8-way + fire |
| 24 | Gradius (Konami, 1985) | Spend capsules on a power bar. Options are ghost ships that copy your fire. | 🟡 drag + autofire |
| 25 | Arkanoid (Taito, 1986) | Breakout with power capsules. | ✅ paddle, but Ball x Pit took it |
| 26 | Bubble Bobble (Taito, 1986) | Trap monsters in bubbles, then pop them for fruit. | ❌ platformer |
| 27 | Rampage (Bally Midway, 1986) | Giant monsters climb and punch a city down. | ❌ move + jump + punch |
| 28 | R-Type (Irem, 1987) | Hold to charge a beam, release to fire. A detachable pod shields and shoots. | 🟡 hold-and-release fits touch |
| 29 | Operation Wolf (Taito, 1987) | Mounted-gun shooting gallery with scarce magazines and grenades. | ✅ light gun → tap |
| 30 | Klax (Atari, 1989) | Catch tiles tumbling down a conveyor, flip them into bins to make lines of color. | 🟡 five lanes + flip |
| 31 | Pang / Buster Bros (Mitchell, 1989) | Harpoon bouncing balls. Each hit splits a ball into two smaller ones. | 🟡 drag, lift to fire |
| 32 | Super Pang / Super Buster Bros (Mitchell, 1990) | Pang plus Panic mode, an endless survival run. | 🟡 same |
| 33 | Snow Bros (Toaplan, 1990) | Freeze enemies into snowballs, kick one, bowl through the rest. | ❌ platformer |
| 34 | Smash TV (Williams, 1990) | Twin-stick game show, one arena room after another. | ❌ twin-stick |
| 35 | Rampart (Atari, 1990) | Build castle walls from Tetris pieces, fire cannons at ships, repair before the timer. | ✅ trackball → drag and tap |
| 36 | Columns (Sega, 1990) | A falling column of three gems. Cycle the order, match three in any line. | 🟡 drag + tap |
| 37 | Puzzle Bobble / Bust-a-Move (Taito, 1994) | Fire bubbles into a descending ceiling. Cut what holds a cluster and the whole cluster drops. | ✅ aim-and-release |
| 38 | Point Blank (Namco, 1994) | Rapid, silly light-gun microgames. | ✅ light gun → tap |
| 39 | Time Crisis (Namco, 1995) | Light gun with a foot pedal. Step off it to duck behind cover and reload. | ✅ tap, lift to duck |
| 40 | Super Puzzle Fighter II Turbo (Capcom, 1996) | Build gem blocks, shatter them with crash gems, bury your opponent in counter gems. | 🟡 drag + tap |
| 41 | Mr. Driller (Namco, 1999) | Drill down through colored blocks that fall and chain while your air runs out. | 🟡 swipe to drill |

### Console

| # | Game | Core mechanic | Thumb |
|---|---|---|---|
| 42 | Duck Hunt (NES, 1984) | Shoot ducks with the Zapper. The dog laughs when you miss. | ✅ light gun → tap |
| 43 | Bomberman (NES, 1985; Super Bomberman, SNES, 1993) | Drop bombs in a grid maze. A blast sets off every bomb it reaches. | 🟡 tap a tile to walk |
| 44 | Punch-Out!! (NES, 1987) | Read each boxer's tell, dodge, counter. | 🟡 swipe to dodge, tap to punch |
| 45 | Contra (NES, 1988) | Run and gun. The spread gun is everything. | ❌ |
| 46 | Mega Man 2 (NES, 1988) | Beat a boss, take its weapon. | ❌ |
| 47 | Tetris (Game Boy and NES, 1989) | Fit falling shapes, clear lines, go faster forever. | 🟡 drag + tap, worse at speed |
| 48 | Dr. Mario (NES and Game Boy, 1990) | Drop two-color pills to clear viruses. | 🟡 drag + tap |
| 49 | Pinball (Devil's Crush, Kirby's Pinball Land, Space Cadet; 1990 to 1995) | Flippers keep a ball alive. Multiball fills the table. | 🟡 both flippers on one thumb |
| 50 | Sonic the Hedgehog (Genesis, 1991) | Momentum platformer. | ❌ |
| 51 | Puyo Puyo (1991; Mean Bean Machine, Genesis, 1993) | Drop blob pairs. Four of a color pop, and chains bury your opponent. | 🟡 drag + tap |
| 52 | Streets of Rage 2 (Genesis, 1992) | Beat 'em up where your special costs you health. | ❌ |
| 53 | Mario Paint (SNES, 1992) | Gnat Attack, the fly-swatting minigame you played with the mouse. | ✅ mouse → tap |
| 54 | Yoshi's Cookie (NES and SNES, 1992) | Slide rows and columns of cookies to line up matches. | ✅ swipe |
| 55 | Star Fox (SNES, 1993) | On-rails flight shooter. | 🟡 drag + autofire |
| 56 | Kirby's Dream Course (SNES, 1994) | Mini golf where enemies are the targets and the last one becomes the hole. | ✅ aim-and-release |
| 57 | Panel de Pon / Tetris Attack (SNES, 1995) | Swap side-by-side blocks in a rising stack. Clears drop blocks into chains. | ✅ tap to swap |
| 58 | Poy Poy (PS1, 1997) | Four-player arena: throw rocks, bombs and each other. | ❌ and wants humans |

### Early PC

| # | Game | Core mechanic | Thumb |
|---|---|---|---|
| 59 | Pipe Dream (1989) | Lay pipe pieces ahead of the advancing goo. | ✅ tap |
| 60 | Shufflepuck Café (Mac, 1988; DOS, 1989) | Air hockey against a bar full of oddballs. | ✅ mouse → drag |
| 61 | Commander Keen (DOS, 1990) | Platformer. | ❌ |
| 62 | Duke Nukem (DOS, 1991) | Platform shooter. | ❌ |
| 63 | Lemmings (Amiga and DOS, 1991) | Give jobs to a stream of mindless walkers so enough of them reach the exit. | ✅ tap |
| 64 | Scorched Earth (DOS, 1991) | Tank artillery. Set angle and power, then buy MIRVs and nukes between rounds. | ✅ aim-and-release, turn-based |
| 65 | Gorillas (QBasic, 1991) | Two gorillas lob exploding bananas across a skyline. | ✅ aim-and-release |
| 66 | SkiFree (Windows, 1991) | Ski downhill until the yeti eats you. | 🟡 drag to steer |
| 67 | JezzBall (Windows, 1992) | Build walls to box bouncing balls into smaller spaces. One more ball every level. | ✅ tap |
| 68 | Raptor: Call of the Shadows (DOS, 1994) | Vertical shooter flown with the mouse, with a shop between missions. | ✅ mouse → drag |
| 69 | Worms (Amiga, 1995) | Team artillery: cartoon worms, absurd weapons, destructible ground. | ✅ aim-and-release, wants humans |

## The 30-second test (draft)

For the games that pass the thumb and your taste: is the bare mechanic fun for 30 seconds with
no upgrades, and does something multiply on screen for upgrades to stack on?

| Game | Fun bare, in 30 seconds? | What multiplies | Read |
|---|---|---|---|
| Pang | Yes. One big ball, split, split, panic. | Balls, by design. Every hit adds threat. | Strong |
| Missile Command | Yes. Tap, boom, three warheads caught in one blast. | Explosions, chains, warheads that split. | Strong, and the cleanest touch fit |
| Galaga | Yes. The shot limit makes every miss sting. | Formations, divers, your own ships. | Strong, if upgrades don't turn it into Life Force |
| Puzzle Bobble | Yes. The cluster drop is the hook. | Dropped clusters. Paced by your shots, not a clock. | Strong, calmer |
| Scorched Earth | Yes. The arc, the wait, the boom. | MIRVs, clusters, collapsing ground. | Strong if you play somewhere quiet, since it's turn-based |
| JezzBall | Yes. A wall growing toward a ball is pure dread. | Balls per level. Could split on contact. | Wildcard |
| Asteroids, reframed | Only if the controls land. | Rocks split, like Pang. | Medium, control risk |
| Centipede | Fine. You said it never clicked. | Segments split, mushrooms spread. | Medium |
| Rampart | No. Three phases to learn. | Ships, cannonballs, wall pieces. | Wildcard: Tetris plus Missile Command on paper |
| Panel de Pon | Yes, for puzzle people. | Chains. | Medium |
| Puzzle Fighter, Puyo Puyo | Yes, against someone. | Chains, garbage. | Medium, needs a good AI rival |
| Gradius, Raptor | Yes. | Bullets, Options. | Medium. This is the hold-the-button feel |
| Pinball | Yes. | Multiball. | Medium. One-thumb flippers are a compromise |
| Light-gun games | Yes. | Targets. | Medium. Time Crisis's lift-to-duck is worth stealing |
| Paperboy | No. The joy is the week, not 30 seconds. | Street hazards. Papers could. | Wildcard, content-heavy |
| Tetris | Yes. | Nothing. | Weak donor |
| Kirby's Dream Course, Shufflepuck, Tapper, Kaboom! | Yes. | Not much. | Weak |

## Ideas worth stealing from games that fail the thumb

- Streets of Rage's special that costs you health: a panic button with a price.
- Snow Bros' kicked snowball bowling through a crowd.
- Bubble Bobble's trap first, pop later.
- Bomberman's blasts setting off other bombs.
- Galaga's capture: lose your ship on purpose to win back two.
- Gradius's power bar: you choose what to buy, mid-level.
- Time Crisis's pedal: lift to take cover.

## What the ballot said

From the [ballot page](https://claude.ai/artifact/MUhFfyNX5wr587ANQDjJrY), filled in on October 25.

**Your three Consider picks:** Space Invaders, Missile Command, Pang.

**Loved, and they port:** Pang and Super Pang, Puzzle Bobble, JezzBall, Point Blank, Marble Madness,
Arkanoid (taken by Ball x Pit).

**Loved, and they don't port:** Contra, Mega Man 2, Sonic, Streets of Rage 2, Duke Nukem, Star Fox,
1942, Gradius, Smash TV, Rampage, Poy Poy. You agreed with all six pushbacks, and your note on the
first one sharpened it: Life Force and its kind are about precise movement and holding a button,
and neither translates to a thumb. So the love for precise action games is real, and it stays out
of this game.

**Meh:** Pac-Man, Centipede, Qix, Tempest, Defender, Dig Dug, Joust, Robotron (though Smash TV is a
love), Q\*bert, Tapper, Gauntlet, Rampart, Columns, Duck Hunt, Puyo Puyo, Yoshi's Cookie. Rampart and
Centipede drop off the shortlist here.

**Notes:** Space Invaders' crumbling barriers never felt fun. Operation Wolf was mostly the cabinet
and the gun.

**How and where you play:** left thumb, Pixel 6. In a dark room with a kid asleep, commuting, waiting
around. Interrupted sometimes. Sound sometimes on. A run surviving being closed halfway is nice to
have, not required.

**The look:** 16-bit pixels, early-PC colors, near Candle Crawl's mood.

What that changes:

- **Left thumb on a 6.4-inch screen.** The top-right corner is the hard reach. Any game that asks
  you to touch anywhere on the screen (Missile Command, JezzBall) needs a mode where the thumb
  stays low: relative drag, like a trackpad.
- **Interrupted sometimes.** Every prototype freezes the moment the tab hides. A game paced by your
  own shots (Puzzle Bobble) handles interruption best of all.
- **Pixel 6 means Chrome on Android,** which supports vibration when the game is opened from the
  site. Inside the Claude app's viewer it may be blocked.
- **Silly is a thread.** Paperboy, Point Blank, Rampage, Punch-Out, Poy Poy. Whatever wins should
  carry some gags and surprise animations.

## Shortlist

### 1. Pang

- **A run:** climb a tower of about 12 rooms, each a Pang stage of a minute or so, with a boss every
  fourth room. Between rooms, pick one of three upgrades. No shop to manage, no town.
- **Upgrades:** Double Wire (two harpoons at once). Power Wire (the harpoon sticks to the ceiling
  for two seconds as a wall). Dynamite: a charge you trigger when you choose, which drops every
  ball a size and fills the room with small, fast ones. Help that turns into an uh-oh, on purpose.
- **A combination:** Power Wire plus Double Wire becomes a Gate. With two wires stuck to the
  ceiling, a crackling line joins their tips and splits anything that crosses it.
- **Between runs:** new climbers with different harpoons (a vulcan gunner, which tempts you toward
  Life Force and makes you pay for it), new towers with rules (ice floors, wind), difficulty tiers
  like Candle Crawl's.
- **Biggest risk:** portrait squeezes a landscape game. A big ball eats a sixth of the width, and
  the screen full of splits can turn unreadable at phone size.

### 2. Missile Command

- **A run:** defend a city through about ten nights, a minute or two each. Your six cities are your
  health for the whole run, and a lost city stays lost. Between nights, rebuild a city or take an
  upgrade. The last night is a barrage.
- **Upgrades:** Lingering Blast (the explosion hangs as a burning cloud). Chain Fuse (destroyed
  warheads explode with their own blast). Overcharge: blasts twice as big, but they can now hit
  your own cities. The dynamite template again.
- **A combination:** Lingering Blast plus Chain Fuse becomes a Firestorm. The cloud ignites
  whatever enters it, each ignition leaves another cloud, and the fire spreads across the sky,
  including downward toward your cities.
- **Between runs:** new batteries (a railgun that fires a line, a flak cannon that fires a cone),
  new city types (one that makes ammo, one that's a decoy), new kinds of threats.
- **Biggest risk:** your thumb. Reaching the top-right of a Pixel 6 with your left thumb, and
  covering the warhead you're aiming at. The trackball mode in the prototype is the fix to test.

### 3. Puzzle Bobble

- **A run:** a descent through about 15 boards of under a minute each. The ceiling drops every few
  shots, not on a clock, so it waits for you. Between boards, add a special bubble to the bag your
  launcher draws from.
- **Upgrades:** Bomb Bubble (pops everything around it). Ricochet (a shot bounces off one bubble
  before it sticks). Heavy Shot: punches straight through a column, but the ceiling drops a row.
- **A combination:** Ricochet plus Bomb becomes a Pinball Bomb that bounces around the back rows,
  going off on everything it touches. That's the Ball x Pit moment of a shot tearing through the
  back line.
- **Between runs:** new launchers (a twin that fires two in a V, a lob that arcs), new bubble
  types, board themes with rules (ice, chains, monsters inside bubbles that escape if you don't drop
  them, a nod to Bubble Bobble).
- **Biggest risk:** phones are full of free-to-play bubble shooters, and this could feel like one.
  The screen also never fills with chaos the way Pang's does. The payoff is in the drops.

### 4. Invaders (Space Invaders and Galaxian)

- **A run:** waves of formations that march and dive, with traits per wave and a boss formation
  every few. Upgrades between waves.
- **Upgrades:** Piercing Shot. Twin Cannon. Capture, from Galaga: let a diver take your cannon, then
  shoot it free to fight as two.
- **A combination:** Piercing plus Twin Cannon becomes Crossfire: shots from the two cannons angle
  inward and cross, and wherever they meet they detonate.
- **Between runs:** cannons, formation sets. Barriers you build yourself, instead of the crumbling
  ones you didn't like.
- **Biggest risk:** it's the closest thing on this list to Ball x Pit itself, which already borrowed
  the creeping rows. Pushed by upgrades, it also drifts toward a shoot-'em-up.

### 5. JezzBall

- **A run:** a series of boxes, one more ball each time, claim 75% to clear. Upgrades between boxes.
- **Upgrades:** Fast Walls. Armored Wall (survives one hit while growing). Splitter Wall: balls
  that hit a finished wall split in two, so you get more balls but bigger bonuses for trapping
  them small.
- **A combination:** Splitter Wall plus Armored Wall becomes a Mincer: you build walls straight
  through crowds on purpose.
- **Between runs:** wall types, ball types, box shapes.
- **Biggest risk:** placing walls means touching anywhere on the screen, which is the left-thumb
  reach problem at its worst. Less happens on screen than in the others.

## Recommendation: prototype Pang, Missile Command, Puzzle Bobble

Pang and Missile Command are your picks and my front-runners. They test two different ways of
playing with a thumb: drag-and-lift, and tap or trackball.

The third slot goes to Puzzle Bobble over Space Invaders, against your Consider pick, for two
reasons. Invaders plays the same way as Pang: a cannon on the bottom row moving on one axis and
firing up. Pang's prototype already answers whether that feels good under your thumb, so an Invaders
prototype would mostly test the same thing twice. Puzzle Bobble tests the third way, aim and
release, which needs no reach at all. It's also the one that best survives interruptions, and you
loved it. If Pang's controls win, Invaders is a fast follow.

JezzBall stays on the shortlist as the wildcard. Its reach problem is the biggest of the five.

## The prototypes

Bare cores, no upgrades. Each has two or three control schemes behind the button at the top, because
the scheme is the main thing to test. Each pauses when you switch away, and has sound off until you
turn it on.

- **[Harpoon](https://claude.ai/artifact/HoH9FQa8zym6tQDXF9x9JT)** (Pang). Controls: Drag (drag anywhere to move, lift to fire), Tap (tap a spot, you
  run there and fire), Auto (drag to move, it fires itself). Auto is the Galaga versus Life Force
  question in miniature.
- **[Flak](https://claude.ai/artifact/EXWbeZSHcxFAGoH9atbDCM)** (Missile Command). Controls: Tap (fire where you tap), Offset (touch and slide, it fires
  just above your thumb), Trackball (drag anywhere to move a crosshair, lift to fire).
- **[Cluster](https://claude.ai/artifact/9D8cgoC9J8xp3kp2gW8RVo)** (Puzzle Bobble). Controls: Sling (pull back anywhere, let go to fire), Point (touch
  where to aim), Nudge (slide to turn the launcher, tap to fire).

What to notice while you play: which control scheme you stop thinking about, whether the first 30
seconds pull you into a second run, and where your thumb gets in the way.

The links are private claude.ai pages. Source copies live in `docs/retro-roguelite/prototypes/`, in the
artifact format: page content without a doctype or head. The one we pick becomes a real experiment
at `public/experiments/<name>/`, like Candle Crawl.
