---
icon: recycle
title: Life Cycle
---

The life cycle of YASCML is very simple. After the user launches the game, the startup process can be divided into the following phases:

## 1. Initialize Loader

The loader is loaded immediately after the game launches. During this phase, the loader reads the mod files, checks mod dependencies, sorts the mods according to their load order, and finally stores them in `window.YASCML.mods`.

If a [hot-patching tool](hot-patching.md) is defined in the game, the loader will run the hot-patching tool first, and then load itself.

## 2. Load Mod Styles and Preload Scripts

The styles and preload scripts defined by mods are executed sequentially during this phase. Typically, mods will:

* Expose the mod API
* Hook into APIs exposed by the engine
* Preload necessary game data (e.g., passage data)

## 3. Initialize SugarCube Engine

The SugarCube engine is initialized during this phase. Note that before this phase, the global object `window.SugarCube` has already been defined and can be accessed.

## 4. Load Postload Scripts

The postload scripts defined by mods are executed sequentially during this phase. Typically, mods will:

* Clean up mod files
* Add custom DOM elements to the game (e.g., an entry for the mod manager)
* Hook into game data that can be processed asynchronously (e.g., image resources)

## 5. End of Life Cycle

The loader has completed all its tasks. At this stage, the game is ready to play.
