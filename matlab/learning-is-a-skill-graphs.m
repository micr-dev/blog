% Generate 15 MATLAB/Octave graph concepts for the "Learning is a Skill" blog.
%
% Run with MATLAB:
%   run("matlab/learning-is-a-skill-graphs.m")
%
% Run with Octave:
%   octave --no-gui --quiet matlab/learning-is-a-skill-graphs.m
%
% The script saves PNG files to:
%   matlab/learning-is-a-skill-graph-exports/
%
% The data is hand-modeled from the blog. These are editable visual scores,
% not measured statistics.

clear;
close all;
clc;

set(0, 'defaultfigurevisible', 'off');

scriptPath = mfilename('fullpath');
if isempty(scriptPath)
    scriptDir = pwd;
else
    scriptDir = fileparts(scriptPath);
end

outputDir = fullfile(scriptDir, 'learning-is-a-skill-graph-exports');
if ~exist(outputDir, 'dir')
    mkdir(outputDir);
end

phaseNames = {
    'Unknowledgement'
    'Dunning-Kruger Catastrophe'
    'Finding the Room'
    'Unindexed Layer'
    '1% of the 1%'
};
phaseShort = {'Unknown', 'Basics', 'Room', 'Unindexed', 'Expert'};
knowledge = [5, 25, 48, 73, 92];
confidence = [8, 82, 58, 62, 76];
discoverability = [96, 88, 60, 28, 12];
signal = [6, 24, 52, 78, 92];
noise = [15, 78, 54, 34, 20];
social = [0, 10, 46, 76, 88];
barrier = [5, 18, 44, 72, 90];
value = [8, 30, 58, 84, 96];

sourceNames = {
    'Beginner YouTube'
    'Reddit'
    'AI basics'
    'Specific subreddit'
    'Main Discord'
    'Small Discords'
    'Private archives'
    'Direct peers'
    'Original research'
};
sourcePhase = [2, 2, 2, 3, 3, 4, 4, 5, 5];
sourceDiscoverability = [94, 86, 90, 64, 48, 22, 14, 10, 8];
sourceSignal = [24, 32, 36, 52, 62, 78, 85, 88, 94];
sourceRisk = [62, 55, 48, 40, 28, 30, 18, 20, 14];

sourceCategories = {'YouTube', 'Reddit', 'AI', 'Niche forums', 'Discord', 'Research/peers'};
sourceWeights = [
    0.00, 0.00, 0.00, 0.00, 0.00, 0.00
    0.40, 0.28, 0.20, 0.05, 0.05, 0.02
    0.12, 0.18, 0.06, 0.20, 0.34, 0.10
    0.04, 0.06, 0.02, 0.10, 0.48, 0.30
    0.02, 0.02, 0.01, 0.04, 0.26, 0.65
];

risks = {'Misinformation', 'Overconfidence', 'Echo chamber', 'Spoonfeeding', 'Gatekeeping', 'Lost knowledge', 'Burnout'};
riskByPhase = [
    10, 5, 5, 0, 0, 10, 0
    82, 90, 54, 48, 5, 18, 12
    58, 46, 68, 58, 24, 35, 18
    36, 32, 54, 25, 72, 86, 36
    22, 28, 62, 8, 48, 72, 70
];

gawxSkills = {
    'Art'
    'Storytelling'
    'Color grading'
    'Composition'
    'Graphic design'
    'Pacing'
    'Cinematography'
    'Marketing'
    'Fashion'
    'Interior design'
    'Cameras'
    'Lenses'
};

loopSteps = {
    'Choose topic'
    'Search basics'
    'Filter noise'
    'Build something'
    'Debug failure'
    'Ask better questions'
    'Archive notes'
    'Share or research'
};

