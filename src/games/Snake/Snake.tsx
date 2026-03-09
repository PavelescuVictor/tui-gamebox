import type { KeyEvent } from '@opentui/core';
import { useTerminalDimensions, useKeyboard } from "@opentui/react";
import { BorderBox } from "core/components";
import { DefaultTheme } from 'core/themes';
import { useEffect, useState, useMemo } from "react";

const GAME_SPEED = 16;
const SNAKE_SPEED = {
    horizontal: 3,
    vertical: 3,
};

type Pixel = {
    position: Position
    character: RenderableCharacter;
};

interface Renderable {
    get pixels(): Pixel[];
}

type CollisionBox = {
    xCoord: number;
    yCoord: number;
    width: number;
    height: number;
}

interface Collidable {
    get bounds(): CollisionBox;
    collides(firstEntity: Collidable, secondEntity: Collidable): boolean;
    intersects(firstEntityColisionBox: CollisionBox, secondEntityColisionBox: CollisionBox): boolean;
}

class Canvas {
    width: number;
    height: number;
    cells: string[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.cells = Array.from({ length: height }, () =>
            Array.from({ length: width }, () => " ")
        );
    }

    clear() {
        for (let yCoord = 0; yCoord < this.height; yCoord++) {
            for (let xCoord = 0; xCoord < this.width; xCoord++) {
                this.cells[yCoord][xCoord] = " ";
            }
        }
    }

    setCell(xCoord: number, yCoord: number, character: RenderableCharacter) {
        if (xCoord < 0 || xCoord >= this.width || yCoord < 0 || yCoord >= this.height) {
            return;
        }

        this.cells[yCoord][xCoord] = character.value;
    }

    draw(renderable: Renderable) {
        for (const pixel of renderable.pixels) {
            this.setCell(pixel.position.xCoord, pixel.position.yCoord, pixel.character)
        }
    }

    drawAll(renderables: Set<Renderable>) {
        for (const renderable of renderables) {
            this.draw(renderable);
        }
    }

    drawScene(scene: Scene) {
        this.clear();
        this.drawAll(scene.renderables);
    }

    toLines(): string[] {
        return this.cells.map((row) =>
            row.map((cell) => cell.repeat(2)).join("")
        );
    }
}

class Position {
    #xCoord = 0;
    #yCoord = 0;

    constructor(newXCoord = 0, newYCoord = 0) {
        this.#xCoord = newXCoord;
        this.#yCoord = newYCoord;
    }

    get xCoord() {
        return this.#xCoord;
    }

    get yCoord() {
        return this.#yCoord;
    }

    set xCoord(newXCoord: number) {
        this.#xCoord = newXCoord;
    }

    set yCoord(newYCoord: number) {
        this.#yCoord = newYCoord;
    }

    get value() {
        return {
            xCoord: this.#xCoord,
            yCoord: this.#yCoord,
        };
    }

    set value({ xCoord, yCoord }: { xCoord: number, yCoord: number }) {
        this.#xCoord = xCoord;
        this.#yCoord = yCoord;
    }
}

class RenderableCharacter {
    #value: string;

    constructor(newChar = "■") {
        this.#value = newChar;
    }

