function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DryRun Visualizer</title>
    <style>
        /* ── CSS Variables ─────────────────────────────────────── */
        :root {
            --bg:          var(--vscode-editor-background);
            --fg:          var(--vscode-editor-foreground);
            --border:      var(--vscode-panel-border, #3c3c3c);
            --input-bg:    var(--vscode-input-background, #3c3c3c);
            --input-fg:    var(--vscode-input-foreground);
            --btn-bg:      var(--vscode-button-background, #0e639c);
            --btn-fg:      var(--vscode-button-foreground, #fff);
            --btn-hover:   var(--vscode-button-hoverBackground, #1177bb);
            --card-bg:     var(--vscode-editorWidget-background, #252526);
            --type-color:  var(--vscode-textPreformat-foreground, #6a9955);
            --name-color:  var(--vscode-symbolIcon-variableForeground, #4fc1ff);
            --val-color:   var(--vscode-textBlockQuote-foreground, #ce9178);
            --panel-bg:    var(--vscode-panel-background, #1e1e1e);
            --tab-border:  var(--vscode-panelTitle-activeBorder, #0e639c);
            --error-bg:    var(--vscode-inputValidation-errorBackground, #5a1d1d);
            --error-border:var(--vscode-inputValidation-errorBorder, #be1100);
            --mono:        var(--vscode-editor-font-family, "Cascadia Code", "Fira Code", Consolas, monospace);
            --r:           6px;
        }

        /* ── Reset / Base ─────────────────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
            width: 100%; height: 100%;
            background: var(--bg);
            color: var(--fg);
            font-family: var(--vscode-font-family, "Segoe UI", Tahoma, sans-serif);
            font-size: 13px;
            overflow: hidden;
        }

        /* ── App Shell ────────────────────────────────────────── */
        #app {
            display: flex;
            flex-direction: column;
            height: 100vh;
            width: 100%;
            overflow: hidden;
        }

        /* ── Scrollbar ────────────────────────────────────────── */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

        /* ── Top Pane ─────────────────────────────────────────── */
        #top-pane {
            flex: 1 1 auto;
            overflow-y: auto;
            padding: 12px 14px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            min-height: 0;
        }

        /* ── Header ───────────────────────────────────────────── */
        .dr-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }
        .dr-title {
            display: flex; align-items: center; gap: 6px;
            font-size: 1.1em; font-weight: 700; letter-spacing: 0.02em;
        }
        .step-pill {
            margin-left: auto;
            font-family: var(--mono);
            font-size: 0.85em;
            color: var(--type-color);
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 2px 10px;
        }

        /* ── Input Section ────────────────────────────────────── */
        .section {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: var(--r);
            padding: 8px 10px;
        }
        .section-header {
            display: flex; align-items: center; justify-content: space-between;
            font-weight: 600; font-size: 0.9em;
        }
        .ghost-btn {
            background: transparent;
            color: var(--fg);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 2px 8px;
            font-size: 0.85em;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.15s;
        }
        .ghost-btn:hover { background: var(--input-bg); }

        #input-body { margin-top: 8px; display: flex; flex-direction: column; gap: 6px; }
        #input-body.hidden { display: none; }

        textarea {
            width: 100%;
            background: var(--input-bg);
            color: var(--input-fg);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 6px 8px;
            font-family: var(--mono);
            font-size: 0.9em;
            min-height: 52px;
            resize: vertical;
            outline: none;
        }
        textarea:focus { border-color: var(--tab-border); }

        .primary-btn {
            background: var(--btn-bg);
            color: var(--btn-fg);
            border: none;
            border-radius: 4px;
            padding: 5px 14px;
            font-weight: 600;
            cursor: pointer;
            font-size: 0.9em;
            display: flex; align-items: center; gap: 4px;
            transition: background 0.15s;
            align-self: flex-end;
        }
        .primary-btn:hover { background: var(--btn-hover); }

        /* ── Error Panel ─────────────────────────────────────── */
        #error-panel {
            display: none;
            background: var(--error-bg);
            border: 1px solid var(--error-border);
            border-radius: var(--r);
            padding: 8px 10px;
        }
        .error-title { font-weight: 700; display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
        #error-line { font-family: var(--mono); font-size: 0.85em; margin-top: 4px; opacity: 0.8; }

        /* ── Controls ────────────────────────────────────────── */
        #controls {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
        }
        .ctrl-btn {
            background: var(--input-bg);
            color: var(--fg);
            border: 1px solid var(--border);
            border-radius: 4px;
            width: 30px; height: 28px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; font-size: 0.9em;
            transition: background 0.15s;
        }
        .ctrl-btn:hover { background: var(--btn-hover); color: var(--btn-fg); border-color: var(--btn-hover); }
        .ctrl-btn.play-btn { width: auto; padding: 0 10px; gap: 4px; font-weight: 600; }

        /* Reset button */
        #btn-reset {
            background: transparent;
            color: var(--type-color);
            border: 1px solid var(--border);
            border-radius: 4px;
            width: 28px; height: 28px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; font-size: 1em;
            margin-left: 2px;
            transition: background 0.15s;
        }
        #btn-reset:hover { background: var(--input-bg); }

        /* Speed Dropdown */
        .speed-wrapper {
            position: relative;
            margin-left: auto;
        }
        #speed-btn {
            background: var(--input-bg);
            color: var(--fg);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 4px 10px;
            font-size: 0.85em;
            cursor: pointer;
            font-family: var(--mono);
            display: flex; align-items: center; gap: 4px;
            white-space: nowrap;
            transition: background 0.15s;
        }
        #speed-btn:hover { background: var(--btn-hover); color: var(--btn-fg); }
        #speed-menu {
            position: absolute;
            right: 0; bottom: calc(100% + 4px);
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: var(--r);
            overflow: hidden;
            z-index: 999;
            min-width: 90px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        #speed-menu.hidden { display: none; }
        .speed-opt {
            padding: 6px 14px;
            font-family: var(--mono);
            font-size: 0.9em;
            cursor: pointer;
            transition: background 0.1s;
        }
        .speed-opt:hover { background: var(--input-bg); }
        .speed-opt.active { color: var(--name-color); font-weight: 700; }

        /* ── Scrubber ─────────────────────────────────────────── */
        #scrubber-row { display: flex; align-items: center; gap: 8px; }
        #step-scrubber {
            flex: 1;
            -webkit-appearance: none;
            height: 4px;
            border-radius: 2px;
            background: var(--border);
            outline: none;
            cursor: pointer;
        }
        #step-scrubber::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 14px; height: 14px;
            border-radius: 50%;
            background: var(--name-color);
            cursor: pointer;
            transition: transform 0.1s;
        }
        #step-scrubber::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .scrubber-label { font-family: var(--mono); font-size: 0.8em; color: var(--type-color); white-space: nowrap; }

        /* ── Step Info Bar ───────────────────────────────────── */
        #step-bar {
            background: var(--input-bg);
            border-left: 3px solid var(--name-color);
            border-radius: 0 var(--r) var(--r) 0;
            padding: 6px 10px;
            font-family: var(--mono);
            font-size: 0.88em;
        }
        .action-badge {
            display: inline-block;
            font-size: 0.75em;
            font-weight: 700;
            padding: 1px 5px;
            border-radius: 3px;
            margin-right: 6px;
            vertical-align: middle;
        }
        .badge-declare   { background: #0e5f3e; color: #89d185; }
        .badge-assign    { background: #1a3a6b; color: #4fc1ff; }
        .badge-input     { background: #3b2f6b; color: #c586c0; }
        .badge-output    { background: #4a3000; color: #dcdcaa; }
        .badge-loop      { background: #1e3a1e; color: #6a9955; }
        .badge-condition { background: #3b2020; color: #f48771; }
        .badge-call      { background: #2a2a00; color: #e5c07b; }
        .badge-return    { background: #2a1a00; color: #e5c07b; }
        .badge-default   { background: var(--card-bg); color: var(--fg); }

        /* ── Variables Table ─────────────────────────────────── */
        #vars-section { flex: 1 1 auto; min-height: 0; overflow: hidden; display: flex; flex-direction: column; }
        .vars-title {
            font-weight: 600; font-size: 0.9em;
            padding: 4px 0 6px 0;
            display: flex; align-items: center; gap: 6px;
        }
        .vars-count {
            font-size: 0.8em; font-weight: 400;
            background: var(--input-bg);
            border-radius: 10px;
            padding: 1px 7px;
            color: var(--type-color);
        }
        #vars-table-wrap {
            flex: 1 1 auto;
            overflow-y: auto;
            min-height: 0;
        }
        .vars-table {
            width: 100%;
            border-collapse: collapse;
        }
        .vars-table th {
            font-size: 0.8em;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--type-color);
            font-weight: 600;
            text-align: left;
            padding: 4px 8px;
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            background: var(--card-bg);
            z-index: 1;
        }
        .vars-table td {
            padding: 4px 8px;
            font-family: var(--mono);
            font-size: 0.88em;
            border-bottom: 1px solid rgba(255,255,255,0.04);
            vertical-align: top;
        }
        .vars-table tr:last-child td { border-bottom: none; }
        .vars-table tr:hover td { background: rgba(255,255,255,0.03); }
        .td-type  { color: var(--type-color); }
        .td-name  { color: var(--name-color); font-weight: 600; }
        .td-value { color: var(--val-color); }
        .var-row-highlighted td { background: rgba(79, 193, 255, 0.08) !important; }
        @keyframes row-flash { 0% { background: rgba(79,193,255,0.25); } 100% { background: transparent; } }
        .var-row-changed td { animation: row-flash 1.2s ease-out; }
        .var-out-of-scope td { opacity: 0.4; }

        /* Expand toggle for complex types */
        .expand-btn {
            background: transparent;
            border: 1px solid var(--border);
            color: var(--type-color);
            border-radius: 3px;
            padding: 1px 5px;
            font-size: 0.78em;
            cursor: pointer;
            margin-left: 6px;
            font-family: var(--mono);
            transition: background 0.1s;
        }
        .expand-btn:hover { background: var(--input-bg); }

        /* ── Output (collapsible, inside top pane) ───────────── */
        #output-section { flex-shrink: 0; }
        #output-body { margin-top: 6px; }
        #output-body.hidden { display: none; }
        #output-area {
            white-space: pre-wrap;
            font-family: var(--mono);
            font-size: 0.88em;
            color: var(--val-color);
            max-height: 80px;
            overflow-y: auto;
            line-height: 1.5;
        }
        .empty-out { color: var(--type-color); font-style: italic; font-size: 0.85em; }

        /* ── Bottom Terminal Panel ───────────────────────────── */
        #bottom-pane {
            flex: 0 0 auto;
            min-height: 180px;
            max-height: 55vh;
            display: flex;
            flex-direction: column;
            background: var(--panel-bg);
            border-top: 2px solid var(--tab-border);
            resize: vertical; /* not natively supported in webviews, JS handles this */
            overflow: hidden;
        }

        /* Tab Strip */
        .tab-strip {
            display: flex;
            align-items: center;
            background: var(--panel-bg);
            border-bottom: 1px solid var(--border);
            flex-shrink: 0;
            user-select: none;
        }
        .tab-item {
            padding: 5px 14px;
            font-size: 0.82em;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            cursor: pointer;
            color: var(--type-color);
            border-bottom: 2px solid transparent;
            transition: color 0.15s;
        }
        .tab-item.active {
            color: var(--fg);
            border-bottom-color: var(--tab-border);
        }
        .tab-item:hover { color: var(--fg); }

        /* Resize handle */
        #resize-handle {
            height: 5px;
            cursor: ns-resize;
            background: transparent;
            flex-shrink: 0;
            order: -1;
        }
        #resize-handle:hover { background: var(--tab-border); }

        /* Tab Content */
        .tab-content {
            flex: 1 1 auto;
            overflow: auto;
            padding: 10px 12px;
            display: none;
        }
        .tab-content.active { display: flex; gap: 12px; }

        /* ── Memory Cards (bottom panel) ─────────────────────── */
        #mem-cards {
            flex: 1 1 auto;
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-content: flex-start;
            align-items: flex-start;
            overflow: auto;
        }
        .mem-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: var(--r);
            padding: 8px 10px;
            min-width: 90px;
            flex-shrink: 0;
        }
        .mem-card-header {
            font-family: var(--mono);
            font-size: 0.78em;
            margin-bottom: 6px;
            display: flex; align-items: center; gap: 6px;
        }
        .mem-card-type { color: var(--type-color); }
        .mem-card-name { color: var(--name-color); font-weight: 700; }
        @keyframes card-glow {
            0%  { box-shadow: 0 0 0 2px var(--name-color), 0 0 10px rgba(79,193,255,0.5); }
            100%{ box-shadow: none; }
        }
        .mem-card-lit { animation: card-glow 1.2s ease-out; }

        /* Scalar value */
        .mc-scalar {
            font-family: var(--mono);
            font-size: 1.4em;
            text-align: center;
            color: var(--val-color);
            padding: 2px 4px;
        }

        /* Array cells */
        .mc-array { display: flex; gap: 3px; overflow-x: auto; padding-bottom: 4px; }
        .mc-cell-wrap { display: flex; flex-direction: column; align-items: center; }
        .mc-cell {
            border: 1px solid var(--border);
            min-width: 36px; height: 30px;
            display: flex; align-items: center; justify-content: center;
            font-family: var(--mono); font-size: 0.85em;
            color: var(--val-color);
            background: var(--input-bg);
            border-radius: 3px;
        }
        @keyframes cell-pulse {
            0%  { background: var(--name-color); color: #fff; }
            100%{ background: var(--input-bg); color: var(--val-color); }
        }
        .mc-cell.lit { animation: cell-pulse 1s ease-out; }
        .mc-idx { font-size: 0.68em; color: var(--type-color); margin-top: 2px; }

        /* Map table */
        .mc-map { border-collapse: collapse; font-family: var(--mono); font-size: 0.85em; }
        .mc-map th, .mc-map td { border: 1px solid var(--border); padding: 3px 7px; text-align: center; }
        .mc-map th { background: var(--input-bg); color: var(--type-color); }
        .mc-map tr:nth-child(even) td { background: rgba(255,255,255,0.03); }

        /* Set badges */
        .mc-set { display: flex; flex-wrap: wrap; gap: 4px; padding: 2px 0; }
        .mc-set-badge {
            background: var(--input-bg);
            color: var(--val-color);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 2px 7px;
            font-family: var(--mono);
            font-size: 0.83em;
        }

        /* Stack */
        .mc-stack { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .mc-stack-item { display: flex; align-items: center; gap: 6px; }
        .mc-stack-cell {
            border: 1px solid var(--name-color);
            min-width: 40px; height: 26px;
            display: flex; align-items: center; justify-content: center;
            font-family: var(--mono); font-size: 0.85em;
            color: var(--val-color); background: var(--input-bg);
        }
        .mc-stack-lbl { font-size: 0.73em; color: var(--type-color); font-family: var(--mono); }

        /* Queue */
        .mc-queue { display: flex; align-items: center; gap: 3px; overflow-x: auto; }
        .mc-queue-lbl { font-size: 0.73em; color: var(--type-color); font-family: var(--mono); white-space: nowrap; }
        .mc-queue-cell {
            border: 1px solid var(--border);
            min-width: 36px; height: 26px;
            display: flex; align-items: center; justify-content: center;
            font-family: var(--mono); font-size: 0.85em;
            color: var(--val-color); background: var(--input-bg);
            border-radius: 3px;
        }

        /* ── History Panel (bottom-right) ────────────────────── */
        #history-pane {
            width: 210px;
            flex-shrink: 0;
            overflow-y: auto;
            border-left: 1px solid var(--border);
            padding: 0 0 0 10px;
        }
        .hist-title {
            font-size: 0.78em;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--type-color);
            font-weight: 600;
            margin-bottom: 6px;
            position: sticky; top: 0;
            background: var(--panel-bg);
            padding: 2px 0;
        }
        .hist-item {
            display: flex; align-items: baseline; gap: 5px;
            font-family: var(--mono); font-size: 0.8em;
            padding: 3px 0;
            border-bottom: 1px solid rgba(255,255,255,0.04);
            cursor: pointer;
            border-radius: 2px;
            transition: background 0.1s;
        }
        .hist-item:hover { background: rgba(255,255,255,0.04); }
        .hist-item.current { color: var(--name-color); font-weight: 700; }
        .hist-step { font-size: 0.75em; color: var(--type-color); min-width: 22px; }
        .hist-desc { color: var(--fg); line-height: 1.3; }

        /* ── Graph View (bottom panel, second tab) ───────────── */
        #graph-tab-content {
            flex: 1 1 auto;
            position: relative;
            overflow: auto;
        }
        #graph-inner {
            position: relative;
            width: 3000px; height: 3000px;
        }
        #edges-svg {
            position: absolute; top: 0; left: 0;
            width: 3000px; height: 3000px;
            pointer-events: none;
        }
        #graph-nodes {
            position: absolute; top: 0; left: 0;
            width: 3000px; height: 3000px;
        }
        .visual-node {
            position: absolute;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            transform: translate(-50%, -50%);
            background: var(--card-bg);
            font-weight: bold;
            box-shadow: 0 3px 6px rgba(0,0,0,0.4);
            transition: top 0.3s ease, left 0.3s ease;
            font-family: var(--mono); color: var(--val-color);
        }
        .tree-node  { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--name-color); }
        .list-node  { width: 50px; height: 30px; border-radius: 4px; border: 2px solid var(--type-color); }
        .graph-node { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #c586c0; }
        .pointer-labels {
            position: absolute; bottom: calc(100% + 6px);
            display: flex; flex-direction: column-reverse;
            align-items: center; gap: 3px;
            white-space: nowrap; pointer-events: none;
        }
        .pointer-label {
            background: var(--name-color); color: var(--bg);
            font-size: 10px; padding: 1px 5px;
            border-radius: 6px; font-family: monospace; font-weight: 700;
        }

        /* ── Call Stack ───────────────────────────────────────── */
        #callstack-bar {
            display: none;
            font-family: var(--mono);
            font-size: 0.82em;
            color: var(--type-color);
            padding: 4px 10px;
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: var(--r);
        }
        .breadcrumb { color: var(--name-color); }
        .bc-sep { color: var(--fg); margin: 0 4px; opacity: 0.5; }

        /* ── Utilities ────────────────────────────────────────── */
        .hidden { display: none !important; }
        .empty-state {
            width: 100%; text-align: center;
            padding: 24px; color: var(--type-color);
            font-style: italic; font-size: 0.9em;
        }
    </style>