expertPaths = {'Content creation', 'Researcher', 'Leecher', 'Retired veteran'};
palette = [
    0.121, 0.466, 0.705
    1.000, 0.498, 0.054
    0.172, 0.627, 0.172
    0.839, 0.153, 0.157
    0.580, 0.404, 0.741
    0.549, 0.337, 0.294
    0.890, 0.467, 0.761
    0.498, 0.498, 0.498
    0.737, 0.741, 0.133
    0.090, 0.745, 0.811
];

fprintf('Saving graph options to %s\n', outputDir);

% 01: Core Concept Network
fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);
labels = {
    'Learning is a Skill'
    'Mindset'
    'No one is special'
    'Saved time compounds'
    'Phase ladder'
    'Source filtering'
    'Community literacy'
    'Archiving'
    'Taste'
    'Expert paths'
    'Just start'
};
x = [0.05, 0.25, 0.45, 0.25, 0.25, 0.25, 0.50, 0.50, 0.70, 0.72, 0.92];
y = [0.50, 0.78, 0.78, 0.60, 0.43, 0.24, 0.36, 0.18, 0.45, 0.68, 0.50];
edges = [
    1, 2
    2, 3
    1, 4
    1, 5
    1, 6
    5, 7
    5, 8
    6, 7
    7, 8
    8, 10
    9, 10
    10, 11
    4, 11
];
hold on;
for i = 1:size(edges, 1)
    a = edges(i, 1);
    b = edges(i, 2);
    quiver(x(a), y(a), x(b) - x(a), y(b) - y(a), 0, 'Color', [0.35, 0.35, 0.35], 'LineWidth', 1.6, 'MaxHeadSize', 0.12);
end
for i = 1:numel(labels)
    colorIndex = mod(i - 1, size(palette, 1)) + 1;
    scatter(x(i), y(i), 900, palette(colorIndex, :), 'filled', 'MarkerEdgeColor', 'k');
    text(x(i), y(i), labels{i}, 'HorizontalAlignment', 'center', 'FontWeight', 'bold', 'FontSize', 9);
end
hold off;
axis([0, 1, 0, 1]);
axis off;
title('Option 1: Core Concept Network', 'FontSize', 18, 'FontWeight', 'bold');
print(fig, fullfile(outputDir, '01-core-concept-network.png'), '-dpng', '-r180');
close(fig);
fprintf('  01-core-concept-network.png\n');

% 02: Five-Phase Flow
fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);
x = 1:5;
y = ones(1, 5);
hold on;
for i = 1:4
    quiver(x(i) + 0.22, y(i), 0.56, 0, 0, 'Color', [0.25, 0.25, 0.25], 'LineWidth', 3, 'MaxHeadSize', 0.7);
end
for i = 1:5
    colorIndex = mod(i - 1, size(palette, 1)) + 1;
    scatter(x(i), y(i), 2500 + knowledge(i) * 18, palette(colorIndex, :), 'filled', 'MarkerEdgeColor', 'k');
    text(x(i), y(i) + 0.03, phaseShort{i}, 'HorizontalAlignment', 'center', 'FontWeight', 'bold', 'FontSize', 12);
    text(x(i), y(i) - 0.12, sprintf('Depth %d', knowledge(i)), 'HorizontalAlignment', 'center', 'FontSize', 10);
end
hold off;
axis([0.45, 5.55, 0.65, 1.35]);
axis off;
title('Option 2: Five-Phase Learning Flow', 'FontSize', 18, 'FontWeight', 'bold');
print(fig, fullfile(outputDir, '02-five-phase-flow.png'), '-dpng', '-r180');
close(fig);
fprintf('  02-five-phase-flow.png\n');

