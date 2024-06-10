
// 모듈 불러오기
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  World = Matter.World;

//엔진 선언
const engine = Engine.create();

// 렌더 선언(배경)
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false, //true면 배경색이 지정 안됨
    background: '#F7F4C8',
    width: 565,
    height: 850,
  }
});

// 벽 배치를 위한 world 선언
const world = engine.world;

// 왼쪽 벽 생성
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: '#E6B143' },
});

const rightWall = Bodies.rectangle(550, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: '#E6B143' },
});

// 바닥 생성
const ground = Bodies.rectangle(280, 820, 620, 60, {
    isStatic: true,
    render: {fillStyle: '#E6B143'},
});

const topLine = Bodies.rectangle(280, 820, 620, 2, {
    isStatic: true,
    render: {fillStyle: '#E6B143'},
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);
