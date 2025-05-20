class AdmixtureCalculator {
    constructor() {
        this.targetData = new Map();
        this.sourceData = new Map();
        this.chart = null;
        
        this.initializeEventListeners();
    }

    async initialize() {
        await this.loadTargets();
        await this.loadSourceData();
    }

    async loadTargets() {
        const response = await fetch('data/targets.txt');
        const text = await response.text();
        this.parseG25Data(text, this.targetData);
        this.populateTargetDropdown();
    }

    async loadSourceData() {
        const sourceSelect = document.getElementById('source');
        const selectedSource = sourceSelect.value;
        const response = await fetch(`data/${selectedSource}.txt`);
        const text = await response.text();
        this.sourceData.clear();
        this.parseG25Data(text, this.sourceData);
    }

    parseG25Data(text, dataMap) {
        const lines = text.trim().split('\n');
        lines.forEach(line => {
            const [name, ...coordinates] = line.split(',');
            dataMap.set(name, coordinates.map(Number));
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
        // Implement Simplex algorithm for constrained optimization
        // This is a simplified version - you might want to use a proper optimization library
        const result = this.simplexOptimization(target, sources);
        return {
            proportions: result.proportions,
            distance: result.distance
        };
    }

    simplexOptimization(target, sources) {
        const maxIterations = 1000;
        const tolerance = 1e-6;
        const n = sources.length;
        
        // Initialize with equal proportions
        let proportions = new Array(n).fill(1/n);
        let bestDistance = Infinity;
        let bestProportions = [...proportions];
        
        // Gradient descent with projection
        for (let iter = 0; iter < maxIterations; iter++) {
            // Calculate current modeled vector and distance
            const modeledVector = this.calculateModeledVector(proportions, sources);
            const currentDistance = this.calculateDistance(target, modeledVector);
            
            // Update best solution if current is better
            if (currentDistance < bestDistance) {
                bestDistance = currentDistance;
                bestProportions = [...proportions];
            }
            
            // Calculate gradients
            const gradients = new Array(n).fill(0);
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < target.length; j++) {
                    const diff = modeledVector[j] - target[j];
                    gradients[i] += 2 * diff * sources[i][j];
                }
            }
            
            const learningRate = 0.01;
            const newProportions = proportions.map((p, i) => 
                p - learningRate * gradients[i]
            );
            
            this.projectOntoSimplex(newProportions);
            
            const change = Math.sqrt(
                proportions.reduce((sum, p, i) => 
                    sum + Math.pow(p - newProportions[i], 2), 0)
            );
            
            if (change < tolerance) break;
            
            proportions = newProportions;
        }
        
        return {
            proportions: bestProportions,
            distance: bestDistance
        };
    }

    projectOntoSimplex(v) {
        // Sort vector in descending order
        const sorted = [...v].sort((a, b) => b - a);
        let sum = 0;
        let rho = 0;
        
        // Find rho (number of elements in simplex)
        for (let i = 0; i < v.length; i++) {
            sum += sorted[i];
            const t = (sum - 1) / (i + 1);
            if (sorted[i] > t) {
                rho = i + 1;
            }
        }
        
        // Calculate threshold
        const theta = (sum - 1) / rho;
        
        // Project onto simplex
        for (let i = 0; i < v.length; i++) {
            v[i] = Math.max(0, v[i] - theta);
        }
        
        // Normalize to ensure sum is exactly 1
        const totalSum = v.reduce((a, b) => a + b, 0);
        for (let i = 0; i < v.length; i++) {
            v[i] /= totalSum;
        }
        
        return v;
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

    calculateDistance(v1, v2) {
        return Math.sqrt(
            v1.reduce((sum, val, i) => sum + Math.pow(val - v2[i], 2), 0)
        );
    }

    displayResults(results, sourceNames) {
        const tbody = document.querySelector('#results-table tbody');
        tbody.innerHTML = '';
        
        // Main results table
        results.proportions.forEach((prop, i) => {
            const row = tbody.insertRow();
            row.insertCell(0).textContent = sourceNames[i];
            row.insertCell(1).textContent = `${(prop * 100).toFixed(2)}%`;
        });

        document.getElementById('distance-value').textContent = 
            results.distance.toFixed(4);

        // Update chart
        this.updateChart(results.proportions, sourceNames);
        
        // Add non-zero components section
        this.displayNonZeroComponents(results.proportions, sourceNames);
        
        document.querySelector('.results').style.display = 'block';
    }

    displayNonZeroComponents(proportions, sourceNames) {
        // Create or get the container for non-zero components
        let nonZeroSection = document.getElementById('non-zero-components');
        if (!nonZeroSection) {
            nonZeroSection = document.createElement('div');
            nonZeroSection.id = 'non-zero-components';
            nonZeroSection.className = 'non-zero-section';
            document.querySelector('.results').appendChild(nonZeroSection);
        }

        // Filter and sort non-zero components
        const threshold = 0.001; // 0.1% threshold to consider as non-zero
        const nonZeroComponents = proportions
            .map((prop, index) => ({ 
                name: sourceNames[index], 
                value: prop 
            }))
            .filter(comp => comp.value > threshold)
            .sort((a, b) => b.value - a.value);

        // Create the content
        const header = document.createElement('h3');
        header.textContent = 'Significant Components (>0.1%)';
        
        const componentList = document.createElement('div');
        componentList.className = 'component-list';
        
        const componentText = nonZeroComponents
            .map(comp => `${comp.name}: ${(comp.value * 100).toFixed(2)}%`)
            .join('<br>');

        componentList.innerHTML = componentText;

        // Update the section
        nonZeroSection.innerHTML = '';
        nonZeroSection.appendChild(header);
        nonZeroSection.appendChild(componentList);
    }

    updateChart(proportions, labels) {
        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = document.getElementById('results-chart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Admixture Proportions',
                    data: proportions.map(p => p * 100),
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

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new AdmixtureCalculator();
    calculator.initialize();
});