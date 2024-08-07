// fruits.js 불러오기
import { FRUITS } from "./fruits.js";

// 모듈 불러오기
let Engine = Matter.Engine,
    Runner = Matter.Runner,
    Render = Matter.Render,
    Bodies = Matter.Bodies,
    World = Matter.World,
    Body = Matter.Body,
    // 이벤트 사용을 위해 추가
    Events = Matter.Events;

// 엔진 선언
const engine = Engine.create();

// 렌더 선언(배경)
const render = Render.create({
    engine,
    element: document.body,
    options: {
        wireframes: false, // true: 배경색 적용 안됌
        background: "#f7f4c8",
        width: 565,
        height: 850
    }
});

// 벽 배치를 위한 world 선언
const world = engine.world;

// 왼쪽 벽 생성
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true, // 벽 고정 기능
    render: { fillStyle: '#e6b143' }
})

// 오른쪽 벽 생성
const rightWall = Bodies.rectangle(550, 395, 30, 790, {
    isStatic: true, // 벽 고정 기능
    render: { fillStyle: '#e6b143' }
})

// 바닥 생성
const ground = Bodies.rectangle(280, 820, 620, 60, {
    isStatic: true, // 벽 고정 기능
    render: { fillStyle: '#e6b143' }
})

// 종료 라인 생성
const topLine = Bodies.rectangle(310, 150, 620, 2, {
    isStatic: true, // 벽 고정 기능
    isSensor: true, // 물리는 적용하지 않지만 충돌은 감지
    render: { fillStyle: '#e6b143' }
})

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;

let disable = false;
// 과일 떨어지는 함수 선언
function addFruits() {

    // 불러올 과일 번호
    let index = Math.floor(Math.random() * 5);
    console.log(index);
    const fruit = FRUITS[index];
    const body = Bodies.circle(300, 15, fruit.radius, {
        index,
        isSleeping: false,
        render: {
            sprite: { texture: `${fruit.name}.png` },
        },
        restitution: .5,
    })
    currentBody = body;
    currentFruit = fruit;
    World.add(world, body);
}

// 키보드 입력받기
window.onkeydown = (event) => {


    if(disable)
        return;

    switch (event.code) {
        case "KeyA":
            if(currentBody.position.x - currentFruit.radius > 30)
            Body.setPosition(currentBody, {
                x: currentBody.position.x - 10,
                y: currentBody.position.y,
            });
            break;
        case "KeyD":
            if(currentBody.position.y + currentFruit.radius < 535)
            Body.setPosition(currentBody, {
                x: currentBody.position.x + 10,
                y: currentBody.position.y,
            });
            break;
        case "KeyS":
            currentBody.isSleeping = false;
            disable = true;

            setTimeout(() => {
                addFruits();
                disable = false;
            }, 1000);
            break;
    }
}

Events.on(engine, "collisionStart", (event) => {
    // 모든 과일에 대해 충돌 판정
    event.pairs.forEach((collision) => {
        // 같은 과일인지 충돌 판정
        if(collision.bodyA.index == collision.bodyB.index) {
            const index = collision.bodyA.index;

            if(index === FRUITS.length - 1) {
                return;
            }
            // 같은 과일 두개를 지움
            World.remove(world, [collision.bodyA, collision.bodyB]);

            const newFruit = FRUITS[index + 1];
            const newBody = Bodies.circle(
                // 부딪힌 지점의 x, y값을 넣음
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius,
                {
                    // 과일이 합쳐져서 index 1증가
                    index: index + 1,
                    // 렌더 새로 해주기
                    render: {sprite: {texture : `${newFruit.name}.png`}}
                }
            );

            World.add(world, newBody);
        };
    })
});

addFruits();