</head>
<body>
<div id="app">

    <!-- ╔══════════════════════════════════════╗ -->
    <!-- ║           TOP PANE                   ║ -->
    <!-- ╚══════════════════════════════════════╝ -->
    <div id="top-pane">

        <!-- Header -->
        <div class="dr-header">
            <div class="dr-title">🔬 DryRun</div>
            <div class="step-pill" id="step-pill">–</div>
        </div>

        <!-- Error Panel -->
        <div id="error-panel">
            <div class="error-title">⚠️ Error</div>
            <div id="error-msg"></div>
            <div id="error-line"></div>
        </div>

        <!-- Input Section -->
        <div class="section" id="input-section">
            <div class="section-header">
                <span>📥 Input</span>
                <button class="ghost-btn" id="toggle-input-btn">Expand ▾</button>
            </div>
            <div id="input-body" class="hidden">
                <textarea id="sample-input" placeholder="Enter standard input here…" rows="3"></textarea>
                <button class="primary-btn" id="run-btn">▶ Run</button>
            </div>
        </div>

        <!-- Controls -->
        <div class="section" style="padding: 6px 10px; display: flex; flex-direction: column; gap: 6px;">
            <div id="controls">
                <button class="ctrl-btn" id="btn-first" title="First Step">⏮</button>
                <button class="ctrl-btn" id="btn-prev"  title="Prev (←)">◀</button>
                <button class="ctrl-btn play-btn" id="btn-play" title="Play/Pause (Space)">⏵ Play</button>
                <button class="ctrl-btn" id="btn-next"  title="Next (→)">▶</button>
                <button class="ctrl-btn" id="btn-last"  title="Last Step">⏭</button>
                <button id="btn-reset" title="Reset">↺</button>

                <!-- Speed dropdown -->
                <div class="speed-wrapper">
                    <button id="speed-btn">Speed: 1x ▾</button>
                    <div id="speed-menu" class="hidden">
                        <div class="speed-opt" data-ms="2000" data-label="0.5x">0.5x</div>
                        <div class="speed-opt active" data-ms="1000" data-label="1x">1x</div>
                        <div class="speed-opt" data-ms="500"  data-label="2x">2x</div>
                        <div class="speed-opt" data-ms="250"  data-label="4x">4x</div>
                        <div class="speed-opt" data-ms="125"  data-label="8x">8x</div>
                    </div>
                </div>
            </div>

            <!-- Scrubber -->
            <div id="scrubber-row">
                <input type="range" id="step-scrubber" min="0" max="0" value="0">
                <span class="scrubber-label" id="scrubber-label">0 / 0</span>
            </div>
        </div>

        <!-- Step bar -->
        <div id="step-bar">
            <span id="step-desc">Ready — enter input and click Run.</span>
        </div>

        <!-- Call Stack (only when deep) -->
        <div id="callstack-bar"></div>

        <!-- Variables table -->
        <div id="vars-section" class="section">
            <div class="vars-title">
                Variables
                <span class="vars-count" id="vars-count">0</span>
            </div>
            <div id="vars-table-wrap">
                <table class="vars-table">
                    <thead>
                        <tr>
                            <th style="width:28%">Name</th>
                            <th style="width:30%">Type</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody id="vars-tbody"></tbody>
                </table>
                <div class="empty-state" id="vars-empty">No variables yet</div>
            </div>
        </div>

        <!-- Output -->
        <div class="section" id="output-section">
            <div class="section-header">
                <span>📤 Output</span>
                <button class="ghost-btn" id="toggle-output-btn">▾</button>
            </div>
            <div id="output-body">
                <div id="output-area"><span class="empty-out">No output yet</span></div>
            </div>
        </div>

    </div><!-- /#top-pane -->

    <!-- ╔══════════════════════════════════════╗ -->
    <!-- ║          BOTTOM TERMINAL PANE         ║ -->
    <!-- ╚══════════════════════════════════════╝ -->
    <div id="bottom-pane">
        <div id="resize-handle" title="Drag to resize"></div>

        <!-- Tab strip -->
        <div class="tab-strip">
            <div class="tab-item active" data-tab="memory">Memory</div>
            <div class="tab-item" data-tab="graph">Graph / Tree</div>
        </div>

        <!-- Memory Tab -->
        <div class="tab-content active" id="tab-memory">
            <div id="mem-cards">
                <div class="empty-state">Run to see memory visualization</div>
            </div>
            <div id="history-pane">
                <div class="hist-title">History</div>
                <div id="hist-list"></div>
            </div>
        </div>

        <!-- Graph / Tree Tab -->
        <div class="tab-content" id="tab-graph" style="padding: 0; overflow: hidden;">
            <div id="graph-tab-content">
                <div id="graph-inner">
                    <svg id="edges-svg">
                        <defs>
                            <marker id="arrow" viewBox="0 -5 10 10" refX="22" refY="0"
                                    markerWidth="8" markerHeight="8" orient="auto">
                                <path d="M0,-5L10,0L0,5" fill="var(--name-color)"/>
                            </marker>
                        </defs>
                    </svg>
                    <div id="graph-nodes"></div>
                </div>
            </div>
        </div>
    </div><!-- /#bottom-pane -->

