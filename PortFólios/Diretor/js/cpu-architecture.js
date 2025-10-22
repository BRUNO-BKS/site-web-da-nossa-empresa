// CPU Architecture Component - JavaScript Vanilla
class CpuArchitecture {
  constructor(options = {}) {
    this.options = {
      className: options.className || 'cpu-architecture',
      width: options.width || '200px',
      height: options.height || '100px',
      text: options.text || 'CPU',
      showCpuConnections: options.showCpuConnections !== false,
      animateText: options.animateText !== false,
      animateLines: options.animateLines !== false,
      animateMarkers: options.animateMarkers !== false,
      lineMarkerSize: options.lineMarkerSize || 18
    };
  }

  create() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', this.options.className);
    svg.setAttribute('width', this.options.width);
    svg.setAttribute('height', this.options.height);
    svg.setAttribute('viewBox', '0 0 200 100');
    svg.style.color = 'currentColor';

    // Create paths
    const pathsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pathsGroup.setAttribute('stroke', 'currentColor');
    pathsGroup.setAttribute('fill', 'none');
    pathsGroup.setAttribute('stroke-width', '0.3');
    pathsGroup.setAttribute('stroke-dasharray', '100 100');
    pathsGroup.setAttribute('pathLength', '100');
    pathsGroup.setAttribute('marker-start', 'url(#cpu-circle-marker)');

    // Path elements
    const paths = [
      'M 10 20 h 79.5 q 5 0 5 5 v 30',
      'M 180 10 h -69.7 q -5 0 -5 5 v 30',
      'M 130 20 v 21.8 q 0 5 -5 5 h -10',
      'M 170 80 v -21.8 q 0 -5 -5 -5 h -50',
      'M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -20',
      'M 94.8 95 v -36',
      'M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 14',
      'M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 5 h 20'
    ];

