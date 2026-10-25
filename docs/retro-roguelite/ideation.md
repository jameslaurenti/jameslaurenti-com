# Retro roguelite: ideation

Working notes for a one-thumb phone browser game: an old-school core mechanic with a Ball x Pit
style roguelite layer on top. Runs of 10 to 20 minutes, unlocks between runs, one HTML file.

The plan: interview, long list, thumb filter, the 30-second test, a shortlist of 3 to 5, then bare
prototypes of 3.

**Where we are:** long list and thumb filter done. The 30-second test is a first draft. The
shortlist waits on your reactions to the list.

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

## Early read

Front-runners: Pang, Missile Command, Galaga, Puzzle Bobble, Scorched Earth. Wildcards: JezzBall,
Rampart. Pang and Missile Command look like two of the three prototypes either way. The third
depends on where you play: a real-time shooter (Galaga) if you can give it your full attention,
something paced by your own shots (Puzzle Bobble, Scorched Earth) if you get interrupted.

## Shortlist

Pending your reactions to the list.

## Open questions

- Your reactions to the list, by number: loved, liked, never played, no.
- When and where you'll play, and whether a run should survive being closed halfway.
- Which thumb, which phone.
- The look: vector, NES pixels, Game Boy green, early-PC colors, arcade neon. Near Candle
  Crawl's candlelit mood or its own thing.