% 03: Confidence vs Competence Curve
fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);
x = 1:5;
hold on;
area(x, max(confidence - knowledge, 0), 'FaceColor', [0.95, 0.65, 0.25], 'FaceAlpha', 0.25, 'LineStyle', 'none');
plot(x, confidence, '-o', 'LineWidth', 3, 'MarkerSize', 8, 'Color', palette(2, :));
plot(x, knowledge, '-s', 'LineWidth', 3, 'MarkerSize', 8, 'Color', palette(1, :));
hold off;
set(gca, 'XTick', x, 'XTickLabel', phaseShort);
ylim([0, 100]);
ylabel('Modeled score');
legend({'Overconfidence gap', 'Confidence', 'Competence'}, 'Location', 'northwest');
grid on;
title('Option 3: Confidence vs Competence Curve', 'FontSize', 18, 'FontWeight', 'bold');
print(fig, fullfile(outputDir, '03-confidence-competence-curve.png'), '-dpng', '-r180');
close(fig);
fprintf('  03-confidence-competence-curve.png\n');

% 04: Source Stack by Phase
fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);
bar(sourceWeights * 100, 'stacked', 'LineWidth', 0.8);
set(gca, 'XTick', 1:5, 'XTickLabel', phaseShort);
ylabel('Learning input mix (%)');
ylim([0, 100]);
legend(sourceCategories, 'Location', 'eastoutside');
grid on;
title('Option 4: Source Stack by Phase', 'FontSize', 18, 'FontWeight', 'bold');
print(fig, fullfile(outputDir, '04-source-stack-by-phase.png'), '-dpng', '-r180');
close(fig);
fprintf('  04-source-stack-by-phase.png\n');

% 05: Signal vs Accessibility Scatter
fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);
scatter(sourceDiscoverability, sourceSignal, 90 + sourcePhase * 45, sourceRisk, 'filled');
text(sourceDiscoverability + 2, sourceSignal, sourceNames, 'FontSize', 9);
xlim([0, 100]);
ylim([0, 100]);
xlabel('Discoverability');
ylabel('Signal / depth');
colormap(flipud(hot));
cb = colorbar;
ylabel(cb, 'Misinformation or misuse risk');
grid on;
title('Option 5: Signal vs Accessibility Scatter', 'FontSize', 18, 'FontWeight', 'bold');
print(fig, fullfile(outputDir, '05-signal-accessibility-scatter.png'), '-dpng', '-r180');
close(fig);
fprintf('  05-signal-accessibility-scatter.png\n');

% 06: Risk Heatmap
fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);
imagesc(riskByPhase);
colormap(flipud(gray));
colorbar;
set(gca, 'XTick', 1:numel(risks), 'XTickLabel', risks, 'YTick', 1:5, 'YTickLabel', phaseShort);
if exist('xtickangle', 'file') || exist('xtickangle', 'builtin')
    xtickangle(35);
end
title('Option 6: Risk Heatmap', 'FontSize', 18, 'FontWeight', 'bold');
for row = 1:size(riskByPhase, 1)
    for col = 1:size(riskByPhase, 2)
        if riskByPhase(row, col) > 60
            textColor = 'w';
        else
            textColor = 'k';
        end
        text(col, row, sprintf('%d', riskByPhase(row, col)), 'HorizontalAlignment', 'center', 'Color', textColor, 'FontWeight', 'bold');
    end
end
print(fig, fullfile(outputDir, '06-risk-heatmap.png'), '-dpng', '-r180');
close(fig);
fprintf('  06-risk-heatmap.png\n');

% 07: Community Depth Funnel
fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);
population = [100, 7, 1.4, 0.35, 0.07];
funnelWidth = [0.90, 0.62, 0.44, 0.28, 0.16];
hold on;
for i = 1:5
    colorIndex = mod(i - 1, size(palette, 1)) + 1;
    left = 0.50 - funnelWidth(i) / 2;
    rectangle('Position', [left, i - 0.36, funnelWidth(i), 0.72], 'FaceColor', palette(colorIndex, :), 'EdgeColor', 'none');
    text(0.50, i - 0.08, phaseShort{i}, 'HorizontalAlignment', 'center', 'FontWeight', 'bold', 'Color', 'w');
    text(0.50, i + 0.16, sprintf('People %.2g%% | Value %d', population(i), value(i)), 'HorizontalAlignment', 'center', 'FontSize', 9, 'Color', 'w');
