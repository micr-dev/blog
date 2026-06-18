% Render only option 8 for the "Learning is a Skill" blog.
%
% Run with MATLAB:
%   run("matlab/learning-is-a-skill-option-08.m")
%
% Run with Octave:
%   octave --no-gui --quiet matlab/learning-is-a-skill-option-08.m

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

phaseShort = {'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'};
knowledge = [5, 25, 48, 73, 92];
discoverability = [96, 88, 60, 28, 12];
signal = [6, 24, 52, 78, 92];
social = [0, 10, 46, 76, 88];
barrier = [5, 18, 44, 72, 90];
value = [8, 30, 58, 84, 96];
metrics = [knowledge; discoverability; signal; social; barrier; value];
metricLabels = {'Knowledge', 'Discoverability', 'Signal quality', 'Social skill', 'Barrier', 'Value'};

palette = [
    0.612, 0.639, 0.686
    0.522, 0.557, 0.608
    0.420, 0.447, 0.502
    0.294, 0.333, 0.388
    0.067, 0.094, 0.153
];

fig = figure('Color', 'w', 'Position', [100, 100, 1400, 850]);

radarAx = axes('Position', [0.07, 0.10, 0.54, 0.78]);
axes(radarAx);

nMetrics = numel(metricLabels);
theta = pi / 6 + linspace(0, 2*pi, nMetrics + 1);
centerX = 0.50;
centerY = 0.50;
radarRadius = 0.34;

hold on;

% Solid grid lines avoid the dropped dotted-line artifacts seen in Octave's
% gnuplot renderer.
for radius = 20:20:100
    ringX = centerX + radarRadius * radius / 100 * cos(theta);
    ringY = centerY + radarRadius * radius / 100 * sin(theta);
    line(ringX, ringY, 'Color', [0.86, 0.86, 0.86], 'LineWidth', 1.15);
    text(centerX + 0.014, centerY + radarRadius * radius / 100, sprintf('%d', radius), 'Color', [0.42, 0.42, 0.42], 'FontSize', 8);
end

for i = 1:nMetrics
    axisX = centerX + radarRadius * cos(theta(i));
    axisY = centerY + radarRadius * sin(theta(i));
    labelX = centerX + radarRadius * 1.19 * cos(theta(i));
    labelY = centerY + radarRadius * 1.19 * sin(theta(i));
    if cos(theta(i)) > 0.25
        align = 'left';
    elseif cos(theta(i)) < -0.25
        align = 'right';
    else
        align = 'center';
    end
    line([centerX, axisX], [centerY, axisY], 'Color', [0.84, 0.84, 0.84], 'LineWidth', 1.05);
    text(labelX, labelY, metricLabels{i}, 'HorizontalAlignment', align, 'FontWeight', 'bold', 'FontSize', 11);
end

for i = 1:5
    values = [metrics(:, i); metrics(1, i)];
    polyX = centerX + radarRadius * (values' / 100) .* cos(theta);
    polyY = centerY + radarRadius * (values' / 100) .* sin(theta);
    for segment = 1:nMetrics
        line(polyX(segment:segment + 1), polyY(segment:segment + 1), 'Color', palette(i, :), 'LineWidth', 2.8);
    end
    scatter(polyX(1:end-1), polyY(1:end-1), 24, palette(i, :), 'filled', 'MarkerEdgeColor', [1, 1, 1]);
end

hold off;
axis([0, 1, 0, 1]);
axis square;
axis off;
title('Learning Phase Radar Profile', 'FontSize', 18, 'FontWeight', 'bold');

legendAx = axes('Position', [0.68, 0.31, 0.25, 0.40]);
axes(legendAx);
hold on;
for i = 1:5
    yLegend = 0.90 - 0.17 * i;
    line([0.05, 0.30], [yLegend, yLegend], 'Color', palette(i, :), 'LineWidth', 3.0);
    text(0.38, yLegend, phaseShort{i}, 'VerticalAlignment', 'middle', 'FontSize', 11);
end
hold off;
axis([0, 1, 0, 1]);
axis off;

outputPath = fullfile(outputDir, '08-phase-radar-profile.png');
if exist('OCTAVE_VERSION', 'builtin')
    print(fig, outputPath, '-dpngcairo', '-r180');
else
    exportgraphics(fig, outputPath, 'Resolution', 180);
end
cleanOutputPath = fullfile(outputDir, 'learning-phase-radar-profile.png');
copyfile(outputPath, cleanOutputPath);
close(fig);

fprintf('Saved %s\n', outputPath);
fprintf('Saved %s\n', cleanOutputPath);
