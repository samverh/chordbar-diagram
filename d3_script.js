var matrix = 
      [[0, 0, 0, 12, 6, 0, 6, 0, 13, 0, 12, 0, 0, 6, 0],
      [0, 0, 21, 0, 0, 22, 0, 0, 9, 32, 0, 0, 0, 0, 13],
      [0, 21, 0, 0, 0, 8, 0, 0, 0, 0, 7, 0, 0, 0, 0],
      [12, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 14, 15, 14, 11],
      [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 0, 0, 0],
      [0, 22, 8, 0, 0, 0, 14, 0, 0, 0, 0, 0, 10, 0, 0],
      [6, 0, 0, 0, 0, 14, 0, 0, 0, 0, 9, 0, 6, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 6, 7, 0],
      [13, 9, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 9],
      [0, 32, 0, 6, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 17],
      [12, 0, 7, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 14, 13, 0, 0, 7, 0, 0, 0, 0, 21, 14, 0],
      [0, 0, 0, 15, 0, 10, 6, 6, 0, 0, 0, 21, 0, 0, 0],
      [6, 0, 0, 14, 0, 0, 0, 7, 0, 0, 0, 14, 0, 0, 0],
      [0, 13, 0, 11, 0, 0, 0, 0, 9, 17, 0, 0, 0, 0, 0]];

    var names = ['Klacht',
      'Onderhoud',
      'Afspraak',
      'Storing',
      'Lekkage',
      'Ketel',
      'Lawaai',
      'Verbruik',
      'Offerte',
      'Contract',
      'Ventilatie',
      'Verwarming',
      'Warm water',
      'Thermostaat',
      'Warmtepomp'];

    // diagram
    const chord = d3.chord()
      .padAngle(0.03)
      .sortSubgroups(d3.ascending)

    const chords = chord(matrix);
    console.log(chords)

    // sizes
    // var width = 700;
    // var height = 700;
    
    // colormap and gradient
    var color20 = d3.scaleSequential().domain([1, names.length]).interpolator(d3.interpolateRainbow);
    function getGradID(d){ return "linkGrad-" + d.source.index + "-" + d.target.index; }

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom
    var innerRadius = width / 2 * 0.7;
    var outerRadius = innerRadius + 5;


    // add element
    var svg = d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + width / 2 + "," + ( height/2+100 )+ ")"); // Add 100 on Y translation, cause upper bars are longer


    // draw nodes
    var outer_arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    var g_outer = svg.append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
      .datum(chords);

    var group = g_outer.append("g")
      .attr("class", "groups")
      .selectAll("g")
      .data(function(chords) { return chords.groups; })
      .enter().append("g");

    // add color
    group.append("path")
      .style("fill", function(d) {
        return color20(d.index);
      })
      .style("stroke", function(d) {
        return color20(d.index);
      })
      .attr("d", outer_arc);

    // add text
    group.append("text")
      .attr("dy", ".35em") // width
      .attr("transform", function(d,i) {
        // tekst tussen begin en eind vd streep zetten
        d.angle = (d.startAngle + d.endAngle) / 2;
        d.name = names[i]; 
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
          "translate(" + (outerRadius + 13) + ")" +
          ((d.angle > Math.PI) ? "rotate(180)" : "");
      })
      .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
      .text(function(d) {
        return d.name;
      });

    // gradient
    const grads = svg.append("defs").selectAll("linearGradient")
      .data(chords)
      .enter().append("linearGradient")
      .attr("id", getGradID)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", function(d,i) { return innerRadius * Math.cos((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2); })
      .attr("y1", function(d,i) { return innerRadius * Math.sin((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2); })
      .attr("x2", function(d,i) { return innerRadius * Math.cos((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2); })
      .attr("y2", function(d,i) { return innerRadius * Math.sin((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2); })

    // starting color (at 0%)
    grads.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", function(d){ return color20(d.source.index); });

    // ending color (at 100%)
    grads.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", function(d){ return color20(d.target.index); });
      
    // add chord
    var inner_chord = d3.ribbon()
      .radius(innerRadius - 5);

    // connections
    g_outer.append("g")
    .attr("fill-opacity", .8)
      .attr("class", "ribbons")
      .selectAll("path")
      .data(function(chords) { return chords; })
      .enter().append("path")
      .attr("d", inner_chord)
      .attr("class", "chord")
      .style("fill", function(d){ return "url(#" + getGradID(d) + ")"; })

    const data = [12, 6, 1, 6, 5, 13, 12, 6, 21, 22, 9, 32, 13, 21, 8];
    
    // define scaling ranges
    const xScale = d3.scaleBand()
                    .domain(data.map((d, i) => i))
                    .range([0, 2 * Math.PI])
                    .padding(0.1);

    const yScale = d3.scaleRadial()
                    .domain([innerRadius,outerRadius])
                    .range([250, 0]);

    svg.append("g")
                    .selectAll("path")
                    .data(data)
                    .enter()
                    .append("path")
                      .attr("fill", "#69b3a2")
                      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
                          .innerRadius(innerRadius)
                          .outerRadius(function(d) { return y(d); })
                          .startAngle(function(d) { return x(d); })
                          .endAngle(function(d) { return x(d) + x.bandwidth(); })
                          .padAngle(0.01)
                          .padRadius(innerRadius))
    // bars
    // svg.selectAll("path")
    //     .data(data)
    //     .enter()
    //     .append("path")
    //     .attr("d", d3.arc()
    //         .innerRadius(0)
    //         .outerRadius((d) => yScale(d))
    //         .startAngle((d, i) => xScale(i))
    //         .endAngle((d, i) => xScale(i) + xScale.bandwidth())
    //         .padAngle(0.01)
    //         // .padRadius(10)
    //     )
    //     .attr("fill", "steelblue")
    //     .attr("transform", "translate(250, 250)");

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        // .attr("transform", "translate(150, 250)")
        .attr("x", (d, i) => xScale(i))
        .attr("y", (d) => -yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => yScale(d))
        .attr("fill", "steelblue")
        .attr("transform", (d, i) => {
            const angle = xScale(i);
            console.log((d.startAngle + d.endAngle) / 2);
            return `rotate(${angle * 180 / Math.PI}, 0, 300)`;
        });

    // svg.selectAll("rect")
    //     .attr("dy", ".35em") //width
    //     .attr("transform", function(d,i) {
    //         // tekst tussen begin en eind vd streep zetten
    //         d.angle = (d.startAngle + d.endAngle) / 2;
    //         d.name = names[i]; 
    //         return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
    //         "translate(" + (outerRadius + 13) + ")" +
    //         ((d.angle > Math.PI) ? "rotate(180)" : "");
    //     })
    //     .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)

    //     .data(data)
    //     .enter()
    //     .append("rect")
    //     .attr("x", (d, i) => xScale(i))
    //     .attr("y", (d) => yScale(d))
    //     .attr("width", xScale.bandwidth())
    //     .attr("height", (d) => 250 - yScale(d))
    //     .attr("fill", "steelblue");