end
hold off;
axis([0, 1, 0.3, 5.7]);
set(gca, 'YDir', 'reverse');
axis off;
title('Option 7: Community Depth Funnel', 'FontSize', 18, 'FontWeight', 'bold');
print(fig, fullfile(outputDir, '07-community-depth-funnel.png'), '-dpng', '-r180');
close(fig);
fprintf('  07-community-depth-funnel.png\n');

% 08: Phase Radar Profile
fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);
radarAx = axes('Position', [0.08, 0.08, 0.50, 0.82]);
axes(radarAx);
metrics = [
    knowledge
    discoverability
    signal
    social
    barrier
    value
];
metricLabels = {'Knowledge', 'Discoverability', 'Signal quality', 'Social skill', 'Barrier', 'Value'};
radarPhaseLabels = {'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'};
radarPalette = [
    0.796, 0.835, 0.882
    0.682, 0.722, 0.780
    0.529, 0.573, 0.639
    0.373, 0.420, 0.490
    0.145, 0.188, 0.255
];
nMetrics = numel(metricLabels);
theta = pi / 6 + linspace(0, 2*pi, nMetrics + 1);
centerX = 0.50;
centerY = 0.50;
radarRadius = 0.34;
hold on;
for radius = 20:20:100
    ringX = centerX + radarRadius * radius / 100 * cos(theta);
    ringY = centerY + radarRadius * radius / 100 * sin(theta);
    plot(ringX, ringY, '-', 'Color', [0.86, 0.86, 0.86], 'LineWidth', 1.2);
    text(centerX + 0.012, centerY + radarRadius * radius / 100, sprintf('%d', radius), 'Color', [0.42, 0.42, 0.42], 'FontSize', 8);
end
for i = 1:nMetrics
    axisX = centerX + radarRadius * cos(theta(i));
    axisY = centerY + radarRadius * sin(theta(i));
    labelX = centerX + radarRadius * 1.18 * cos(theta(i));
    labelY = centerY + radarRadius * 1.18 * sin(theta(i));
    if cos(theta(i)) > 0.25
        align = 'left';
    elseif cos(theta(i)) < -0.25
        align = 'right';
    else
        align = 'center';
    end
    plot([centerX, axisX], [centerY, axisY], '-', 'Color', [0.84, 0.84, 0.84], 'LineWidth', 1.0);
    text(labelX, labelY, metricLabels{i}, 'HorizontalAlignment', align, 'FontWeight', 'bold', 'FontSize', 11);
