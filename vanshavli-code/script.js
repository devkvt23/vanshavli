class AdmixtureCalculator {
    constructor() {
        this.targetData = new Map();
        this.sourceData = new Map();
        this.chart = null;
        this.pieChart = null;  // Add this line
    }

    async initialize() {
        await this.loadTargets();
        await this.loadSourceData();
        this.initializeEventListeners();
    }

    async loadTargets() {
        const response = await fetch('data/targets.txt');
        const text = await response.text();
        this.parseG25Data(text, this.targetData, false);
        this.populateTargetDropdown();
    }

    async loadSourceData() {
        const sourceSelect = document.getElementById('source');
        const selectedSource = sourceSelect.value;
        const response = await fetch(`data/${selectedSource}.txt`);
        const text = await response.text();
        this.sourceData.clear();
        this.parseG25Data(text, this.sourceData, true);
    }

    parseG25Data(text, dataMap, groupByMain) {
        const lines = text.trim().split('\n');
        
        if (!groupByMain) {
            lines.forEach(line => {
                const [name, ...coordinates] = line.split(',');
                dataMap.set(name, coordinates.map(Number));
            });
            return;
        }

        const groupedData = new Map();
        
        lines.forEach(line => {
            const [name, ...coordinates] = line.split(',');
            const mainGroup = name.split(':')[0];
            
            if (!groupedData.has(mainGroup)) {
                groupedData.set(mainGroup, {
                    count: 0,
                    coords: new Array(coordinates.length).fill(0)
                });
            }
            
            const group = groupedData.get(mainGroup);
            group.count++;
            coordinates.forEach((coord, i) => {
                group.coords[i] += Number(coord);
            });
        });
        
        groupedData.forEach((group, name) => {
            const avgCoords = group.coords.map(sum => sum / group.count);
            dataMap.set(name, avgCoords);
        });
    }

    populateTargetDropdown() {
        const targetSelect = document.getElementById('target');
        targetSelect.innerHTML = '';
        for (const target of this.targetData.keys()) {
            const option = document.createElement('option');
            option.value = option.textContent = target;
            targetSelect.appendChild(option);
        }
    }

    calculateAdmixture(target, sources) {
        const result = this.nMonteOptimization(target, sources);
        return {
            proportions: result.proportions,
            distance: result.distance
        };
    }

    nMonteOptimization(target, sources) {
        const maxIterations = 5000;
        const tolerance = 1e-7;
        const n = sources.length;
        
        // Initialize with equal proportions
        let proportions = new Array(n).fill(1/n);
        let bestDistance = this.calculateDistance(target, this.calculateModeledVector(proportions, sources));
        let bestProportions = [...proportions];
        
        for(let iter = 0; iter < maxIterations; iter++) {
            let improved = false;
            
            // Cyclic coordinate descent
            for(let i = 0; i < n; i++) {
                const oldProp = proportions[i];
                
                // Try different step sizes
                const steps = [-0.1, -0.05, -0.01, 0.01, 0.05, 0.1];
                
                for(const step of steps) {
                    proportions[i] = oldProp + step;
                    this.enforceConstraints(proportions);
                    
                    const modeledVector = this.calculateModeledVector(proportions, sources);
                    const currentDistance = this.calculateDistance(target, modeledVector);
                    
                    if (currentDistance < bestDistance) {
                        bestDistance = currentDistance;
                        bestProportions = [...proportions];
                        improved = true;
                        break;
                    }
                }
                
                if (!improved) {
                    proportions[i] = oldProp;
                }
            }
            
            // Fine-tuning phase
            if (!improved) {
                const fineSteps = [-0.001, -0.0005, 0.0005, 0.001];
                let fineImproved = false;
                
                for(let i = 0; i < n; i++) {
                    const oldProp = proportions[i];
                    
                    for(const step of fineSteps) {
                        proportions[i] = oldProp + step;
                        this.enforceConstraints(proportions);
                        
                        const modeledVector = this.calculateModeledVector(proportions, sources);
                        const currentDistance = this.calculateDistance(target, modeledVector);
                        
                        if (currentDistance < bestDistance) {;
                            bestDistance = currentDistance;
                            bestProportions = [...proportions];
                            fineImproved = true;
                            break;
                        }
                    }
                    
                    if (!fineImproved) {
                        proportions[i] = oldProp;
                    }
                }
                
                if (!fineImproved) break; // No improvement even with fine-tuning
            }
        }
        
        // Clean up small values
        bestProportions = bestProportions.map(p => p < 0.001 ? 0 : p);
        this.enforceConstraints(bestProportions);
        
        return {
            proportions: bestProportions,
            distance: bestDistance
        };
    }

    enforceConstraints(proportions) {
        for(let i = 0; i < proportions.length; i++) {
            proportions[i] = Math.max(0, proportions[i]);
        }
        
        const sum = proportions.reduce((a,b) => a + b, 0);
        for(let i = 0; i < proportions.length; i++) {
            proportions[i] /= sum;
        }
    }

    calculateModeledVector(proportions, sources) {
        const dimensions = sources[0].length;
        const result = new Array(dimensions).fill(0);
        
        for (let i = 0; i < sources.length; i++) {
            for (let j = 0; j < dimensions; j++) {
                result[j] += sources[i][j] * proportions[i];
            }
        }
        
        return result;
    }

    calculateDistance(target, modeled) {
        let sumSquares = 0;
        for(let i = 0; i < target.length; i++) {
            sumSquares += Math.pow(target[i] - modeled[i], 2);
        }
        return Math.sqrt(sumSquares / target.length);
    }

    displayResults(results, sourceNames) {
        const tbody = document.querySelector('#results-table tbody');
        tbody.innerHTML = '';
        
        results.proportions.forEach((prop, i) => {
            if (prop >= 0.001) { // Only show components > 0.1%
                const row = tbody.insertRow();
                row.insertCell(0).textContent = sourceNames[i];
                row.insertCell(1).textContent = `${(prop * 100).toFixed(2)}%`;
            }
        });

        document.getElementById('distance-value').textContent = 
            results.distance.toFixed(4);

        this.updateChart(results.proportions, sourceNames);
        document.querySelector('.results').style.display = 'block';
    }

    updateChart(proportions, labels) {
        // Clear existing charts
        if (this.chart) {
            this.chart.destroy();
        }
        if (this.pieChart) {
            this.pieChart.destroy();
        }
        
        const significantData = proportions.map((p, i) => ({
            value: p * 100,
            label: labels[i]
        })).filter(item => item.value >= 0.1)
        .sort((a, b) => b.value - a.value);

        // Create bar chart
        const barCtx = document.getElementById('results-chart').getContext('2d');
        this.chart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: significantData.map(d => d.label),
                datasets: [{
                    label: 'Admixture Proportions',
                    data: significantData.map(d => d.value),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });

        // Create pie chart
        const pieCtx = document.getElementById('results-pie-chart').getContext('2d');
        this.pieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: significantData.map(d => d.label),
                datasets: [{
                    data: significantData.map(d => d.value),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(199, 199, 199, 0.5)',
                        'rgba(83, 102, 255, 0.5)',
                        'rgba(40, 159, 64, 0.5)',
                        'rgba(210, 199, 199, 0.5)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    initializeEventListeners() {
        document.getElementById('source').addEventListener('change', 
            () => this.loadSourceData());
            
        document.getElementById('calculate').addEventListener('click', () => {
            const targetName = document.getElementById('target').value;
            const targetVector = this.targetData.get(targetName);
            const sourceVectors = Array.from(this.sourceData.values());
            const sourceNames = Array.from(this.sourceData.keys());
            const results = this.calculateAdmixture(targetVector, sourceVectors);
            this.displayResults(results, sourceNames);
        });

        document.getElementById('copy-results').addEventListener('click', () => {
            const table = document.getElementById('results-table');
            const distance = document.getElementById('distance-value').textContent;
            let text = `Results:\nGenetic Distance: ${distance}\n\n`;
            
            for (const row of table.rows) {
                if (row.cells.length === 2) {
                    text += `${row.cells[0].textContent}: ${row.cells[1].textContent}\n`;
                }
            }
            
            navigator.clipboard.writeText(text);
            alert('Results copied to clipboard!');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const calculator = new AdmixtureCalculator();
    calculator.initialize();
});

$(document).ready(function() {
    $('#target').select2({
        theme: 'classic',
        placeholder: 'Search for a population...',
        allowClear: true,
        width: '100%',
        minimumInputLength: 1,
        dropdownParent: $('body'),
        data: populations // Your population data array
    });
});