</div><!-- /#app -->

<script>
    const vscode = acquireVsCodeApi();

    // ─── Visualizer (Graph / Tree / Linked List) ─────────────────
    class Visualizer {
        constructor() {
            this.svgHtml   = '<defs><marker id="arrow" viewBox="0 -5 10 10" refX="22" refY="0" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,-5L10,0L0,5" fill="var(--name-color)"/></marker></defs>';
            this.nodesHtml = '';
            this.graphNodes = new Map();
            this.graphEdges = [];
            this.pointers   = new Map();
        }

        addPointer(nodeId, varName) {
            if (!this.pointers.has(nodeId)) this.pointers.set(nodeId, []);
            this.pointers.get(nodeId).push(varName);
        }

        traverse(node, visited = new Set()) {
            if (!node || typeof node !== 'object' || !node.__id__) return;
            if (visited.has(node.__id__)) return;
            visited.add(node.__id__);
            if (!this.graphNodes.has(node.__id__)) {
                this.graphNodes.set(node.__id__, {
                    val: node.val ?? node.value ?? node.data ?? '?',
                    type: node.__type__, x: 0, y: 0
                });
            }
            ['next', 'left', 'right'].forEach(prop => {
                if (node[prop] && typeof node[prop] === 'object' && node[prop].__id__) {
                    const exists = this.graphEdges.some(e => e.source === node.__id__ && e.target === node[prop].__id__);
                    if (!exists) {
                        this.graphEdges.push({ source: node.__id__, target: node[prop].__id__, type: prop });
                        this.traverse(node[prop], visited);
                    }
                }
            });
            if (node.neighbors && Array.isArray(node.neighbors)) {
                node.neighbors.forEach(nb => {
                    if (nb && typeof nb === 'object' && nb.__id__) {
                        const exists = this.graphEdges.some(e => e.source === node.__id__ && e.target === nb.__id__);
                        if (!exists) {
                            this.graphEdges.push({ source: node.__id__, target: nb.__id__, type: 'neighbor' });
                            this.traverse(nb, visited);
                        }
                    }
                });
            }
        }

        render() {
            const inDegree = new Map();
            for (const id of this.graphNodes.keys()) inDegree.set(id, 0);
            for (const edge of this.graphEdges) {
                inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
            }
            let roots = [];
            for (const [id, deg] of inDegree.entries()) {
                if (deg === 0) roots.push(id);
            }
            if (roots.length === 0 && this.graphNodes.size > 0) {
                roots.push(this.graphNodes.keys().next().value);
            }

            let currentY = 80;
            const visited = new Set();

            const gvEl = document.getElementById('graph-tab-content');
            const canvasWidth = gvEl ? gvEl.clientWidth || 600 : 600;
            const startX = Math.max(canvasWidth / 2, 300);

            const assignCoords = (id, x, y, offsetX) => {
                if (visited.has(id)) return;
                visited.add(id);
                const node = this.graphNodes.get(id);
                node.x = x; node.y = y;
                const children = this.graphEdges.filter(e => e.source === id);
                let nextX = x - (offsetX * (children.length - 1)) / 2;
                for (const edge of children) {
                    if (edge.type === 'next')     assignCoords(edge.target, x + 100, y, offsetX);
                    else if (edge.type === 'left')  assignCoords(edge.target, x - offsetX, y + 80, offsetX / 1.5);
                    else if (edge.type === 'right') assignCoords(edge.target, x + offsetX, y + 80, offsetX / 1.5);
                    else if (edge.type === 'neighbor') {
                        assignCoords(edge.target, nextX, y + 100, offsetX / 1.2);
                        nextX += offsetX;
                    }
                }
            };

            for (const rootId of roots) {
                assignCoords(rootId, startX, currentY, 150);
                currentY += 150;
            }

            for (const edge of this.graphEdges) {
                const s = this.graphNodes.get(edge.source);
                const t = this.graphNodes.get(edge.target);
                if (!s || !t) continue;
                let color = 'var(--name-color)';
                if (edge.type === 'next')     color = 'var(--type-color)';
                if (edge.type === 'neighbor') color = '#c586c0';
                const marker = (edge.type === 'next' || edge.type === 'neighbor') ? ' marker-end="url(#arrow)"' : '';
                this.svgHtml += \`<line x1="\${s.x}" y1="\${s.y}" x2="\${t.x}" y2="\${t.y}" stroke="\${color}" stroke-width="2"\${marker}/>\`;
            }

            for (const [id, node] of this.graphNodes.entries()) {
                let cssClass = 'graph-node';
                if (node.type && node.type.includes('Tree')) cssClass = 'tree-node';
                if (node.type && node.type.includes('List')) cssClass = 'list-node';
                let labelsHtml = '';
                if (this.pointers.has(id)) {
                    labelsHtml = \`<div class="pointer-labels">\${this.pointers.get(id).map(n => \`<span class="pointer-label">\${n}</span>\`).join('')}</div>\`;
                }
                this.nodesHtml += \`<div class="visual-node \${cssClass}" style="left:\${node.x}px;top:\${node.y}px" id="vn-\${id}">\${labelsHtml}\${node.val}</div>\`;
            }

            document.getElementById('edges-svg').innerHTML    = this.svgHtml;
            document.getElementById('graph-nodes').innerHTML  = this.nodesHtml;
        }
    }

    // ─── State ───────────────────────────────────────────────────
    let steps            = [];
    let currentStepIndex = -1;
    let playing          = false;
    let playInterval     = null;
    let speedMs          = 1000;
    let declaredVariables = [];   // ordered array (preserves declaration order)
    let expandedVars      = new Set(); // which vars have expanded inline view

    // ─── Element refs ────────────────────────────────────────────
    const inputSection   = document.getElementById('input-section');
    const inputBody      = document.getElementById('input-body');
    const toggleInputBtn = document.getElementById('toggle-input-btn');
    const sampleInput    = document.getElementById('sample-input');
    const runBtn         = document.getElementById('run-btn');

    const errorPanel = document.getElementById('error-panel');
    const errorMsg   = document.getElementById('error-msg');
    const errorLine  = document.getElementById('error-line');

    const btnFirst   = document.getElementById('btn-first');
    const btnPrev    = document.getElementById('btn-prev');
    const btnPlay    = document.getElementById('btn-play');
    const btnNext    = document.getElementById('btn-next');
    const btnLast    = document.getElementById('btn-last');
    const btnReset   = document.getElementById('btn-reset');

    const speedBtn   = document.getElementById('speed-btn');
    const speedMenu  = document.getElementById('speed-menu');

    const stepScrubber  = document.getElementById('step-scrubber');
    const scrubberLabel = document.getElementById('scrubber-label');
    const stepPill      = document.getElementById('step-pill');

    const stepBar  = document.getElementById('step-bar');
    const stepDesc = document.getElementById('step-desc');

    const callstackBar = document.getElementById('callstack-bar');

    const varsTbody = document.getElementById('vars-tbody');
    const varsCount = document.getElementById('vars-count');
    const varsEmpty = document.getElementById('vars-empty');

    const outputBody  = document.getElementById('output-body');
    const toggleOutBtn = document.getElementById('toggle-output-btn');
    const outputArea  = document.getElementById('output-area');

    const memCards  = document.getElementById('mem-cards');
    const histList  = document.getElementById('hist-list');

    // ─── Init ────────────────────────────────────────────────────
    vscode.postMessage({ command: 'ready' });

    // ─── Input toggle ─────────────────────────────────────────────
    toggleInputBtn.addEventListener('click', () => {
        const expanded = !inputBody.classList.contains('hidden');
        inputBody.classList.toggle('hidden', expanded);
        toggleInputBtn.textContent = expanded ? 'Expand ▾' : 'Collapse ▴';
    });

    // ─── Run ─────────────────────────────────────────────────────
    runBtn.addEventListener('click', () => {
        inputBody.classList.add('hidden');
        toggleInputBtn.textContent = 'Expand ▾';
        errorPanel.style.display = 'none';
        vscode.postMessage({ command: 'requestRun', input: sampleInput.value });
    });

    // ─── Output toggle ────────────────────────────────────────────
    toggleOutBtn.addEventListener('click', () => {
        const hidden = outputBody.classList.toggle('hidden');
        toggleOutBtn.textContent = hidden ? '▸' : '▾';
    });

    // ─── Nav Buttons ─────────────────────────────────────────────
    btnFirst.addEventListener('click', () => goToStep(0));
    btnPrev .addEventListener('click', () => goToStep(currentStepIndex - 1));
    btnPlay .addEventListener('click', togglePlay);
    btnNext .addEventListener('click', () => goToStep(currentStepIndex + 1));
    btnLast .addEventListener('click', () => goToStep(steps.length - 1));
    btnReset.addEventListener('click', () => {
        stopPlay();
        if (steps.length) goToStep(0);
    });

    // ─── Scrubber ─────────────────────────────────────────────────
    stepScrubber.addEventListener('input', (e) => {
        goToStep(parseInt(e.target.value, 10));
    });

    // ─── Speed dropdown ───────────────────────────────────────────
    speedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        speedMenu.classList.toggle('hidden');
    });
    document.addEventListener('click', () => speedMenu.classList.add('hidden'));
    document.querySelectorAll('.speed-opt').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            speedMs = parseInt(opt.dataset.ms, 10);
            document.querySelectorAll('.speed-opt').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            speedBtn.textContent = 'Speed: ' + opt.dataset.label + ' ▾';
            speedMenu.classList.add('hidden');
            if (playing) { stopPlay(); startPlay(); }
        });
    });

    // ─── Keyboard shortcuts ───────────────────────────────────────
    document.addEventListener('keydown', (e) => {
        if (document.activeElement.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowLeft')  { e.preventDefault(); goToStep(currentStepIndex - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goToStep(currentStepIndex + 1); }
        if (e.key === ' ')          { e.preventDefault(); togglePlay(); }
    });

    // ─── Tab switching ────────────────────────────────────────────
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const id = 'tab-' + tab.dataset.tab;
            document.getElementById(id).classList.add('active');
        });
    });

    // ─── Resize handle (drag top of bottom pane) ──────────────────
    (function initResize() {
        const handle     = document.getElementById('resize-handle');
        const bottomPane = document.getElementById('bottom-pane');
        const app        = document.getElementById('app');
        let dragging = false, startY = 0, startH = 0;

        handle.addEventListener('mousedown', e => {
            dragging = true;
            startY = e.clientY;
            startH = bottomPane.getBoundingClientRect().height;
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'ns-resize';
        });
        document.addEventListener('mousemove', e => {
            if (!dragging) return;
            const delta  = startY - e.clientY;
            const newH   = Math.max(120, Math.min(startH + delta, app.clientHeight * 0.8));
            bottomPane.style.minHeight = newH + 'px';
            bottomPane.style.maxHeight = newH + 'px';
            bottomPane.style.flex = '0 0 ' + newH + 'px';
        });
        document.addEventListener('mouseup', () => {
            if (!dragging) return;
            dragging = false;
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        });
    })();

    // ─── Messages from extension ──────────────────────────────────
    window.addEventListener('message', event => {
        const msg = event.data;
        switch (msg.command) {
            case 'loadSteps':
                steps = msg.steps || [];
                declaredVariables = [];
                expandedVars.clear();
                histList.innerHTML = '';
                stepScrubber.max   = Math.max(0, steps.length - 1);
                stepScrubber.value = 0;
                goToStep(0);
                break;
            case 'error':
                showError(msg.message, msg.line);
                break;
            case 'goToStep':
                goToStep(msg.step);
                break;
        }
    });

    // ─── Play / Pause ────────────────────────────────────────────
    function togglePlay() {
        if (playing) stopPlay(); else startPlay();
    }
    function startPlay() {
        if (!steps.length) return;
        // Wrap to start if at end
        if (currentStepIndex >= steps.length - 1) {
            goToStep(0, false);
        }
        playing = true;
        btnPlay.innerHTML = '⏸ Pause';
        playInterval = setInterval(() => {
            if (currentStepIndex < steps.length - 1) {
                goToStep(currentStepIndex + 1, false);
            } else {
                stopPlay();
            }
        }, speedMs);
    }
    function stopPlay() {
        playing = false;
        btnPlay.innerHTML = '⏵ Play';
        if (playInterval) clearInterval(playInterval);
        playInterval = null;
    }

    // ─── Core: goToStep ──────────────────────────────────────────
    function goToStep(index, notifyExtension = true) {
        if (!steps.length || index < 0 || index >= steps.length) return;

        const prevStep       = currentStepIndex >= 0 ? steps[currentStepIndex] : null;
        currentStepIndex     = index;
        const state          = steps[index];

        // Scrubber + pill
        stepScrubber.value   = index;
        scrubberLabel.textContent = \`\${index + 1} / \${steps.length}\`;
        stepPill.textContent = \`\${index + 1} / \${steps.length}\`;

        // Step bar
        stepDesc.innerHTML = buildActionBadge(state.action) + esc(state.description || '');

        // Call stack
        if (state.callStack && state.callStack.length > 1) {
            callstackBar.style.display = 'block';
            callstackBar.innerHTML = '📞 ' + state.callStack.map((f, i) =>
                (i < state.callStack.length - 1)
                    ? \`<span class="breadcrumb">\${esc(f)}</span><span class="bc-sep">→</span>\`
                    : \`<span class="breadcrumb" style="color:var(--fg);font-weight:700">\${esc(f)}</span>\`
            ).join('');
        } else {
            callstackBar.style.display = 'none';
        }

        // Output
        const outText = state.output || '';
        outputArea.innerHTML = outText
            ? \`<span>\${esc(outText)}</span>\`
            : \`<span class="empty-out">No output yet</span>\`;

        // Variables (table + memory cards)
        renderStep(state, prevStep);

        // History (incremental)
        appendHistory(index, state);

        if (notifyExtension) {
            vscode.postMessage({ command: 'stepChanged', line: state.line, stepIndex: index });
        }
    }

    // ─── Render step ──────────────────────────────────────────────
    function renderStep(state, prevStep) {
        const vars     = state.variables || {};
        const prevVars = prevStep ? (prevStep.variables || {}) : {};

        // Build ordered declared set
        Object.keys(vars).forEach(name => {
            if (!declaredVariables.includes(name)) declaredVariables.push(name);
        });

        const count = declaredVariables.filter(n => n in vars).length;
        varsCount.textContent = count;

        if (declaredVariables.length === 0) {
            varsEmpty.classList.remove('hidden');
            varsTbody.innerHTML = '';
            memCards.innerHTML  = '<div class="empty-state">No variables yet</div>';
            return;
        }
        varsEmpty.classList.add('hidden');

        // Visualizer for graph nodes
        const viz = new Visualizer();
        let hasGraphNodes = false;

        varsTbody.innerHTML = '';
        memCards.innerHTML  = '';

        declaredVariables.forEach(varName => {
            const isActive = varName in vars;
            const v = isActive ? vars[varName] : (prevVars[varName] || null);
            if (!v) return;

            // Type flags from type string
            const vv = normalizeVarFlags({ ...v });

            const isHighlighted  = state.highlightVar === varName;
            const highlightIndex = state.highlightIndex;
            const prevVal        = prevVars[varName];
            const valueChanged   = isActive && !!prevVal && didValueChange(prevVal.value, vv.value);

            // ── Variables Table row ──
            const tr = document.createElement('tr');
            let cls = '';
            if (!isActive)    cls += ' var-out-of-scope';
            if (isHighlighted) cls += ' var-row-highlighted';
            if (valueChanged)  cls += ' var-row-changed';
            tr.className = cls.trim();

            const isComplex = vv.isArray || vv.isMap || vv.isSet || vv.isStack || vv.isQueue;
            const isExpanded = expandedVars.has(varName);
            const expandHtml = isComplex
                ? \`<button class="expand-btn" data-var="\${esc(varName)}">\${isExpanded ? '▴' : '▾'}</button>\`
                : '';

            // Simple value summary for table
            const valueSummary = getValueSummary(vv);

            tr.innerHTML = \`
                <td class="td-name">\${esc(varName)}\${expandHtml}</td>
                <td class="td-type">\${esc(vv.type || 'auto')}</td>
                <td class="td-value">\${valueSummary}</td>
            \`;
            varsTbody.appendChild(tr);

            // Expanded inline row
            if (isComplex && isExpanded) {
                const expandRow = document.createElement('tr');
                expandRow.innerHTML = \`<td colspan="3" style="padding: 6px 8px;">\${buildInlineViz(vv, isHighlighted, highlightIndex)}</td>\`;
                varsTbody.appendChild(expandRow);
            }

            // ── Memory Card (bottom panel) ──
            if (vv.isGraphNode) {
                hasGraphNodes = true;
                viz.traverse(vv.value);
                viz.addPointer(vv.value.__id__, varName);
            } else if (isComplex) {
                // Build a card in the bottom memory panel
                const card = document.createElement('div');
                card.className = 'mem-card' + (isHighlighted ? ' mem-card-lit' : '');
                card.innerHTML = \`
                    <div class="mem-card-header">
                        <span class="mem-card-type">\${esc(vv.type || 'auto')}</span>
                        <span class="mem-card-name">\${esc(varName)}</span>
                    </div>
                    \${buildMemCardBody(vv, isHighlighted, highlightIndex)}
                \`;
                memCards.appendChild(card);
            }
        });

        // Attach expand-button listeners
        varsTbody.querySelectorAll('.expand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const name = btn.dataset.var;
                if (expandedVars.has(name)) expandedVars.delete(name);
                else expandedVars.add(name);
                // Re-render without wiping history
                renderStep(state, prevStep);
            });
        });

        // If no complex types, show empty state in memory panel
        if (memCards.children.length === 0 && !hasGraphNodes) {
            memCards.innerHTML = '<div class="empty-state">No data structures to visualize</div>';
        }

        // Render graph if needed
        if (hasGraphNodes) {
            // Switch to graph tab
            document.querySelector('[data-tab="graph"]').click();
            viz.render();
        }
    }

    // ─── History (incremental) ────────────────────────────────────
    let historyBuiltUpTo = -1;

    function appendHistory(index, state) {
        // If we jumped backwards, rebuild
        if (index < historyBuiltUpTo) {
            histList.innerHTML = '';
            historyBuiltUpTo = -1;
        }
        // Append new items
        for (let i = historyBuiltUpTo + 1; i <= index; i++) {
            const s = steps[i];
            const item = document.createElement('div');
            item.className = 'hist-item' + (i === index ? ' current' : '');
            item.dataset.idx = i;
            item.innerHTML = \`
                <span class="hist-step">\${i + 1}</span>
                <span class="hist-desc">\${esc((s.description || '').substring(0, 40))}</span>
            \`;
            item.addEventListener('click', () => goToStep(parseInt(item.dataset.idx, 10)));
            histList.appendChild(item);
        }
        historyBuiltUpTo = index;

        // Update current highlight
        histList.querySelectorAll('.hist-item').forEach(item => {
            const isC = parseInt(item.dataset.idx, 10) === index;
            item.classList.toggle('current', isC);
            if (isC) item.scrollIntoView({ block: 'nearest' });
        });
    }

    // ─── Build action badge ───────────────────────────────────────
    function buildActionBadge(action) {
        const a = (action || 'step').toLowerCase();
        let cls = 'badge-default';
        if (a === 'declare')                           cls = 'badge-declare';
        else if (a === 'assign')                       cls = 'badge-assign';
        else if (a === 'input')                        cls = 'badge-input';
        else if (a === 'output')                       cls = 'badge-output';
        else if (a.startsWith('loop') || a === 'loop-check' || a === 'loop-update') cls = 'badge-loop';
        else if (a.startsWith('condition'))            cls = 'badge-condition';
        else if (a === 'call')                         cls = 'badge-call';
        else if (a === 'return' || a === 'call-return') cls = 'badge-return';
        return \`<span class="action-badge \${cls}">\${a.toUpperCase()}</span>\`;
    }

    // ─── Normalize variable flags from type string ────────────────
    function normalizeVarFlags(v) {
        if (v.type) {
            const t = v.type.toLowerCase();
            if (!v.isMap   && (t.includes('map') || t.includes('dict'))) v.isMap   = true;
            if (!v.isSet   && t.includes('set'))                          v.isSet   = true;
            if (!v.isStack && t.includes('stack'))                        v.isStack = true;
            if (!v.isQueue && (t.includes('queue') || t.includes('deque'))) v.isQueue = true;
        }
        return v;
    }

    // ─── Value summary for table cell ────────────────────────────
    function getValueSummary(v) {
        if (v.isGraphNode)  return \`→ \${esc(v.type || 'node')}\`;
        if (v.isMap)        return \`{ \${Object.keys(v.value || {}).length} entries }\`;
        if (v.isSet) {
            const arr = Array.isArray(v.value) ? v.value : [];
            return \`{ \${arr.slice(0, 4).map(x => esc(String(x))).join(', ')}\${arr.length > 4 ? ', …' : ''} }\`;
        }
        if (v.isStack || v.isQueue) {
            const arr = Array.isArray(v.value) ? v.value : [];
            return \`[\${arr.length} items]\`;
        }
        if (v.isArray) {
            const arr = Array.isArray(v.value) ? v.value : [];
            return \`size = \${arr.length}\`;
        }
        const val = v.value === undefined || v.value === null ? '?' : v.value;
        return esc(String(val));
    }

    // ─── Inline viz (shown inside expanded table row) ────────────
    function buildInlineViz(v, isHighlighted, highlightIndex) {
        if (v.isMap)   return buildMapCard(v, isHighlighted, highlightIndex);
        if (v.isSet)   return buildSetCard(v, isHighlighted);
        if (v.isStack) return buildStackCard(v, isHighlighted);
        if (v.isQueue) return buildQueueCard(v, isHighlighted);
        if (v.isArray) return buildArrayCard(v, isHighlighted, highlightIndex);
        return '';
    }

    // ─── Memory card body ─────────────────────────────────────────
    function buildMemCardBody(v, isHighlighted, highlightIndex) {
        if (v.isMap)   return buildMapCard(v, isHighlighted, highlightIndex);
        if (v.isSet)   return buildSetCard(v, isHighlighted);
        if (v.isStack) return buildStackCard(v, isHighlighted);
        if (v.isQueue) return buildQueueCard(v, isHighlighted);
        if (v.isArray) return buildArrayCard(v, isHighlighted, highlightIndex);
        const val = v.value === undefined || v.value === null ? '?' : v.value;
        return \`<div class="mc-scalar">\${esc(String(val))}</div>\`;
    }

    // ─── Array card ───────────────────────────────────────────────
    function buildArrayCard(v, isHighlighted, highlightIndex) {
        let elements = [];
        if (Array.isArray(v.value)) {
            elements = v.value;
        } else if (typeof v.value === 'object' && v.value !== null) {
            const maxIdx = v.size ? v.size : Math.max(-1, ...Object.keys(v.value).map(Number)) + 1;
            for (let i = 0; i < maxIdx; i++) elements.push(v.value[i]);
        } else {
            elements = new Array(v.size || 0).fill('?');
        }

        const is2D = elements.length > 0 && Array.isArray(elements[0]);
        if (is2D) {
            let html = '<table class="mc-map" style="margin-top:4px"><tr><th></th>';
            for (let j = 0; j < elements[0].length; j++) html += \`<th>\${j}</th>\`;
            html += '</tr>';
            elements.forEach((row, rIdx) => {
                html += \`<tr><th>\${rIdx}</th>\`;
                const rowArr = Array.isArray(row) ? row : Object.values(row || {});
                rowArr.forEach((val, cIdx) => {
                    const lit = (isHighlighted && highlightIndex === \`\${rIdx},\${cIdx}\`) ? ' lit' : '';
                    html += \`<td class="\${lit}">\${esc(String(val ?? '?'))}</td>\`;
                });
                html += '</tr>';
            });
            return html + '</table>';
        }

        let html = '<div class="mc-array">';
        elements.forEach((val, idx) => {
            const lit = (isHighlighted && highlightIndex === idx) ? ' lit' : '';
            html += \`
                <div class="mc-cell-wrap">
                    <div class="mc-cell\${lit}">\${esc(String(val ?? '?'))}</div>
                    <div class="mc-idx">\${idx}</div>
                </div>
            \`;
        });
        return html + '</div>';
    }

    // ─── Map card ─────────────────────────────────────────────────
    function buildMapCard(v) {
        if (!v.value || typeof v.value !== 'object') return '<div class="mc-scalar">?</div>';
        let html = '<table class="mc-map"><tr><th>Key</th><th>Value</th></tr>';
        for (const [k, val] of Object.entries(v.value)) {
            html += \`<tr><td>\${esc(String(k))}</td><td>\${esc(String(val))}</td></tr>\`;
        }
        return html + '</table>';
    }

    // ─── Set card ─────────────────────────────────────────────────
    function buildSetCard(v) {
        const arr = Array.isArray(v.value) ? v.value : [];
        if (!arr.length) return '<div class="mc-set"><span class="mc-set-badge" style="opacity:0.5">{ }</span></div>';
        let html = '<div class="mc-set">';
        arr.forEach(val => { html += \`<span class="mc-set-badge">\${esc(String(val))}</span>\`; });
        return html + '</div>';
    }

    // ─── Stack card ───────────────────────────────────────────────
    function buildStackCard(v, isHighlighted) {
        const arr = Array.isArray(v.value) ? v.value : [];
        if (!arr.length) return '<div class="mc-stack"><span style="opacity:0.5;font-size:0.8em">empty</span></div>';
        let html = '<div class="mc-stack">';
        for (let i = arr.length - 1; i >= 0; i--) {
            const isTop = i === arr.length - 1;
            const lit = (isTop && isHighlighted) ? ' style="background:var(--name-color);color:#fff"' : '';
            html += \`
                <div class="mc-stack-item">
                    <div class="mc-stack-cell"\${lit}>\${esc(String(arr[i]))}</div>
                    <span class="mc-stack-lbl">\${isTop ? '← top' : ''}</span>
                </div>
            \`;
        }
        return html + '</div>';
    }

    // ─── Queue card ───────────────────────────────────────────────
    function buildQueueCard(v) {
        const arr = Array.isArray(v.value) ? v.value : [];
        if (!arr.length) return '<div class="mc-queue"><span style="opacity:0.5;font-size:0.8em">empty</span></div>';
        let html = '<div class="mc-queue"><span class="mc-queue-lbl">front →</span>';
        arr.forEach(val => { html += \`<div class="mc-queue-cell">\${esc(String(val))}</div>\`; });
        return html + '<span class="mc-queue-lbl">← back</span></div>';
    }

    // ─── Error display ────────────────────────────────────────────
    function showError(msg, line) {
        stopPlay();
        errorPanel.style.display = 'block';
        errorMsg.textContent     = msg;
        errorLine.textContent    = line ? \`At line \${line}\` : 'Check your code and try again.';
    }

    // ─── Helpers ─────────────────────────────────────────────────
    function esc(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function didValueChange(prev, curr) {
        if (prev === undefined || prev === null) return curr !== undefined && curr !== null;
        if (typeof prev !== typeof curr) return true;
        if (Array.isArray(prev) && Array.isArray(curr)) {
            if (prev.length !== curr.length) return true;
            return prev.some((v, i) => v !== curr[i]);
        }
        if (typeof prev === 'object' && typeof curr === 'object') {
            return JSON.stringify(prev) !== JSON.stringify(curr);
        }
        return prev !== curr;
    }
</script>
</body>
</html>`;
}

module.exports = { getWebviewContent };