end
for i = 1:5
    values = [metrics(:, i); metrics(1, i)];
    polyX = centerX + radarRadius * (values' / 100) .* cos(theta);
    polyY = centerY + radarRadius * (values' / 100) .* sin(theta);
    for segment = 1:nMetrics
        plot(polyX(segment:segment + 1), polyY(segment:segment + 1), '-', 'LineWidth', 2.8, 'Color', radarPalette(i, :));
    end
    scatter(polyX(1:end-1), polyY(1:end-1), 24, radarPalette(i, :), 'filled', 'MarkerEdgeColor', [1, 1, 1]);
end
hold off;
axis([0, 1, 0, 1]);
axis square;
axis off;
title('Learning Phase Radar Profile', 'FontSize', 18, 'FontWeight', 'bold');

legendAx = axes('Position', [0.66, 0.28, 0.26, 0.44]);
axes(legendAx);
hold on;
legendX = 0.05;
legendY = 0.88;
for i = 1:5
    yLegend = legendY - 0.16 * i;
    plot([legendX, legendX + 0.24], [yLegend, yLegend], 'LineWidth', 3.0, 'Color', radarPalette(i, :));
    text(legendX + 0.32, yLegend, radarPhaseLabels{i}, 'VerticalAlignment', 'middle', 'FontSize', 11);
end
hold off;
axis([0, 1, 0, 1]);
axis off;
if exist('OCTAVE_VERSION', 'builtin')
    print(fig, fullfile(outputDir, '08-phase-radar-profile.png'), '-dpngcairo', '-r180');
else
    exportgraphics(fig, fullfile(outputDir, '08-phase-radar-profile.png'), 'Resolution', 180);
end
copyfile(fullfile(outputDir, '08-phase-radar-profile.png'), fullfile(outputDir, 'learning-phase-radar-profile.png'));
close(fig);
fprintf('  08-phase-radar-profile.png\n');
fprintf('  learning-phase-radar-profile.png\n');

% 09: Skill-Stack Tree
fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);
root = [0.50, 0.90];
midLabels = {'Visual craft', 'Video craft', 'Audience craft', 'Object craft'};
midX = [0.18, 0.39, 0.61, 0.82];
midY = [0.66, 0.66, 0.66, 0.66];
skillX = [0.07, 0.14, 0.21, 0.28, 0.33, 0.39, 0.45, 0.55, 0.61, 0.67, 0.78, 0.86];
skillY = 0.38 * ones(1, 12);
skillParent = [1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4];
hold on;
for i = 1:4
    quiver(root(1), root(2), midX(i) - root(1), midY(i) - root(2), 0, 'Color', [0.35, 0.35, 0.35], 'LineWidth', 1.6, 'MaxHeadSize', 0.12);
end
for i = 1:12
    p = skillParent(i);
    quiver(midX(p), midY(p), skillX(i) - midX(p), skillY(i) - midY(p), 0, 'Color', [0.35, 0.35, 0.35], 'LineWidth', 1.2, 'MaxHeadSize', 0.10);
end
scatter(root(1), root(2), 1800, palette(1, :), 'filled', 'MarkerEdgeColor', 'k');
text(root(1), root(2), 'Gawx example', 'HorizontalAlignment', 'center', 'FontWeight', 'bold');
for i = 1:4
    scatter(midX(i), midY(i), 1200, palette(i + 1, :), 'filled', 'MarkerEdgeColor', 'k');
    text(midX(i), midY(i), midLabels{i}, 'HorizontalAlignment', 'center', 'FontWeight', 'bold', 'FontSize', 9);
end
for i = 1:12
    colorIndex = mod(i + 4, size(palette, 1)) + 1;
    scatter(skillX(i), skillY(i), 850, palette(colorIndex, :), 'filled', 'MarkerEdgeColor', 'k');
    text(skillX(i), skillY(i), gawxSkills{i}, 'HorizontalAlignment', 'center', 'FontSize', 8);
end
hold off;
axis([0, 1, 0.25, 1]);
axis off;
title('Option 9: Skill-Stack Tree', 'FontSize', 18, 'FontWeight', 'bold');
print(fig, fullfile(outputDir, '09-skill-stack-tree.png'), '-dpng', '-r180');
close(fig);
fprintf('  09-skill-stack-tree.png\n');

% 10: Expert Path Decision Tree
fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);
rootX = 0.10;
rootY = 0.50;
pathX = 0.48 * ones(1, 4);
pathY = [0.80, 0.60, 0.40, 0.20];
outX = 0.83 * ones(1, 4);
outY = pathY;
outLabels = {'Teach publicly', 'Make discoveries', 'Gatekeep knowledge', 'Move on / restart'};
hold on;
for i = 1:4
    quiver(rootX, rootY, pathX(i) - rootX, pathY(i) - rootY, 0, 'Color', [0.35, 0.35, 0.35], 'LineWidth', 1.8, 'MaxHeadSize', 0.16);
    quiver(pathX(i), pathY(i), outX(i) - pathX(i), outY(i) - pathY(i), 0, 'Color', [0.35, 0.35, 0.35], 'LineWidth', 1.8, 'MaxHeadSize', 0.16);
    scatter(pathX(i), pathY(i), 1500, palette(i + 1, :), 'filled', 'MarkerEdgeColor', 'k');
    text(pathX(i), pathY(i), expertPaths{i}, 'HorizontalAlignment', 'center', 'FontWeight', 'bold', 'FontSize', 10);
    scatter(outX(i), outY(i), 1200, palette(i + 5, :), 'filled', 'MarkerEdgeColor', 'k');
    text(outX(i), outY(i), outLabels{i}, 'HorizontalAlignment', 'center', 'FontWeight', 'bold', 'FontSize', 10);
