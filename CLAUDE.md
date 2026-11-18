# flood-website

<!-- storage-map:start (generated from ewan-intelligence infrastructure/storage-map.json; edit the map, not this block) -->
## Where things live

From the estate storage map (ewan-intelligence `infrastructure/storage-map.md`, R69). Two tiers: TEMP is deleted when its label expires, KEEP is never auto-deleted and is backed up.

- **TEMP:** `/Users/ewannorrie/temp-store/flood-website/<kind>/<name>/`
- **KEEP:** `/Volumes/Work/ewan/keep/flood-website/<kind>/<name>/`
- **Estate kinds:** `scratch`, `renders`, `media`, `xcode`, `builds`, `downloads`, `logs`, `datasets`, `screenshots`, `reports`, `handover`, `session-exit`, `legacy`
- **Main clone:** `/Users/ewannorrie/Desktop/Projects/flood-website`. Never edit it directly: work in your own worktree under `/Users/ewannorrie/worktrees/flood-website/`.

```
OUT=$(store new renders hero-reel --days 5 --purpose "hero reel v2")   # labelled TEMP folder, prints its path
OUT=$(store new media launch-art --keep --purpose "launch artwork")     # labelled KEEP folder
store label <path> --purpose "..." --days 3     # label something where it lies
store keep <path>                               # promote TEMP -> KEEP
store extend <path> 7                           # push the expiry back 7 days
store find --project flood-website                 # find things again
```
Anything saved outside these places, or without a label, is counted by the 06:00 audit as left behind.
<!-- storage-map:end -->
