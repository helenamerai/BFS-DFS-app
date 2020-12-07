import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { calculatePath } from '../app/shared/path';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Finder-App';
  maze: any;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  type = null;
  pathGraph: any = [];
  startPos: any;
  targetPos: any;
  grid: any;
  graphGrid: any;

  ngOnInit() {
    this.initMaze();
    this.initGrid('bfs');
  }

  initMaze() {
    this.maze =
      [[0, 1, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 0, 0, 0, 0],
      [1, 0, 0, 1, 0, 1, 1, 0, 1],
      [0, 1, 0, 0, 0, 1, 0, 0, 1],
      [1, 1, 0, 0, 1, 0, 1, 0, 0],
      [0, 1, 1, 0, 1, 0, 0, 0, 0]];
  }

  initGrid(type) {
    this.grid = this.initCells(this.maze, 50, 50);
    this.startPos = '0,0';
    this.targetPos = `${this.grid.data.length - 1},${this.grid.data.length - 1}`;
    this.graphGrid = this.onRenderGrid(this.grid, 'graph', 'white', '#383838');
    this.drawGrid(this.graphGrid, this.grid);
    drawPath(this.graphGrid, makePoint(this.startPos), this.grid.cellWidth, this.grid.cellHeight, 'yellow');
    drawPath(this.graphGrid, makePoint(this.targetPos), this.grid.cellWidth, this.grid.cellHeight, '#0f0');
    this.pathGraph = calculatePath(this.grid, this.startPos, this.targetPos, type);
  }

  onRunClick(type) {
    this.type = type;
    this.initGrid(type);
    this.runPath(100, this.pathGraph[0], this.pathGraph[1], this.graphGrid, this.grid, this.startPos, this.targetPos);
  }

  initCells(maze, width, height) {
    let data = {
      data: maze,
      width: maze[0].length,
      height: maze.reduce(function (acc, row) { return acc + 1; }, 0),
      cellWidth: width,
      cellHeight: height
    }

    return data;
  }

  onRenderGrid(maze, type, bgColor, cellColor) {
    this.canvas = <HTMLCanvasElement>document.getElementById(type);
    this.canvas.width = maze.cellWidth * maze.width;
    this.canvas.height = maze.cellHeight * maze.height;

    return {
      canvasEl: this.canvas,
      ctx: this.canvas.getContext('2d'),
      primaryColor: bgColor,
      secondaryColor: cellColor,
    };
  }

  drawGrid(renderGraph, maze) {
    let ctx = renderGraph.ctx;
    let canvas = renderGraph.canvasEl;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
        let cellType = maze.data[y][x];
        if (cellType === 1) {
          ctx.fillStyle = renderGraph.secondaryColor;
        } else {
          ctx.fillStyle = renderGraph.primaryColor;
        }
        ctx.fillRect(x * maze.cellWidth, y * maze.cellHeight,
          maze.cellWidth, maze.cellHeight);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x * maze.cellWidth, y * maze.cellHeight,
          maze.cellWidth, maze.cellHeight);
      }
    }
  }

  runPath = (num, path, optimal, renderer, map, startPos, targetPos) => {
    let pos = 0;
    function render() {
      if (pos < path.length) {
        drawPath(renderer, makePoint(path[pos]), map.cellWidth, map.cellHeight, '#FBD7F0');
      } else {
        drawPath(renderer, makePoint(targetPos), map.cellWidth, map.cellHeight, 'red');
        optimal.forEach((posi) => {
          drawPath(renderer, makePoint(posi), map.cellWidth, map.cellHeight, 'red');
        });
        return;
      }
      pos += 1;
      setTimeout(render, num);
    }
    renderer.ctx.globalAlpha = 0.55;
    return render();
  };

}

const drawPath = (renderer, point, width, height, color) => {
  renderer.ctx.fillStyle = color;
  renderer.ctx.fillRect(point[0] * width, point[1] * height, width, height);
  renderer.ctx.strokeStyle = "black";
  renderer.ctx.strokeRect(point[0] * width, point[1] * height, width, height);
};

const makePoint = (point) => (
  point.split(',').map((v) => {
    return v | 0;
  })
)