end
scatter(rootX, rootY, 1800, palette(1, :), 'filled', 'MarkerEdgeColor', 'k');
text(rootX, rootY, '1% of the 1%', 'HorizontalAlignment', 'center', 'FontWeight', 'bold');
hold off;
axis([0, 1, 0.05, 0.95]);
axis off;
title('Option 10: Expert Path Decision Tree', 'FontSize', 18, 'FontWeight', 'bold');
print(fig, fullfile(outputDir, '10-expert-path-tree.png'), '-dpng', '-r180');
close(fig);
fprintf('  10-expert-path-tree.png\n');

% 11: Learning Loop Cycle
fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);
n = numel(loopSteps);
theta = linspace(0, 2*pi, n + 1);
x = cos(theta(1:end-1));
y = sin(theta(1:end-1));
hold on;
for i = 1:n
    j = mod(i, n) + 1;
    quiver(x(i), y(i), x(j) - x(i), y(j) - y(i), 0, 'LineWidth', 1.8, 'MaxHeadSize', 0.28, 'Color', [0.35, 0.35, 0.35]);
end
for i = 1:n
    colorIndex = mod(i - 1, size(palette, 1)) + 1;
    scatter(x(i), y(i), 850, palette(colorIndex, :), 'filled', 'MarkerEdgeColor', 'k');
    text(1.22 * x(i), 1.22 * y(i), loopSteps{i}, 'HorizontalAlignment', 'center', 'FontWeight', 'bold', 'FontSize', 10);
end
hold off;
axis equal;
axis([-1.45, 1.45, -1.35, 1.35]);
axis off;
title('Option 11: Learning Loop Cycle', 'FontSize', 18, 'FontWeight', 'bold');
print(fig, fullfile(outputDir, '11-learning-loop-cycle.png'), '-dpng', '-r180');
close(fig);
fprintf('  11-learning-loop-cycle.png\n');

% 12: Public vs Unindexed Knowledge
fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);
x = 1:5;
publicKnowledge = [95, 80, 56, 28, 12];
unindexedKnowledge = 100 - publicKnowledge;
area(x, [publicKnowledge(:), unindexedKnowledge(:)], 'LineWidth', 1.2);
set(gca, 'XTick', x, 'XTickLabel', phaseShort);
ylabel('Share of useful knowledge (%)');
ylim([0, 100]);
legend({'Public / indexed', 'Unindexed / interpersonal'}, 'Location', 'eastoutside');
grid on;
title('Option 12: Public vs Unindexed Knowledge', 'FontSize', 18, 'FontWeight', 'bold');
print(fig, fullfile(outputDir, '12-public-vs-unindexed-area.png'), '-dpng', '-r180');
close(fig);
fprintf('  12-public-vs-unindexed-area.png\n');

% 13: Barrier vs Value Tradeoff
fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);
x = 1:5;
plot(x, barrier, '-o', 'LineWidth', 3, 'MarkerSize', 8, 'Color', palette(4, :));
hold on;
plot(x, value, '-s', 'LineWidth', 3, 'MarkerSize', 8, 'Color', palette(3, :));
hold off;
set(gca, 'XTick', x, 'XTickLabel', phaseShort);
ylabel('Modeled score');
ylim([0, 100]);
legend({'Barrier to entry', 'Value of information'}, 'Location', 'northwest');
grid on;
title('Option 13: Barrier vs Value Tradeoff', 'FontSize', 18, 'FontWeight', 'bold');
print(fig, fullfile(outputDir, '13-barrier-value-tradeoff.png'), '-dpng', '-r180');
close(fig);
fprintf('  13-barrier-value-tradeoff.png\n');