    get value() { return this.#value }

    set value(newValue: string) { this.#value = newValue }
}

abstract class Entity implements Renderable, Collidable {
    #position = new Position();
    #character = new RenderableCharacter();

    constructor(
        position: Position | null = null,
        character: RenderableCharacter | null = null
    ) {
        this.#position = position ?? new Position();
        this.#character = character ?? new RenderableCharacter();
    }

    get position() { return this.#position }

    set position(position: Position) { this.#position = position }

    get character() { return this.#character }

    set character(newValue: RenderableCharacter) { this.#character = newValue }

    abstract get pixels(): Pixel[]

    get bounds(): CollisionBox {
        return {
            xCoord: this.position.xCoord,
            yCoord: this.position.yCoord,
            width: 1,
            height: 1,
        };
    }

    intersects(entityCollisionBox: CollisionBox): boolean {
        return (
            this.bounds.xCoord < entityCollisionBox.xCoord + entityCollisionBox.width &&
            this.bounds.xCoord + this.bounds.width > entityCollisionBox.xCoord &&
            this.bounds.yCoord < entityCollisionBox.yCoord + entityCollisionBox.height &&
            this.bounds.yCoord + this.bounds.height > entityCollisionBox.yCoord
        );
    }

    collides(entity: Collidable): boolean {
        if (
            this.bounds.width === 1 &&
            this.bounds.height === 1 &&
            entity.bounds.width === 1 &&
            entity.bounds.height === 1 &&
            this.bounds.xCoord === entity.bounds.xCoord &&
            this.bounds.yCoord === entity.bounds.yCoord
        ) {
             return true;
        }

        return this.intersects(entity.bounds);
    }
}

class Snake extends Entity {
    #head: Position;
    #segments: Position[] = [];
    #pendingGrowth = 0;

    constructor(startPosition = new Position, character = new RenderableCharacter()) {
        super(startPosition, character);

        const head = new Position(startPosition.xCoord, startPosition.yCoord);
        this.#head = head;

        this.#segments = [
            head,
            new Position(startPosition.xCoord - 1, startPosition.yCoord),
            new Position(startPosition.xCoord - 2, startPosition.yCoord),
        ];

    }

    get head(): Position { return this.#head }
    get segments(): Position[] { return this.#segments }
    get length(): number { return this.#segments.length }

    grow(amount = 1) {
        this.#pendingGrowth += amount;
    }

    moveBy(dx: number, dy: number) {
        this.moveTo(new Position(
            this.head.xCoord + dx,
            this.head.yCoord + dy
        ));
    }

    moveTo(newHead: Position) {
        this.#head = newHead;
        this.#segments = [newHead, ...this.#segments];

        if (this.#pendingGrowth > 0) {
            this.#pendingGrowth--;
        } else {
            this.#segments.pop();
        }

        this.position = newHead;
    }

    hitsItself(): boolean {
        const head = this.#head;
        const [_, ...body] = this.#segments;

        return body.some(segment =>
            segment.xCoord === head.xCoord &&
            segment.yCoord === head.yCoord
        );
    }

    occupies(position: Position): boolean {
        return this.#segments.some(segment =>
            segment.xCoord === position.xCoord &&
            segment.yCoord === position.yCoord
        );
    }

    override get pixels(): Pixel[] {
        return this.#segments.map((segment) => ({
            position: segment,
            character: this.character,
        }));
    }
}

class Food extends Entity {
    constructor(position = new Position, character = new RenderableCharacter()) {
        super(position, character);
    }

    override get pixels(): Pixel[] {
         return [{
            position: this.position,
            character: this.character,
        }]
    }
}

class Engine {
    #loopTimeoutId: NodeJS.Timeout | null = null;
    #tickCount: number = 0;
    #onTick: ((tick: number) => void) | null = null;
    constructor() {}

    set onTick(handler: (tick: number) => void) {
        this.#onTick = handler;
    };

    get tickCount() { return this.#tickCount };

    reset() {
        if (this.#loopTimeoutId) {
            clearInterval(this.#loopTimeoutId);
            this.#loopTimeoutId = null;
        }
        this.#tickCount = 0;
    };

    start() {
        this.reset()

        this.#loopTimeoutId = setInterval(() => {
            this.#tickCount++;

            if (this.#onTick) {
                this.#onTick(this.#tickCount);
            }
        }, GAME_SPEED);
    };

    pause() {
        this.reset()
    };
}

class Scene {
    #entities: Set<Entity> = new Set();

    constructor(entities: Set<Entity> = new Set()) {
        this.#entities = entities;
    }

    get renderables() { return this.#entities };

    set renderables(entities: Set<Entity>) { this.#entities = entities }

    addEntity(entity: Entity) {
        this.#entities.add(entity);
    }

    deleteEntity(entity: Entity) {
        this.#entities.delete(entity);
    }
}

class Game {
    #engine: Engine = new Engine();
    #keyboardManager: KeyboardManager = new KeyboardManager();
    #canvas: Canvas = new Canvas(0, 0);
    #scene: Scene = new Scene();

    snake: Snake | null = null;
    food: Food | null = null;

    direction: KeysType = KEYS.Right;

    constructor() {}

    get engine() { return this.#engine };

    get keyboardManager() { return this.#keyboardManager };
    set keyboardManager(newKeyboardManager: KeyboardManager) { this.#keyboardManager = newKeyboardManager }

    get canvas() { return this.#canvas };
    set canvas(newCanvas : Canvas) { this.#canvas = newCanvas }

    get scene() { return this.#scene };
    set scene(newScene: Scene) { this.#scene = newScene }

    wrapPosition(position: Position): Position {
        let xCoord = position.xCoord;
        let yCoord = position.yCoord;

        if (xCoord < 0) {
            xCoord = this.canvas.width - 1;
        }
        if (xCoord >= this.canvas.width) {
            xCoord = 0;
        }
        if (yCoord < 0) {
            yCoord = this.canvas.height - 1;
        }
        if (yCoord >= this.canvas.height) {
            yCoord = 0;
        }

        return new Position(xCoord, yCoord);
    }

    update(tick: number) {
        if (!this.snake) return;

        let dx = 0;
        let dy = 0;

        switch (this.direction) {
            case KEYS.Right:
                if (tick % SNAKE_SPEED.horizontal === 0) dx = 1;
                break;
            case KEYS.Left:
                if (tick % SNAKE_SPEED.horizontal === 0) dx = -1;
                break;
            case KEYS.Up:
                if (tick % SNAKE_SPEED.vertical === 0) dy = -1;
                break;
            case KEYS.Down:
                if (tick % SNAKE_SPEED.vertical === 0) dy = 1;
                break;
        }

        if (dx !== 0 || dy !== 0) {
            const nextHead = this.wrapPosition(
                new Position(
                    this.snake.head.xCoord + dx,
                    this.snake.head.yCoord + dy
                )
            );

            this.snake.moveTo(nextHead);
        }

        if (this.food && this.snake.collides(this.food)) {
            this.snake.grow(1);

            let newFoodPosition = new Position(
                getRandomInRange(0, this.canvas.width - 1),
                getRandomInRange(0, this.canvas.height - 1)
            );

            while (this.snake.occupies(newFoodPosition)) {
                newFoodPosition = new Position(
                    getRandomInRange(0, this.canvas.width - 1),
                    getRandomInRange(0, this.canvas.height - 1)
                );
            }

            this.food.position = newFoodPosition;
        }

        if (this.snake.hitsItself()) {
            this.engine.pause();
        }
    }

    render() {
        this.canvas.drawScene(this.scene);
    }
}

type KeysType = "right" | 'left' | 'up' | 'down'

const KEYS = {
    Right: 'right' as KeysType,
    Left: 'left' as KeysType,
    Up: 'up' as KeysType,
    Down: 'down' as KeysType,
}

class KeyboardManager {
    #keyHandlerMap: Map<KeysType, () => void> = new Map();

    constructor(keyHandler: Map<KeysType, () => void> = new Map()) {
        this.#keyHandlerMap = keyHandler;
    }

    get keyHandler() { return this.#keyHandlerMap }

    consume(key: KeysType, handler: () => void) {
        this.#keyHandlerMap.set(key, handler);
    }

    unbind(key: KeysType) {
        this.#keyHandlerMap.delete(key);
    }
}

const getRandomInRange = (min = 0, max = 0) => {
   return Math.round(Math.random() * (max - min) + min);
}

function GameRenderer({ canvas }: { canvas: Canvas }) {
    return (
        <box style={{ flexDirection: "column" }}>
            {canvas.cells.map((row, y) => (
                <box key={y} style={{ flexDirection: "row" }}>
                    {row.map((cell, x) => (
                        <box
                            key={x}
                            style={{
                                width: 2,
                                height: 1,
                                backgroundColor: cell !== " " ? DefaultTheme.mauve : undefined,
                            }}
                        />
                    ))}
                </box>
            ))}
        </box>
    );
}

function Pong() {
    const { width, height } = useTerminalDimensions();
    const logicalWidth = Math.floor(width / 2);
    const logicalHeight = height;

    const [, forceRender] = useState(0);

    const game = useMemo(() => new Game(), []);
    const snake = useMemo(() => new Snake(), []);
    const food = useMemo(() => new Food(), []);

    function canChangeDirection(
        current: KeysType,
        next: KeysType,
        snakeLength: number
    ): boolean {
        if (snakeLength <= 1) return true;

        return !(
            (current === KEYS.Right && next === KEYS.Left) ||
            (current === KEYS.Left && next === KEYS.Right) ||
            (current === KEYS.Up && next === KEYS.Down) ||
            (current === KEYS.Down && next === KEYS.Up)
        );
    }

    useEffect(() => {
        const keyboardManager = new KeyboardManager();

        keyboardManager.consume(KEYS.Right, () => {
            if (game.snake && canChangeDirection(game.direction, KEYS.Right, game.snake.length)) {
                game.direction = KEYS.Right;
            }
        });

        keyboardManager.consume(KEYS.Left, () => {
            if (game.snake && canChangeDirection(game.direction, KEYS.Left, game.snake.length)) {
                game.direction = KEYS.Left;
            }
        });

        keyboardManager.consume(KEYS.Up, () => {
            if (game.snake && canChangeDirection(game.direction, KEYS.Up, game.snake.length)) {
                game.direction = KEYS.Up;
            }
        });

        keyboardManager.consume(KEYS.Down, () => {
            if (game.snake && canChangeDirection(game.direction, KEYS.Down, game.snake.length)) {
                game.direction = KEYS.Down;
            }
        });

        game.keyboardManager = keyboardManager;
    }, [game]);

    useKeyboard((key: KeyEvent) => {
        const keyHandler = game.keyboardManager.keyHandler.get(key.name as KeysType);
        if (!keyHandler) {
            return;
        }

        keyHandler();
    });

    useEffect(() => {
        game.canvas = new Canvas(logicalWidth, logicalHeight);

        snake.position = new Position(
            getRandomInRange(0, logicalWidth - 1),
            getRandomInRange(0, logicalHeight - 1)
        );

        snake.character = new RenderableCharacter("█");

        food.position = new Position(
            getRandomInRange(0, logicalWidth - 1),
            getRandomInRange(0, logicalHeight - 1)
        );
        food.character = new RenderableCharacter("█");

        const scene = new Scene();
        scene.addEntity(snake);
        scene.addEntity(food);

        game.scene = scene;
        game.snake = snake;
        game.food = food;

        game.render();
        forceRender(n => n + 1);
    }, [game, snake, food, logicalWidth, logicalHeight]);

    useEffect(() => {
        game.engine.onTick = (tick) => {
            game.update(tick);
            game.render();
            forceRender(n => n + 1);
        };

        game.engine.start();

        return () => {
            game.engine.pause();
        };
    }, [game]);

    return (
        <BorderBox style={{ flexDirection: "column" }}>
            <GameRenderer canvas={game.canvas} />
        </BorderBox>
    );
}

export default Pong;
