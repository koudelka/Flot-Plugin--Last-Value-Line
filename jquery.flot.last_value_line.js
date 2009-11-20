/*
 
  === Flot Last Value Line

  == Adds a horizontal line across the chart, at the height of the last value.

  == Usage
    - If left alone, the plugin will automatically figure view options based
      on each series' various settings. (same color, half the width, 75% alpha)

    - If you wish to turn on only specific series, you can simply provide an
      array of series indicies to options['last_value_line']['series']

    - Examples:

      To turn on only series zero and four, with automatic view options:

      last_value_line: {
        series: [0, 4]
      }

      To turn on series zero, with a white, half-transparent, 10-thick line:

      last_value_line: {
        series: {
          0: {
            color: '#ffffff',
            alpha: 0.5,
            width: 10
          }
        }
      }


  == Credits
    - Authored by Michael Shapiro (koudelka@ryoukai.org)
    - Many thanks to my employeer, The Hive (thehive.com), for sponsoring the
      plugin's development and allowing me to give back to the flot community.

  == License
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function ($) {

  var options = {
    last_value_line: {
      series: null,
    }
  }
    
  function init(plot) {
    plot.hooks.draw.push(function(plot, ctx) {

      options = plot.getOptions()['last_value_line']

      for (var i=0 ; i < plot.getData().length ; i++) {

        // Hack to allow either array or hash
        if (options['series']) {
          var keys = []
          for (var k in options['series'])
            keys.push(k)

          if (!keys.include(i))
            continue
        }

        var series = plot.getData()[i],
            datapoints = series['datapoints']['points'],

            first_datapoint = [datapoints[0], datapoints[1]],
            first_datapoint_coords = {
              x: series.xaxis.p2c(first_datapoint[0]),
              y: series.yaxis.p2c(first_datapoint[1])
            },

            last_datapoint = [datapoints[datapoints.length-2], datapoints[datapoints.length-1]],
            last_datapoint_coords = {
              x: series.xaxis.p2c(last_datapoint[0]),
              y: series.yaxis.p2c(last_datapoint[1])
            },

            style_options = options['series'] ? (options['series'][i] || {}) : {}
        
        style_options['color'] = style_options['color'] || series['color']
        style_options['width'] = style_options['width'] || series['lines']['lineWidth']/2.0
        style_options['alpha'] = style_options['alpha'] || 0.75

        ctx.save()

        ctx.strokeStyle = style_options['color']
        ctx.lineWidth   = style_options['width']
        ctx.globalAlpha = style_options['alpha']

        var plotOffset = plot.getPlotOffset()
        ctx.translate(plotOffset.left, plotOffset.top)

        ctx.beginPath()

        ctx.moveTo(first_datapoint_coords.x, last_datapoint_coords.y)
        ctx.lineTo(last_datapoint_coords.x, last_datapoint_coords.y)

        ctx.closePath()
        ctx.stroke()
        ctx.restore()

      }

    })
  }
  
  $.plot.plugins.push({
      init: init,
      options: options,
      name: 'last_value_line',
      version: '0.1'
  })

})(jQuery)

