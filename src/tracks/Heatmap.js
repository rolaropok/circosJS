import Track from './Track'
import { parseSpanValueData } from '../data-parser'
import { arc } from 'd3-shape'
import assign from 'lodash/assign'
import { radial, values, common } from '../configs'

const defaultConf = assign({
  color: {
    value: 'Spectral',
    iteratee: false
  },
  backgrounds: {
    value: [],
    iteratee: false
  }
}, radial, values, common)

export default class Heatmap extends Track {
  constructor(instance, conf, data) {
    super(instance, conf, defaultConf, data, parseSpanValueData)
  }

  renderDatum(parentElement, conf, layout) {
    if (conf.border) {
      parentElement
        .selectAll('tile')
        .data((d) => d.values)
        .enter()
        .append('path')
        .attr('class', 'tile')
        .attr('opacity', conf.opacity)
        .attr('d', arc()
          .innerRadius(conf.innerRadius)
          .outerRadius(conf.outerRadius)
          .startAngle((d, i) => this.theta(d.start, layout.blocks[d.block_id]))
          .endAngle((d, i) => this.theta(d.end, layout.blocks[d.block_id]))
        )
        .style('stroke', d => {
          if (d.value === 2) return 'rgba(0,0,0,0)';
          if (conf.cmin !== undefined && conf.cmax !== undefined) {
            const opacity = 1 - (d.value - conf.cmin) * 0.7 / (conf.cmax - conf.cmin);
            return `rgba(0, 0, 0, ${opacity})`;
          }
          const opacity = 1 - d.value * 0.7 / 10;
          return `rgba(0, 0, 0, ${opacity})`;
        })
        .style('stroke-width', '2')
        .style('fill', 'none')
    }

    return parentElement
      .selectAll('tile')
      .data((d) => d.values)
      .enter()
      .append('path')
      .attr('class', 'tile')
      .attr('opacity', conf.opacity)
      .attr('d', arc()
        .innerRadius(conf.innerRadius)
        .outerRadius(conf.outerRadius)
        .startAngle((d, i) => this.theta(d.start, layout.blocks[d.block_id]))
        .endAngle((d, i) => this.theta(d.end, layout.blocks[d.block_id]))
      )
      .attr('fill', conf.colorValue)
  }
}