% 14: Knowledge Flow Alluvial
fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);
rightLabels = {'Basics', 'Room', 'Unindexed', 'Expert'};
flows = [
    34, 8, 3, 1
    24, 12, 3, 1
    18, 4, 1, 0
    5, 18, 8, 3
    4, 30, 44, 18
    2, 8, 28, 48
];
totalFlow = sum(flows(:));
leftTotals = sum(flows, 2);
rightTotals = sum(flows, 1)';
leftWidths = leftTotals / totalFlow;
rightWidths = rightTotals / totalFlow;
leftGap = 0.015;
rightGap = 0.025;
bottom = 0.08;
availableHeight = 0.84;
leftScale = availableHeight - leftGap * (numel(sourceCategories) - 1);
rightScale = availableHeight - rightGap * (numel(rightLabels) - 1);
leftHeights = leftWidths * leftScale;
rightHeights = rightWidths * rightScale;
leftStarts = zeros(size(leftHeights));
rightStarts = zeros(size(rightHeights));
cursor = bottom;
for i = 1:numel(leftHeights)
    leftStarts(i) = cursor;
    cursor = cursor + leftHeights(i) + leftGap;
end
cursor = bottom;
for i = 1:numel(rightHeights)
    rightStarts(i) = cursor;
    cursor = cursor + rightHeights(i) + rightGap;
end
leftUsed = zeros(size(leftHeights));
rightUsed = zeros(size(rightHeights));
hold on;
text(0.13, 0.965, 'Sources', 'HorizontalAlignment', 'center', 'FontWeight', 'bold', 'FontSize', 13);
text(0.88, 0.965, 'Learning phase', 'HorizontalAlignment', 'center', 'FontWeight', 'bold', 'FontSize', 13);
for i = 1:size(flows, 1)
    for j = 1:size(flows, 2)
        if flows(i, j) == 0
            continue;
        end
        flowHeightLeft = flows(i, j) / totalFlow * leftScale;
        flowHeightRight = flows(i, j) / totalFlow * rightScale;
        y1 = leftStarts(i) + leftUsed(i) + flowHeightLeft / 2;
        y2 = rightStarts(j) + rightUsed(j) + flowHeightRight / 2;
        bandHeight = min(flowHeightLeft, flowHeightRight) * 0.92;
        t = linspace(0, 1, 70);
        curveX = (1 - t).^3 * 0.25 + 3 * (1 - t).^2 .* t * 0.40 + 3 * (1 - t) .* t.^2 * 0.60 + t.^3 * 0.75;
        curveY = (1 - t).^3 * y1 + 3 * (1 - t).^2 .* t * y1 + 3 * (1 - t) .* t.^2 * y2 + t.^3 * y2;
        upperY = curveY + bandHeight / 2;
        lowerY = curveY - bandHeight / 2;
        bandColor = 0.72 * palette(i, :) + 0.28 * [1, 1, 1];
        patch([curveX, fliplr(curveX)], [upperY, fliplr(lowerY)], bandColor, 'FaceAlpha', 0.56, 'EdgeColor', 'none');
        leftUsed(i) = leftUsed(i) + flowHeightLeft;
        rightUsed(j) = rightUsed(j) + flowHeightRight;
    end
