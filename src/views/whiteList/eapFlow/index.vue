<template>
  <div>
    <div style="margin: 15px">
      <el-input
        v-model="flowData"
        placeholder="请输入流程数据"
        clearable
        class="input-with-select"
      >
        <el-button
          slot="append"
          icon="el-icon-refresh"
          @click="onSubmit"
        />
        <el-button
          slot="append"
          icon="el-icon-download"
          @click="onDownload"
        />
      </el-input>
    </div>
    <div
      id="container"
      style="
        margin: 10px 20px 15px 25px;
        border-style: solid;
        border-width: 2px;
        border-color: #f6bd16;
        margin-top: 15px;
        height: 700px;
      "
    />
  </div>
</template>

<script>
import G6 from '@antv/g6'
import { isNumber, isArray } from '@antv/util'

export default {
  data() {
    return {
      data: {
        nodes: [
          {
            id: 'A',
            x: 100,
            y: 100,
            label: 'A'
          },
          {
            id: 'B',
            x: 200,
            y: 120,
            label: 'B'
          },
          {
            id: 'C',
            x: 300,
            y: 140,
            label: 'C'
          }
        ],
        edges: [
          {
            source: 'A',
            target: 'B'
          },
          {
            source: 'B',
            target: 'C'
          },
          {
            source: 'C',
            target: 'C'
          }
        ]
      },
      flowData: null,
      graph: null
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {},
  methods: {
    isValidJSON(str) {
      try {
        JSON.parse(str)
        return true
      } catch (e) {
        return false
      }
    },
    onSubmit() {
      this.formatData()
      this.graph.clear()
      this.graph.destroy()
      this.initGraph2()
      this.graph.setTextWaterMarker(['AntV-G6', 'EAP Flow']) // 水印
    },
    onDownload() {
      this.graph.downloadImage()
    },
    formatData() {
      if (this.isValidJSON(this.flowData)) {
        // 提取节点数据
        const currentData = JSON.parse(this.flowData, null, 2)
        console.log(currentData)
        const nodes = currentData.data.items.map((item) => ({
          id: item.state,
          label: item.state,
          x: 0,
          y: 0,
          size: [90, 60],
          type: item.state === 'IDLE' ? 'circle' : 'rect', // aggregated-node
          tableId: item.id,
          skip: item.skip,
          timeOut: item.timeOut,
          eqpId: item.eqpId,
          factory: item.factory,
          model: item.model
        }))

        // 提取边数据
        const edges = []
        currentData.data.items.forEach((item) => {
          item.triggers.forEach((trigger) => {
            edges.push({
              source: item.state,
              target: trigger.destinationState,
              label: trigger.trigger,
              tableId: trigger.id,
              eqpId: item.eqpId,
              factory: item.factory,
              model: item.model
            })
          })
        })

        // 组装成目标格式
        const result = {
          nodes: nodes,
          edges: edges
        }

        console.log(JSON.stringify(result, null, 2))
        this.data = result
      } else {
        console.log('input json error')
      }
    },
    init() {
      this.initGraph2()
    },
    initGraph2() {
      // Custom real node
      const darkBackColor = 'rgb(43, 47, 51)'
      const disableColor = '#777'
      const theme = 'dark'
      const subjectColors = [
        '#5F95FF', // blue
        '#61DDAA',
        '#65789B',
        '#F6BD16',
        '#7262FD',
        '#78D3F8',
        '#9661BC',
        '#F6903D',
        '#008685',
        '#F08BB4'
      ]
      const colorSets = G6.Util.getColorSetsBySubjectColors(
        subjectColors,
        darkBackColor,
        theme,
        disableColor
      )
      G6.registerNode(
        'aggregated-node',
        {
          draw(cfg, group) {
            const width = 53
            const height = 27
            const style = cfg.style || {}
            const colorSet = cfg.colorSet || colorSets[0]

            // halo for hover
            group.addShape('rect', {
              attrs: {
                x: -width * 0.55,
                y: -height * 0.6,
                width: width * 1.1,
                height: height * 1.2,
                fill: colorSet.mainFill,
                opacity: 0.9,
                lineWidth: 0,
                radius: (height / 2 || 13) * 1.2
              },
              name: 'halo-shape',
              visible: false
            })

            // focus stroke for hover
            group.addShape('rect', {
              attrs: {
                x: -width * 0.55,
                y: -height * 0.6,
                width: width * 1.1,
                height: height * 1.2,
                fill: colorSet.mainFill, // '#3B4043',
                stroke: '#AAB7C4',
                lineWidth: 1,
                lineOpacty: 0.85,
                radius: (height / 2 || 13) * 1.2
              },
              name: 'stroke-shape',
              visible: false
            })

            const keyShape = group.addShape('rect', {
              attrs: {
                ...style,
                x: -width / 2,
                y: -height / 2,
                width,
                height,
                fill: colorSet.mainFill, // || '#3B4043',
                stroke: colorSet.mainStroke,
                lineWidth: 2,
                cursor: 'pointer',
                radius: height / 2 || 13,
                lineDash: [2, 2]
              },
              name: 'aggregated-node-keyShape'
            })

            let labelStyle = {}
            if (cfg.labelCfg) {
              labelStyle = Object.assign(labelStyle, cfg.labelCfg.style)
            }
            group.addShape('text', {
              attrs: {
                text: `${cfg.count}`,
                x: 0,
                y: 0,
                textAlign: 'center',
                textBaseline: 'middle',
                cursor: 'pointer',
                fontSize: 12,
                fill: '#fff',
                opacity: 0.85,
                fontWeight: 400
              },
              name: 'count-shape',
              className: 'count-shape',
              draggable: true
            })

            // tag for new node
            if (cfg.new) {
              group.addShape('circle', {
                attrs: {
                  x: width / 2 - 3,
                  y: -height / 2 + 3,
                  r: 4,
                  fill: '#6DD400',
                  lineWidth: 0.5,
                  stroke: '#FFFFFF'
                },
                name: 'typeNode-tag-circle'
              })
            }
            return keyShape
          },
          setState: (name, value, item) => {
            const group = item.get('group')
            if (name === 'layoutEnd' && value) {
              const labelShape = group.find(
                (e) => e.get('name') === 'text-shape'
              )
              if (labelShape) labelShape.set('visible', true)
            } else if (name === 'hover') {
              if (item.hasState('focus')) {
                return
              }
              const halo = group.find((e) => e.get('name') === 'halo-shape')
              const keyShape = item.getKeyShape()
              const colorSet = item.getModel().colorSet || colorSets[0]
              if (value) {
                halo && halo.show()
                keyShape.attr('fill', colorSet.activeFill)
              } else {
                halo && halo.hide()
                keyShape.attr('fill', colorSet.mainFill)
              }
            } else if (name === 'focus') {
              const stroke = group.find(
                (e) => e.get('name') === 'stroke-shape'
              )
              const keyShape = item.getKeyShape()
              const colorSet = item.getModel().colorSet || colorSets[0]
              if (value) {
                stroke && stroke.show()
                keyShape.attr('fill', colorSet.selectedFill)
              } else {
                stroke && stroke.hide()
                keyShape.attr('fill', colorSet.mainFill)
              }
            }
          },
          update: undefined
        },
        'single-node'
      )

      // 虚线运动
      const lineDash = [4, 2, 1, 2]
      G6.registerEdge(
        'line-dash',
        {
          afterDraw(cfg, group) {
            // get the first shape in the group, it is the edge's path here=
            const shape = group.get('children')[0]
            let index = 0
            // Define the animation
            shape.animate(
              () => {
                index++
                if (index > 9) {
                  index = 0
                }
                const res = {
                  lineDash,
                  lineDashOffset: -index
                }
                // returns the modified configurations here, lineDash and lineDashOffset here
                return res
              },
              {
                repeat: true, // whether executes the animation repeatly
                duration: 2000 // the duration for executing once
              }
            )
          }
        },
        'line' // extend the built-in edge 'cubic'
      )

      // plugins tooltip
      const tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 10,
        fixToNode: [1, 0.5],
        // the types of items that allow the tooltip show up
        // 允许出现 tooltip 的 item 类型
        itemTypes: ['node', 'edge'],
        // custom the tooltip's content
        // 自定义 tooltip 内容
        getContent: (e) => {
          const outDiv = document.createElement('div')
          outDiv.style.width = 'fit-content'
          outDiv.style.height = 'fit-content'
          const model = e.item.getModel()
          if (e.item.getType() === 'node') {
            outDiv.innerHTML = `
                         ${model.label}
            <br/>factory:${model.factory}
            <br/>eqpId:${model.eqpId}
            <br/>skip:${model.skip}
            <br/>timeOut:${model.timeOut}`
          } else {
            const source = e.item.getSource()
            const target = e.item.getTarget()

            outDiv.innerHTML = `来源：${source.getModel().id}
            <br/>触发：${source.getModel()}
            <br/>去向：${target.getModel().id}`
          }
          return outDiv
        }
      })

      // plugins Minimap
      const minimap = new G6.Minimap({
        size: [150, 100]
      })

      // plugins grid
      const grid = new G6.Grid()

      const width = document.getElementById('container').scrollWidth
      const height = document.getElementById('container').scrollHeight || 400
      this.graph = new G6.Graph({
        container: 'container',
        width,
        height,
        fitCenter: true,
        fitView: true,
        plugins: [minimap, tooltip, grid],
        modes: {
          default: [
            'drag-canvas',
            'drag-node',
            'zoom-canvas',
            'click-select',
            // "edge-tooltip", // 边提示
            // "tooltip",  //tip 提示
            'brush-select',
            'activate-relations' // 高亮相邻节点
          ]
        },
        layout: {
          type: 'dagre',
          rankdir: 'LR',
          align: 'UL',
          controlPoints: true,
          preventOverlap: true,
          nodeSize: 50,
          // workerEnabled: true, // 是否启用 webworker
          // gpuEnabled: true, //// 是否使用 gpu 版本的布局算法
          nodesepFunc: () => 1,
          ranksepFunc: () => 1
        },
        // 节点
        defaultNode: {
          size: [90, 60],
          type: 'rect', // 矩形
          labelCfg: {
            position: 'center',
            offset: 5,
            style: {
              fontSize: 20
            }
          },
          style: {
            lineWidth: 1,
            stroke: '#5B8FF9',
            fill: '#C6E5FF',
            cursor: 'pointer'
          }
        },
        defaultEdge: {
          type: 'line-dash',
          // 边上的标签文本配置
          labelCfg: {
            autoRotate: true // 边上的标签文本根据边的方向旋转
          },
          style: {
            lineWidth: 2,
            radius: 10,
            offset: 30,
            endArrow: true,
            stroke: '#61DDAA',
            cursor: 'pointer'
          }
        },
        // edge 边颜色
        edgeStateStyles: {
          // edge style of active state
          active: {
            opacity: 0.5,
            stroke: '#FF0000',
            lineWidth: 3
          },
          // edge style of selected state
          selected: {
            stroke: '#7262FD',
            lineWidth: 3
          }
        }
      })

      this.graph.data(this.data)
      this.graph.render()

      this.graph.on('edge:mouseenter', (evt) => {
        const { item } = evt
        this.graph.setItemState(item, 'active', true)
      })

      this.graph.on('edge:mouseleave', (evt) => {
        const { item } = evt
        this.graph.setItemState(item, 'active', false)
      })

      this.graph.on('edge:click', (evt) => {
        const { item } = evt
        this.graph.setItemState(item, 'selected', true)
      })
      this.graph.on('canvas:click', (evt) => {
        this.graph.getEdges().forEach((edge) => {
          this.graph.clearItemStates(edge)
        })
      })
    }
  }
}
</script>

<style scoped>
.container {
  margin-top: 15px;
}
</style>
