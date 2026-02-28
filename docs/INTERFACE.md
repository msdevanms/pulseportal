# PulsePortal Interface Overview (Screenshot Description)

Since a literal screenshot cannot be stored in the source code, this document provides a detailed visual description of the PulsePortal interface as of February 2026.

## 🎨 Visual Aesthetic
- **Theme**: Dark Mode (Mission Control / Cyberpunk)
- **Primary Colors**: Zinc-950 (Background), Emerald-500 (Accents), Zinc-100 (Text)
- **Styling**: Glassmorphism (semi-transparent backgrounds with subtle white/5 borders and backdrop-blur-xl)

## 🏗️ Layout Structure

### 1. Global Header
- **Logo**: "PulsePortal" in bold uppercase, with "Pulse" in white and "Portal" in emerald-500.
- **Micro-label**: "Real-time Intelligence Network" in monospace font.
- **Search Bar**: A sleek, centered input field with a glass-card effect and an emerald-500 search icon.
- **Status Indicators**: "Last Update" timestamp and a refresh button with an emerald-500 spin animation during loading.

### 2. Live Intelligence Bar (Floating Ticker)
- **Position**: Bottom of the screen, draggable and movable.
- **Content**: A continuous horizontal scroll of the latest news titles.
- **Badges**: "NEW" badges in emerald-500 for fresh items, and verification icons (<ShieldCheck /> for verified, <ShieldAlert /> for disputed).
- **Interaction**: A vertical "grip" handle on the left for repositioning.

### 3. Geographic Impact Map
- **Position**: Top-left of the main content area (2/3 width on desktop).
- **Visuals**: A dark-themed world map with emerald-500 pulses at news locations.
- **Interactivity**: Hovering over a pulse reveals a tooltip with the news title and source.

### 4. Pulse Cloud (Word Cloud)
- **Position**: Top-right of the main content area (1/3 width on desktop).
- **Visuals**: A dynamic cluster of keywords with varying font sizes based on frequency.
- **Interactivity**: Keywords are clickable links that open the source article in a new tab.

### 5. Intelligence Feed (News Grid)
- **Position**: Below the Map and Cloud.
- **Visuals**: A multi-column grid of news cards.
- **Card Details**:
    - **Image**: High-quality placeholder with a "NEW" badge if applicable.
    - **Fact-Check Badge**: Status (Verified, Unverified, etc.) and reliability score.
    - **Metadata**: Source name, relative timestamp, and location pin.
    - **Content**: Bold title and a 2-3 sentence description.
    - **Action**: "Read full update" link with an external-link icon.

## 📱 Responsive Behavior
- **Desktop**: Full multi-column dashboard with side-by-side Map and Cloud.
- **Mobile**: Single-column stack with the Map, Cloud, and Feed appearing vertically. The floating ticker remains at the bottom.