end
for i = 1:numel(sourceCategories)
    blockColor = 0.72 * palette(i, :) + 0.28 * [1, 1, 1];
    rectangle('Position', [0.075, leftStarts(i), 0.175, leftHeights(i)], 'FaceColor', blockColor, 'EdgeColor', 'none');
    text(0.162, leftStarts(i) + leftHeights(i) / 2, sourceCategories{i}, 'HorizontalAlignment', 'center', 'VerticalAlignment', 'middle', 'FontWeight', 'bold', 'FontSize', 10, 'Color', 'w');
    text(0.058, leftStarts(i) + leftHeights(i) / 2, sprintf('%d', leftTotals(i)), 'HorizontalAlignment', 'right', 'VerticalAlignment', 'middle', 'FontSize', 9, 'Color', [0.35, 0.35, 0.35]);
end
for i = 1:numel(rightLabels)
    phaseColor = [0.82, 0.82, 0.82];
    rectangle('Position', [0.75, rightStarts(i), 0.175, rightHeights(i)], 'FaceColor', phaseColor, 'EdgeColor', 'none');
    text(0.838, rightStarts(i) + rightHeights(i) / 2, rightLabels{i}, 'HorizontalAlignment', 'center', 'VerticalAlignment', 'middle', 'FontWeight', 'bold', 'FontSize', 10, 'Color', [0.15, 0.15, 0.15]);
    text(0.942, rightStarts(i) + rightHeights(i) / 2, sprintf('%d', rightTotals(i)), 'HorizontalAlignment', 'left', 'VerticalAlignment', 'middle', 'FontSize', 9, 'Color', [0.35, 0.35, 0.35]);
end
hold off;
xlim([0, 1]);
ylim([0, 1]);
axis off;
title('Option 14: Knowledge Flow Alluvial', 'FontSize', 18, 'FontWeight', 'bold');
print(fig, fullfile(outputDir, '14-knowledge-flow-alluvial.png'), '-dpng', '-r180');
close(fig);
fprintf('  14-knowledge-flow-alluvial.png\n');

% 15: Learning Roadmap
fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);
tasks = {
    'Notice the topic exists'
    'Learn vocabulary'
    'Copy beginner examples'
    'Filter bad info'
    'Find niche communities'
    'Lurk and search first'
    'Ask better questions'
    'Read unindexed threads'
    'Archive rare resources'
    'Build original work'
    'Share, research, or retire'
};
starts = [0, 1, 2, 2.8, 4.2, 5.0, 5.7, 6.7, 7.4, 8.6, 9.5];
durations = [1.0, 1.2, 1.0, 1.2, 1.1, 0.9, 0.8, 1.2, 0.9, 1.1, 1.0];
y = 1:numel(tasks);
hold on;
for i = 1:numel(tasks)
    colorIndex = mod(i - 1, size(palette, 1)) + 1;
    rectangle('Position', [starts(i), y(i) - 0.35, durations(i), 0.7], 'FaceColor', palette(colorIndex, :), 'EdgeColor', 'none');
    text(starts(i) + durations(i) + 0.08, y(i), tasks{i}, 'VerticalAlignment', 'middle', 'FontSize', 9);
end
phaseLines = 0:2.1:8.4;
for i = 1:numel(phaseLines)
    plot([phaseLines(i), phaseLines(i)], [0.2, numel(tasks) + 0.8], ':', 'Color', [0.35, 0.35, 0.35]);
    text(phaseLines(i) + 0.04, 0.5, phaseShort{i}, 'FontWeight', 'bold', 'FontSize', 9);
end
hold off;
set(gca, 'YDir', 'reverse', 'YTick', [], 'XTick', []);
xlim([-0.2, 11.2]);
ylim([0.2, numel(tasks) + 0.8]);
title('Option 15: Learning Roadmap', 'FontSize', 18, 'FontWeight', 'bold');
print(fig, fullfile(outputDir, '15-learning-roadmap.png'), '-dpng', '-r180');
close(fig);
fprintf('  15-learning-roadmap.png\n');

fprintf('\nDone. Open the PNGs in %s to compare the 15 options.\n', outputDir);