    paths.forEach((pathData, index) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('stroke-dasharray', '100 100');
      path.setAttribute('pathLength', '100');
      pathsGroup.appendChild(path);

      // Add animation
      if (this.options.animateLines) {
        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', 'stroke-dashoffset');
        animate.setAttribute('from', '100');
        animate.setAttribute('to', '0');
        animate.setAttribute('dur', '1s');
        animate.setAttribute('fill', 'freeze');
        animate.setAttribute('calcMode', 'spline');
        animate.setAttribute('keySplines', '0.25,0.1,0.5,1');
        animate.setAttribute('keyTimes', '0; 1');
        path.appendChild(animate);
      }
    });

    svg.appendChild(pathsGroup);

    // Create colored circles for each path
    const colors = [
      { id: 'cpu-blue-grad', stops: [{ offset: '0%', color: '#00E8ED' }, { offset: '50%', color: '#0088FF' }, { offset: '100%', color: 'transparent' }] },
      { id: 'cpu-yellow-grad', stops: [{ offset: '0%', color: '#FFD800' }, { offset: '50%', color: '#FFD800' }, { offset: '100%', color: 'transparent' }] },
      { id: 'cpu-pinkish-grad', stops: [{ offset: '0%', color: '#830CD1' }, { offset: '50%', color: '#FF008B' }, { offset: '100%', color: 'transparent' }] },
      { id: 'cpu-white-grad', stops: [{ offset: '0%', color: 'white' }, { offset: '100%', color: 'transparent' }] },
      { id: 'cpu-green-grad', stops: [{ offset: '0%', color: '#22c55e' }, { offset: '100%', color: 'transparent' }] },
      { id: 'cpu-orange-grad', stops: [{ offset: '0%', color: '#f97316' }, { offset: '100%', color: 'transparent' }] },
      { id: 'cpu-cyan-grad', stops: [{ offset: '0%', color: '#06b6d4' }, { offset: '100%', color: 'transparent' }] },
      { id: 'cpu-rose-grad', stops: [{ offset: '0%', color: '#f43f5e' }, { offset: '100%', color: 'transparent' }] }
    ];

    // Create gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    colors.forEach((color, index) => {
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
      gradient.setAttribute('id', color.id);
      gradient.setAttribute('fx', '1');
      
      color.stops.forEach(stop => {
        const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stopElement.setAttribute('offset', stop.offset);
        stopElement.setAttribute('stop-color', stop.color);
        gradient.appendChild(stopElement);
      });
      
      defs.appendChild(gradient);
    });

    // Create masks and circles
    const maskPaths = [
      'M 10 20 h 79.5 q 5 0 5 5 v 24',
      'M 180 10 h -69.7 q -5 0 -5 5 v 24',
      'M 130 20 v 21.8 q 0 5 -5 5 h -10',
      'M 170 80 v -21.8 q 0 -5 -5 -5 h -50',
      'M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -20',
      'M 94.8 95 v -36',
      'M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 14',
      'M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 5 h 20'
    ];

    maskPaths.forEach((maskPath, index) => {
      // Create mask
      const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
      mask.setAttribute('id', `cpu-mask-${index + 1}`);
      
      const maskPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      maskPathElement.setAttribute('d', maskPath);
      maskPathElement.setAttribute('stroke-width', '0.5');
      maskPathElement.setAttribute('stroke', 'white');
      mask.appendChild(maskPathElement);
      defs.appendChild(mask);

      // Create circle
      const circleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      circleGroup.setAttribute('mask', `url(#cpu-mask-${index + 1})`);
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', `cpu-architecture cpu-line-${index + 1}`);
      circle.setAttribute('cx', '0');
      circle.setAttribute('cy', '0');
      circle.setAttribute('r', '8');
      circle.setAttribute('fill', `url(#${colors[index].id})`);
      
      circleGroup.appendChild(circle);
      svg.appendChild(circleGroup);
    });

    // CPU Box
    const cpuGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    if (this.options.showCpuConnections) {
      const connectionsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      connectionsGroup.setAttribute('fill', 'url(#cpu-connection-gradient)');
      
      // Add connection rectangles
      const connections = [
        { x: 93, y: 37, width: 2.5, height: 5, rx: 0.7 },
        { x: 104, y: 37, width: 2.5, height: 5, rx: 0.7 },
        { x: 116.3, y: 44, width: 2.5, height: 5, rx: 0.7, transform: 'rotate(90 116.25 45.5)' },
        { x: 122.8, y: 44, width: 2.5, height: 5, rx: 0.7, transform: 'rotate(90 116.25 45.5)' },
        { x: 104, y: 16, width: 2.5, height: 5, rx: 0.7, transform: 'rotate(180 105.25 39.5)' },
        { x: 114.5, y: 16, width: 2.5, height: 5, rx: 0.7, transform: 'rotate(180 105.25 39.5)' },
        { x: 80, y: -13.6, width: 2.5, height: 5, rx: 0.7, transform: 'rotate(270 115.25 19.5)' },
        { x: 87, y: -13.6, width: 2.5, height: 5, rx: 0.7, transform: 'rotate(270 115.25 19.5)' }
      ];

      connections.forEach(conn => {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', conn.x);
        rect.setAttribute('y', conn.y);
        rect.setAttribute('width', conn.width);
        rect.setAttribute('height', conn.height);
        rect.setAttribute('rx', conn.rx);
        if (conn.transform) {
          rect.setAttribute('transform', conn.transform);
        }
        connectionsGroup.appendChild(rect);
      });
      
      cpuGroup.appendChild(connectionsGroup);
    }

    // Main CPU Rectangle
    const cpuRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    cpuRect.setAttribute('x', '85');
    cpuRect.setAttribute('y', '40');
    cpuRect.setAttribute('width', '30');
    cpuRect.setAttribute('height', '20');
    cpuRect.setAttribute('rx', '2');
    cpuRect.setAttribute('fill', '#181818');
    cpuRect.setAttribute('filter', 'url(#cpu-light-shadow)');
    cpuGroup.appendChild(cpuRect);

    // CPU Text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '92');
    text.setAttribute('y', '52.5');
    text.setAttribute('font-size', '7');
    text.setAttribute('font-weight', '600');
    text.setAttribute('letter-spacing', '0.05em');
    text.textContent = this.options.text;
    
    if (this.options.animateText) {
      text.setAttribute('fill', 'url(#cpu-text-gradient)');
    } else {
      text.setAttribute('fill', 'white');
    }
    
    cpuGroup.appendChild(text);
    svg.appendChild(cpuGroup);

    // Add remaining gradients and filters to defs
    const connectionGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    connectionGradient.setAttribute('id', 'cpu-connection-gradient');
    connectionGradient.setAttribute('x1', '0');
    connectionGradient.setAttribute('y1', '0');
    connectionGradient.setAttribute('x2', '0');
    connectionGradient.setAttribute('y2', '1');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#4F4F4F');
    connectionGradient.appendChild(stop1);
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '60%');
    stop2.setAttribute('stop-color', '#121214');
    connectionGradient.appendChild(stop2);
    
    defs.appendChild(connectionGradient);

    // Shadow filter
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'cpu-light-shadow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    
    const dropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
    dropShadow.setAttribute('dx', '1.5');
    dropShadow.setAttribute('dy', '1.5');
    dropShadow.setAttribute('stdDeviation', '1');
    dropShadow.setAttribute('flood-color', 'black');
    dropShadow.setAttribute('flood-opacity', '0.1');
    filter.appendChild(dropShadow);
    defs.appendChild(filter);

    // Marker
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'cpu-circle-marker');
    marker.setAttribute('viewBox', '0 0 10 10');
    marker.setAttribute('refX', '5');
    marker.setAttribute('refY', '5');
    marker.setAttribute('markerWidth', this.options.lineMarkerSize);
    marker.setAttribute('markerHeight', this.options.lineMarkerSize);
    
    const markerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    markerCircle.setAttribute('cx', '5');
    markerCircle.setAttribute('cy', '5');
    markerCircle.setAttribute('r', '2');
    markerCircle.setAttribute('fill', 'black');
    markerCircle.setAttribute('stroke', '#232323');
    markerCircle.setAttribute('stroke-width', '0.5');
    
    if (this.options.animateMarkers) {
      const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animate.setAttribute('attributeName', 'r');
      animate.setAttribute('values', '0; 3; 2');
      animate.setAttribute('dur', '0.5s');
      markerCircle.appendChild(animate);
    }
    
    marker.appendChild(markerCircle);
    defs.appendChild(marker);

    // Text gradient
    if (this.options.animateText) {
      const textGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      textGradient.setAttribute('id', 'cpu-text-gradient');
      textGradient.setAttribute('x1', '0');
      textGradient.setAttribute('y1', '0');
      textGradient.setAttribute('x2', '1');
      textGradient.setAttribute('y2', '0');
      
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', '#666666');
      const animate1 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animate1.setAttribute('attributeName', 'offset');
      animate1.setAttribute('values', '-2; -1; 0');
      animate1.setAttribute('dur', '5s');
      animate1.setAttribute('repeatCount', 'indefinite');
      animate1.setAttribute('calcMode', 'spline');
      animate1.setAttribute('keyTimes', '0; 0.5; 1');
      animate1.setAttribute('keySplines', '0.4 0 0.2 1; 0.4 0 0.2 1');
      stop1.appendChild(animate1);
      textGradient.appendChild(stop1);
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '25%');
      stop2.setAttribute('stop-color', 'white');
      const animate2 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animate2.setAttribute('attributeName', 'offset');
      animate2.setAttribute('values', '-1; 0; 1');
      animate2.setAttribute('dur', '5s');
      animate2.setAttribute('repeatCount', 'indefinite');
      animate2.setAttribute('calcMode', 'spline');
      animate2.setAttribute('keyTimes', '0; 0.5; 1');
      animate2.setAttribute('keySplines', '0.4 0 0.2 1; 0.4 0 0.2 1');
      stop2.appendChild(animate2);
      textGradient.appendChild(stop2);
      
      const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop3.setAttribute('offset', '50%');
      stop3.setAttribute('stop-color', '#666666');
      const animate3 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animate3.setAttribute('attributeName', 'offset');
      animate3.setAttribute('values', '0; 1; 2;');
      animate3.setAttribute('dur', '5s');
      animate3.setAttribute('repeatCount', 'indefinite');
      animate3.setAttribute('calcMode', 'spline');
      animate3.setAttribute('keyTimes', '0; 0.5; 1');
      animate3.setAttribute('keySplines', '0.4 0 0.2 1; 0.4 0 0.2 1');
      stop3.appendChild(animate3);
      textGradient.appendChild(stop3);
      
      defs.appendChild(textGradient);
    }

    svg.appendChild(defs);
    return svg;
  }

  render(container) {
    const cpuElement = this.create();
    if (typeof container === 'string') {
      const element = document.querySelector(container);
      if (element) {
        element.appendChild(cpuElement);
      }
    } else if (container && container.appendChild) {
      container.appendChild(cpuElement);
    }
    return cpuElement;
  }
}

// Export for use
window.CpuArchitecture = CpuArchitecture;
